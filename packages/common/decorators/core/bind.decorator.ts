/**
 * Decorator that binds *parameter decorators* to the method that follows.
 *
 * Useful when the language doesn't provide a 'Parameter Decorator' feature
 * (i.e., vanilla JavaScript).
 *
 * @param decorators one or more parameter decorators (without `@`, e.g., `Req()`)
 *
 * @usageNotes
 * When using vanilla JavaScript, parameter decorators are not available.  A
 * parameter decorator expressed in TypeScript as:
 * ```typescript
 * @Controller('cats')
 * export class CatsController {
 *   @Get()
 *   findAll(@Req() request: Request): string {
 *     return 'This action returns all cats';
 *   }
 * }
 * ```
 *
 * Should be expressed in JavaScript using the `@Bind()` decorator as:
 * ```typescript
 * @Controller('cats')
 * export class CatsController {
 *   @Get()
 *   @Bind(Req())
 *   findAll(request) {
 *     return 'This action returns all cats';
 *   }
 * }
 * ```
 * @publicApi
 */
export function Bind(...decorators: any[]): MethodDecorator {
  return <T>(
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    decorators.forEach((fn, index) => fn(target, key, index));
    return descriptor;
  };
}
