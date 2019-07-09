import * as uuid from 'uuid/v4';
import { ScopeOptions } from '../../interfaces/scope-options.interface';
import { SCOPE_OPTIONS_METADATA } from './../../constants';
import { Type } from './../../interfaces/type.interface';

/**
 * @publicApi
 *
 * @description
 *
 * Defines the injection scope.
 *
 * Possible Values:
 * - DEFAULT -
 * - TRANSIENT - A new private instance of the provider is instantiated for every use.
 * - REQUEST - A new instance is instantiated for each request processing pipeline.
 *
 * @see [Injection Scopes](/fundamentals/injection-scopes)
 */
export interface InjectableOptions extends ScopeOptions {}

/**
 * @publicApi
 *
 * @description
 *
 * Decorator that marks a class as a [provider](/providers). Providers can be
 * injected into other classes via constructor parameter injection using Nest's
 * built-in [Dependency Injection (DI)](/providers#dependency-injection) system.
 *
 * When injecting a provider, it must be visible within the module scope (loosely
 * speaking, the containing module) of the class it is being injected into. This
 * can be done by:
 *
 * - defining the provider in the same module scope
 * - exporting the provider from one module scope and importing that module into the
 *   module scope of the class being injected into
 * - exporting the provider from a module that is marked as global using the
 *   `@Global()` decorator
 *
 * Providers can also be defined in a more explicit and imperative form using
 * various [custom provider](/fundamentals/custom-providers) techniques that expose
 * more capabilities of the DI system.
 *
 * @see [Providers](/providers)
 * @see [Custom Providers](/fundamentals/custom-providers)
 * @see [Injection Scopes](/fundamentals/injection-scopes)
 *
 * @usageNotes
 *
 * #### Setting provider scope
 *
 * The `@Injector()` decorator takes an optional options object in plain JSON format.
 * This object has one property: `scope`.
 *
 * Following is an example of setting a provider's scope to per-request. See more
 * about [injection scopes here](/fundamentals/injection-scopes).
 *
 * ```typescript
 * import { Injectable, Scope } from '@nestjs/common';
 *
 * @Injectable({ scope: Scope.REQUEST })
 * export class CatsService {}
 * ```
 *
 * #### Declaring providers
 *
 * Providers are declared using the `@Injectable()` decorator and a standard
 * JavaScript class.
 *
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 * import { Cat } from './interfaces/cat.interface';
 *
 * @Injectable()
 * export class CatsService {
 *   private readonly cats: Cat[] = [];
 *
 *   create(cat: Cat) {
 *     this.cats.push(cat);
 *   }
 *
 *   findAll(): Cat[] {
 *     return this.cats;
 *   }
 * }
 * ```
 *
 * #### Using providers
 *
 * Providers created using the `@Injectable()` decorator use an
 * [injection token](/fundamentals/custom-providers) that is the class type.
 *
 * For example to inject the provider declared above using constructor injection,
 * use the following syntax. In this example, `CatsService` is the name of
 * the provider class declared earlier, and is used as the injection token in
 * the constructor.
 *
 * ```typescript
 * import { Controller, Get, Post, Body } from '@nestjs/common';
 * import { CreateCatDto } from './dto/create-cat.dto';
 * import { CatsService } from './cats.service';
 * import { Cat } from './interfaces/cat.interface';
 *
 * @Controller('cats')
 * export class CatsController {
 *   constructor(private readonly catsService: CatsService) {}
 *
 *   @Post()
 *   async create(@Body() createCatDto: CreateCatDto) {
 *     this.catsService.create(createCatDto);
 *   }
 *
 *   @Get()
 *   async findAll(): Promise<Cat[]> {
 *     return this.catsService.findAll();
 *   }
 * }
 * ```
 */
export function Injectable(options?: InjectableOptions): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, options, target);
  };
}

export function mixin(mixinClass: Type<any>) {
  Object.defineProperty(mixinClass, 'name', {
    value: uuid(),
  });
  Injectable()(mixinClass);
  return mixinClass;
}
