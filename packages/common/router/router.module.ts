import { DynamicModule } from '../';
import { PATH_METADATA, METHOD_METADATA } from '../constants';

import { RouterModuleOptions, RouterModuleAsyncOptions } from './interfaces/router-module-options.interface';
import { Route, RouteWithUseHandler, RouteWithCallThrough } from './interfaces/route.interface';
import { noop } from 'lodash';

export class RouterModule {
  private static registerRoute(route: Route) {

    if (route.callThrough) {
      // Register and underlying route which is defined by the user
      // with their custom e.g. express instance
      const newRoute = route as Route & RouteWithUseHandler;
      Reflect.defineMetadata(PATH_METADATA, route.path, newRoute.useHandler);
      Reflect.defineMetadata(METHOD_METADATA, route.method, newRoute.useHandler);
    } else {
      // Register a new route to the Nest router
      const existingRoute = route as Route & RouteWithCallThrough;
      Reflect.defineMetadata(PATH_METADATA, existingRoute.path, noop);
      Reflect.defineMetadata(METHOD_METADATA, existingRoute.method, noop);
    }

  }

  public static forRoot(options: RouterModuleOptions): DynamicModule {
    options.routes.forEach(route => this.registerRoute(route));
    return {
      module: RouterModule,
    };
  }
  public static forRootAsync(options: RouterModuleAsyncOptions): DynamicModule {
    return {
      module: RouterModule
    };
  }
}