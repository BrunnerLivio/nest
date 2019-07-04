/**
 * @see https://github.com/expressjs/cors
 */
export type CustomOrigin = (
  requestOrigin: string,
  callback: (err: Error | null, allow?: boolean) => void,
) => void;

/**
 * @publicApi
 *
 * @see https://github.com/expressjs/cors
 */
export interface CorsOptions {
  /**
   * Configures the `Access-Control-Allow-Origins` CORS header.  See [here](https://github.com/expressjs/cors#configuration-options)
   */
  origin?: boolean | string | RegExp | (string | RegExp)[] | CustomOrigin;
  /**
   * Configures the Access-Control-Allow-Methods CORS header
   */
  methods?: string | string[];
  /**
   * Configures the Access-Control-Allow-Headers CORS header.
   */
  allowedHeaders?: string | string[];
  /**
   * Configures the Access-Control-Expose-Headers CORS header.
   */
  exposedHeaders?: string | string[];
  /**
   * Configures the Access-Control-Allow-Credentials CORS header.
   */
  credentials?: boolean;
  /**
   * Configures the Access-Control-Max-Age CORS header.
   */
  maxAge?: number;
  /**
   * Pass the CORS preflight response to the next handler?
   */
  preflightContinue?: boolean;
  /**
   * Provides a status code to use for successful OPTIONS requests.
   */
  optionsSuccessStatus?: number;
}
