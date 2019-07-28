import { HttpException } from './http.exception';
import { HttpStatus } from '../enums/http-status.enum';
import { createHttpExceptionBody } from '../utils/http-exception-body.util';

/**
 * Defines an HTTP exception for *ImATeapotException* type errors.
 *
 * Any attempt to brew coffee with a teapot should result in the error code
 * "418 I'm a teapot". The resulting entity body MAY be short and stout.
 *
 * @see[Base Exceptions](https://docs.nestjs.com/exception-filters#base-exceptions)
 *
 * @publicApi
 */
export class ImATeapotException extends HttpException {
  /**
   * Instantiate an `ImATeapotException` Exception
   *
   * @example
   * `throw new BadGatewayException()`
   *
   * @param message string or object describing the error condition.
   * @param error HTTP response status code
   *
   * @usageNotes
   *
   * #### JSON responses
   * The `message` parameter defines the JSON response body.  Pass `string` to
   * customize the error message.
   *
   * Pass an object with properties `status` and `error` to customize the HTTP status
   * code and `error` message string respectively.
   *
   * #### HTTP Responses
   * Pass `error` string to define the HTTP response status code.
   */
  constructor(message?: string | object | any, error = "I'm a teapot") {
    super(
      createHttpExceptionBody(message, error, HttpStatus.I_AM_A_TEAPOT),
      HttpStatus.I_AM_A_TEAPOT,
    );
  }
}
