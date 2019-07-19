import { FILTER_CATCH_EXCEPTIONS } from '../../constants';
import { Type } from '../../interfaces';

/**
 * Decorator that marks a class as a Nest exception filter. An exception filter
 * handles exceptions thrown by or not handled by your application code.
 *
 * The decorator takes one or more exception *types* as parameters, specifying
 * the exceptions to be caught and handled by this filter.
 *
 * The decorated class must implement the `ExceptionFilter` interface.
 *
 * @see [Exception Filters](https://docs.nestjs.com/exception-filters)
 *
 * @usageNotes
 * Exception filters are applied using the `@UseFilters()` decorator, or (globally)
 * with `app.useGlobalFilters()`.
 *
 * @publicApi
 */

export function Catch(...exceptions: Type<any>[]): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(FILTER_CATCH_EXCEPTIONS, exceptions, target);
  };
}
