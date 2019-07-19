/**
 * Binds parameter decorators to the decorated method.
 *
 * Useful when the language doesn't provide a 'Parameter Decorators' feature
 * (i.e., vanilla JavaScript)
 *
 * Accepts a list of decorators as parameters.
 *
 * Example: `@Bind(Req())`
 *
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
