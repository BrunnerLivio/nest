import { ModuleMetadata, Type } from '../../interfaces';
import { Route } from './route.interface';

export interface RouterModuleOptions {
  routes: Route[];
  enableTracing?: boolean;
}

export interface RouterOptionsFactory {
  createRouterOptions():
    | Promise<RouterModuleOptions>
    | RouterModuleOptions;
}

export interface RouterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useClass?: Type<RouterOptionsFactory>;
  useExisting?: Type<RouterOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<RouterModuleOptions> | RouterModuleOptions;
  inject?: unknown[];
}