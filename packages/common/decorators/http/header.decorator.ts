import { HEADERS_METADATA } from '../../constants';
import { extendArrayMetadata } from '../../utils/extend-metadata.util';

/**
 * Sets a response header.
 *
 * Requires two parameters:
 * - `name` - string to be used for header name
 * - `value` - string to be used for header value
 *
 * For example:
 * `@Header('Cache-Control', 'none')`
 *
 * @see [Headers](https://docs.nestjs.com/controllers#headers)
 *
 * @publicApi
 */
export function Header(name: string, value: string): MethodDecorator {
  return (target: object, key, descriptor) => {
    extendArrayMetadata(HEADERS_METADATA, [{ name, value }], descriptor.value);
    return descriptor;
  };
}
