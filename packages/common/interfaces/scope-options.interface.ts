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
 * @see [Injection Scopes](/fundamentals/injection-scopes)
 */
export interface ScopeOptions {
  scope?: Scope;
}
