import { HttpsOptions } from './external/https-options.interface';
import { NestApplicationContextOptions } from './nest-application-context-options.interface';
import { CorsOptions } from './external/cors-options.interface';

/**
 * @publicApi
 */
export interface NestApplicationOptions extends NestApplicationContextOptions {
  /**
   * cors options from [Express Cors package](https://github.com/expressjs/cors#configuration#options)
   */
  cors?: boolean | CorsOptions;
  /**
   * use Express bodyparser
   */
  bodyParser?: boolean;
  /**
   * configure HTTPS options
   */
  httpsOptions?: HttpsOptions;
}
