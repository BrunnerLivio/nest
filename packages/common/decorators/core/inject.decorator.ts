import {
  PROPERTY_DEPS_METADATA,
  SELF_DECLARED_DEPS_METADATA,
} from '../../constants';
import { isFunction, isUndefined } from '../../utils/shared.utils';

/**
 * Injects provider which has to be available in the current injector (module) scope.
 * Providers are recognized by either types or tokens.
 */

/**
 * @publicApi
 *
 * @description
 *
 * Decorator that marks a constructor parameter as a target for
 * [Dependency Injection (DI)](/providers#dependency-injection). Takes a single
 * required parameter which is the
 * [injection token](/fundamentals/custom-providers). The injection token serves
 * as the lookup key for the [provider](/providers) that will be injected
 * (assigned to the constructor parameter).
 *
 * Injection tokens can be types (class names), strings or symbols. This depends
 * on how the provider with which it is associated was defined. Providers
 * defined with the `@Injectable()` decorator use the class name. Custom
 * Providers may use strings or symbols as the injection token.
 *
 * Any injected provider must be visible within the module scope (loosely
 * speaking, the containing module) of the class it is being injected into. This
 * can be done by:
 *
 * - defining the provider in the same module scope
 * - exporting the provider from one module scope and importing that module into the
 *   module scope of the class being injected into
 * - exporting the provider from a module that is marked as global using the
 *   `@Global()` decorator
 *
 * @see [Providers](/providers)
 * @see [Custom Providers](/fundamentals/custom-providers)
 * @see [Injection Scopes](/fundamentals/injection-scopes)
 *
 * @usageNotes
 *
 * #### Injecting with a type (class name)
 *
 * ```typescript
 * import { Inject } from '@nestjs/common';
 * import { ConfigService } from './config.service';
 *
 * export class CatsService {
 *   constructor(@Inject(ConfigService) private readonly configService) {}
 * }
 * ```
 *
 * The above is equivalent to the conventional constructor injection syntax:
 * ```typescript
 * import { ConfigService } from './config.service';
 *
 * export class CatsService {
 *   constructor(private readonly configService: ConfigService) {}
 * }
 * ```
 * #### Injecting with a string
 *
 * Assume we've registered a provider with the string `'CONNECTION'` as follows:
 *
 * ```typescript
 * import { connection } from './connection';
 * const connectionProvider = {
 *   provide: 'CONNECTION',
 *   useValue: connection,
 * };
 *
 * @Module({
 *  providers: [connectionProvider],
 * })
 * export class ApplicationModule {}
 * ```
 * As a result, we now have a provider bound to the DI container using the
 * injection token `'CONNECTION'`.  This provider can be injected as follows:
 *
 * ```typescript
 * @Injectable()
 * export class CatsRepository {
 *   constructor(@Inject('CONNECTION') connection: Connection) {}
 * }
 * ```
 */

export function Inject<T = any>(token?: T) {
  return (target: Object, key: string | symbol, index?: number) => {
    token = token || Reflect.getMetadata('design:type', target, key);
    const type =
      token && isFunction(token) ? ((token as any) as Function).name : token;

    if (!isUndefined(index)) {
      let dependencies =
        Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target) || [];

      dependencies = [...dependencies, { index, param: type }];
      Reflect.defineMetadata(SELF_DECLARED_DEPS_METADATA, dependencies, target);
      return;
    }
    let properties =
      Reflect.getMetadata(PROPERTY_DEPS_METADATA, target.constructor) || [];

    properties = [...properties, { key, type }];
    Reflect.defineMetadata(
      PROPERTY_DEPS_METADATA,
      properties,
      target.constructor,
    );
  };
}
