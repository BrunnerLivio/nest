import { LoggerService } from '../services/logger.service';

/**
 * @publicApi
 */
export class NestApplicationContextOptions {
  /**
   * Specifies the logger to use.  Pass `false` to turn off logging.
   */
  logger?: LoggerService | boolean;
}
