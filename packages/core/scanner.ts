import { DynamicModule, ForwardReference } from '@nestjs/common';
import {
  EXCEPTION_FILTERS_METADATA,
  GATEWAY_MIDDLEWARES,
  GUARDS_METADATA,
  INTERCEPTORS_METADATA,
  METADATA,
  PIPES_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { Controller } from '@nestjs/common/interfaces/controllers/controller.interface';
import { Injectable } from '@nestjs/common/interfaces/injectable.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import {
  isFunction,
  isNil,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { ApplicationConfig } from './application-config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from './constants';
import { CircularDependencyException } from './errors/exceptions/circular-dependency.exception';
import { NestContainer } from './injector/container';
import { MetadataScanner } from './metadata-scanner';

interface ApplicationProviderWrapper {
  moduleKey: string;
  providerKey: string;
  type: string;
}

export class DependenciesScanner {
  private readonly applicationProvidersApplyMap: ApplicationProviderWrapper[] = [];
  constructor(
    private readonly container: NestContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly applicationConfig = new ApplicationConfig(),
  ) {}

  public async scan(module: Type<any>) {
    await this.scanForModules(module);
    await this.scanModulesForDependencies();
    this.container.bindGlobalScope();
  }

  public async scanForModules(
    module: ForwardReference | Type<any> | DynamicModule,
    scope: Type<any>[] = [],
    ctxRegistry: (ForwardReference | DynamicModule | Type<any>)[] = [],
  ) {
    await this.storeModule(module, scope);
    ctxRegistry.push(module);

    if (this.isForwardReference(module)) {
      module = (module as ForwardReference).forwardRef();
    }
    const modules = !this.isDynamicModule(module as Type<any> | DynamicModule)
      ? this.reflectMetadata(module, METADATA.MODULES)
      : [
          ...this.reflectMetadata(
            (module as DynamicModule).module,
            METADATA.MODULES,
          ),
          ...((module as DynamicModule).imports || []),
        ];

    for (const innerModule of modules) {
      if (ctxRegistry.includes(innerModule)) {
        continue;
      }
      await this.scanForModules(
        innerModule,
        [].concat(scope, module),
        ctxRegistry,
      );
    }
  }

  public async storeModule(module: any, scope: Type<any>[]) {
    if (module && module.forwardRef) {
      return this.container.addModule(module.forwardRef(), scope);
    }
    await this.container.addModule(module, scope);
  }

  public async scanModulesForDependencies() {
    const modules = this.container.getModules();

    for (const [token, { metatype }] of modules) {
      await this.reflectRelatedModules(metatype, token, metatype.name);
      this.reflectProviders(metatype, token);
      this.reflectControllers(metatype, token);
      this.reflectExports(metatype, token);
    }
  }

  public async reflectRelatedModules(
    module: Type<any>,
    token: string,
    context: string,
  ) {
    const modules = [
      ...this.reflectMetadata(module, METADATA.MODULES),
      ...this.container.getDynamicMetadataByToken(
        token,
        METADATA.MODULES as 'modules',
      ),
      ...this.container.getDynamicMetadataByToken(
        token,
        METADATA.IMPORTS as 'imports',
      ),
    ];
    for (const related of modules) {
      await this.storeRelatedModule(related, token, context);
    }
  }

  public reflectProviders(module: Type<any>, token: string) {
    const providers = [
      ...this.reflectMetadata(module, METADATA.COMPONENTS),
      ...this.container.getDynamicMetadataByToken(
        token,
        METADATA.COMPONENTS as 'providers',
      ),
      ...this.container.getDynamicMetadataByToken(
        token,
        METADATA.PROVIDERS as 'providers',
      ),
    ];
    providers.forEach(provider => {
      this.storeProvider(provider, token);
      this.reflectProviderMetadata(provider, token);
      this.reflectDynamicMetadata(provider, token);
    });
  }

  public reflectProviderMetadata(provider: Type<Injectable>, token: string) {
    this.reflectGatewaysMiddleware(provider, token);
  }

  public reflectControllers(module: Type<any>, token: string) {
    const routes = [
      ...this.reflectMetadata(module, METADATA.CONTROLLERS),
      ...this.container.getDynamicMetadataByToken(
        token,
        METADATA.CONTROLLERS as 'controllers',
      ),
    ];
    routes.forEach(route => {
      this.storeRoute(route, token);
      this.reflectDynamicMetadata(route, token);
    });
  }

  public reflectDynamicMetadata(obj: Type<Injectable>, token: string) {
    if (!obj || !obj.prototype) {
      return;
    }
    this.reflectInjectables(obj, token, GUARDS_METADATA);
    this.reflectInjectables(obj, token, INTERCEPTORS_METADATA);
    this.reflectInjectables(obj, token, EXCEPTION_FILTERS_METADATA);
    this.reflectInjectables(obj, token, PIPES_METADATA);
    this.reflectParamInjectables(obj, token, ROUTE_ARGS_METADATA);
  }

  public reflectExports(module: Type<any>, token: string) {
    const exports = [
      ...this.reflectMetadata(module, METADATA.EXPORTS),
      ...this.container.getDynamicMetadataByToken(
        token,
        METADATA.EXPORTS as 'exports',
      ),
    ];
    exports.forEach(exportedProvider =>
      this.storeExportedProvider(exportedProvider, token),
    );
  }

  public reflectGatewaysMiddleware(provider: Type<Injectable>, token: string) {
    const middleware = this.reflectMetadata(provider, GATEWAY_MIDDLEWARES);
    middleware.forEach(ware => this.storeProvider(ware, token));
  }

  public reflectInjectables(
    provider: Type<Injectable>,
    token: string,
    metadataKey: string,
  ) {
    const controllerInjectables = this.reflectMetadata(provider, metadataKey);
    const methodsInjectables = this.metadataScanner.scanFromPrototype(
      null,
      provider.prototype,
      this.reflectKeyMetadata.bind(this, provider, metadataKey),
    );
    const flattenMethodsInjectables = methodsInjectables.reduce<any[]>(
      (a: any[], b) => a.concat(b),
      [],
    );
    const mergedInjectables = [
      ...controllerInjectables,
      ...flattenMethodsInjectables,
    ].filter(isFunction);

    mergedInjectables.forEach(injectable =>
      this.storeInjectable(injectable, token),
    );
  }

  public reflectParamInjectables(
    provider: Type<Injectable>,
    token: string,
    metadataKey: string,
  ) {
    const paramsMetadata = this.metadataScanner.scanFromPrototype(
      null,
      provider.prototype,
      method => Reflect.getMetadata(metadataKey, provider, method),
    );
    const flatten = arr => arr.reduce((a, b) => a.concat(b), []);
    const paramsInjectables = flatten(paramsMetadata).map(param =>
      flatten(Object.keys(param).map(k => param[k].pipes)).filter(isFunction),
    );
    flatten(paramsInjectables).forEach(injectable =>
      this.storeInjectable(injectable, token),
    );
  }

  public reflectKeyMetadata(
    provider: Type<Injectable>,
    key: string,
    method: string,
  ) {
    let prototype = provider.prototype;
    do {
      const descriptor = Reflect.getOwnPropertyDescriptor(prototype, method);
      if (!descriptor) {
        continue;
      }
      return Reflect.getMetadata(key, descriptor.value);
    } while (
      // tslint:disable-next-line:no-conditional-assignment
      (prototype = Reflect.getPrototypeOf(prototype)) &&
      prototype !== Object.prototype &&
      prototype
    );
    return undefined;
  }

  public async storeRelatedModule(
    related: any,
    token: string,
    context: string,
  ) {
    if (isUndefined(related)) {
      throw new CircularDependencyException(context);
    }
    if (related && related.forwardRef) {
      return this.container.addRelatedModule(related.forwardRef(), token);
    }
    await this.container.addRelatedModule(related, token);
  }

  public storeProvider(provider, token: string) {
    const isCustomProvider = provider && !isNil(provider.provide);
    if (!isCustomProvider) {
      return this.container.addProvider(provider, token);
    }
    const applyProvidersMap = this.getApplyProvidersMap();
    const providersKeys = Object.keys(applyProvidersMap);
    const type = provider.provide;

    if (!providersKeys.includes(type)) {
      return this.container.addProvider(provider, token);
    }
    const providerToken = randomStringGenerator();
    this.applicationProvidersApplyMap.push({
      type,
      moduleKey: token,
      providerKey: providerToken,
    });
    this.container.addProvider(
      {
        ...provider,
        provide: providerToken,
      },
      token,
    );
  }

  public storeInjectable(provider: Type<Injectable>, token: string) {
    this.container.addInjectable(provider, token);
  }

  public storeExportedProvider(
    exportedProvider: Type<Injectable>,
    token: string,
  ) {
    this.container.addExportedProvider(exportedProvider, token);
  }

  public storeRoute(route: Type<Controller>, token: string) {
    this.container.addController(route, token);
  }

  public reflectMetadata(metatype, metadataKey: string) {
    return Reflect.getMetadata(metadataKey, metatype) || [];
  }

  public applyApplicationProviders() {
    const applyProvidersMap = this.getApplyProvidersMap();
    this.applicationProvidersApplyMap.forEach(
      ({ moduleKey, providerKey, type }) => {
        const modules = this.container.getModules();
        const { providers } = modules.get(moduleKey);
        const { instance } = providers.get(providerKey);

        applyProvidersMap[type](instance);
      },
    );
  }

  public getApplyProvidersMap(): { [type: string]: Function } {
    return {
      [APP_INTERCEPTOR]: interceptor =>
        this.applicationConfig.addGlobalInterceptor(interceptor),
      [APP_PIPE]: pipe => this.applicationConfig.addGlobalPipe(pipe),
      [APP_GUARD]: guard => this.applicationConfig.addGlobalGuard(guard),
      [APP_FILTER]: filter => this.applicationConfig.addGlobalFilter(filter),
    };
  }

  public isDynamicModule(
    module: Type<any> | DynamicModule,
  ): module is DynamicModule {
    return module && !!(module as DynamicModule).module;
  }

  public isForwardReference(
    module: Type<any> | DynamicModule | ForwardReference,
  ): module is ForwardReference {
    return module && !!(module as ForwardReference).forwardRef;
  }
}
