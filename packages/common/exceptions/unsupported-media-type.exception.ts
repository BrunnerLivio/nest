import { HttpException } from './http.exception';
import { HttpStatus } from '../enums/http-status.enum';
import { createHttpExceptionBody } from '../utils/http-exception-body.util';

/**
 * Defines an HTTP exception for *Unsupported Media Type* type errors.
 *
 * @see [Base Exceptions](https://docs.nestjs.com/exception-filters#base-exceptions)
 *
 * @publicApi
 */
export class UnsupportedMediaTypeException extends HttpException {
  /**
   * Instantiate an `UnsupportedMediaTypeException` Exception.
   *
   * @example
   * `throw new UnsupportedMediaTypeException()`
   *
   * @usageNotes
   * #### JSON responses
   * The `message` parameter defines the JSON response body.  Pass `string` to
   * customize the error message.
   *
   * Pass an object with properties `status` and `error` to customize the HTTP status
   * code and `error` message string respectively.
   *
   * #### HTTP Responses
   * Pass `error` string to define the HTTP response status code.
   *
   * @param message string or object describing the error condition.
   * @param error HTTP response status code
   */
  constructor(
    message?: string | object | any,
    error = 'Unsupported Media Type',
  ) {
    super(
      createHttpExceptionBody(
        message,
        error,
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      ),
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    );
  }
}
