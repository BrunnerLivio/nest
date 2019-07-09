export enum Scope {
  DEFAULT,
  TRANSIENT,
  REQUEST,
}

/**
 * @publicApi
 *
 * @see [Injection Scopes](/fundamentals/injection-scopes)
 */
export interface ScopeOptions {
  /**
   * Defines the injection scope.
   *
   * Possible Values:
   * - DEFAULT -
   * - TRANSIENT - A new private instance of the provider is instantiated for every use
   * - REQUEST - A new instance is instantiated for each request processing pipeline
   *
   */
  scope?: Scope;
}
