import { PATH_METADATA, SCOPE_OPTIONS_METADATA } from '../../constants';
import { isString, isUndefined } from '../../utils/shared.utils';
import { ScopeOptions } from './../../interfaces/scope-options.interface';

export interface ControllerOptions extends ScopeOptions {
  path?: string;
}

export function Controller();
export function Controller(prefix: string);
export function Controller(options: ControllerOptions);
/**
 * @Annotation
 *
 * @publicApi
 *
 * @description
 *
 * Decorator that marks a class as a Nest controller that can receive inbound
 * requests and produce responses. HTTP Controllers optionally accept configuration
 * metadata that determines route paths that route handlers in the class
 * respond to, and lifetime [scope](fundamentals/injection-scopes#usage).
 *
 * An HTTP Controller responds to inbound HTTP Requests and produces HTTP Responses.
 * It defines a class that provides the context for one or more related route
 * handlers that correspond to HTTP request methods and associated routes
 * (e.g., `GET /api/profile`, `POST /user/resume`).
 *
 * A Microservice Controller responds to Requests and Responses, as well as events,
 * running over a variety of transports [see](microservices/basics). It defines
 * a class that provides a context for one or more message or event handlers.
 *
 * @see [Controllers](/controllers)
 *
 * @usageNotes
 *
 * #### Setting the default route prefix
 * The following example sets `cats` as the default route prefix for all route
 * handlers in this controller. The route handler will respond to the request
 * `GET /cats`
 * ```
 *  @Controller('cats')
 *  export class CatsController {
 *    @Get()
 *    findall(): string {
 *      return 'This action returns all cats';
 *    }
 *  }
 * ```
 *
 * #### Setting the injection scope
 * The following example sets the scope for all requests in the controller
 * to request-scoped. Each request will cause Nest to create a new instance of
 * the controller.
 * ```
 *  @Controller({
 *    path: 'cats',
 *    scope: Scope.REQUEST,
 *  })
 *  export class CatsController {}
 * ```
 */
export function Controller(
  prefixOrOptions?: string | ControllerOptions,
): ClassDecorator {
  const defaultPath = '/';
  const [path, scopeOptions] = isUndefined(prefixOrOptions)
    ? [defaultPath, undefined]
    : isString(prefixOrOptions)
      ? [prefixOrOptions, undefined]
      : [prefixOrOptions.path || defaultPath, { scope: prefixOrOptions.scope }];

  return (target: object) => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
  };
}
