/**
 * @publicApi
 */
export enum Scope {
  DEFAULT,
  /**
   * A new private instance of the provider is instantiated for every use
   */
  TRANSIENT,
  /**
   * A new instance is instantiated for each request processing pipeline
   */
  REQUEST,
}

/**
 * @publicApi
 *
 * @see [Injection Scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
 */
export interface ScopeOptions {
  /**
   * Specifies the lifetime of an injected Provider or Controller.
   */
  scope?: Scope;
}
