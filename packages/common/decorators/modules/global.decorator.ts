import { GLOBAL_MODULE_METADATA } from '../../constants';

/**
 * Makes the module global-scoped.
 *
 * Once imported into any module, the global-scoped module will be visible
 * in all modules. Modules that wish to inject a service exported from a
 * global module do not need to import the provider module.
 *
 * @see [Global modules](https://docs.nestjs.com/modules#global-modules)
 *
 * @publicApi
 */
export function Global(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(GLOBAL_MODULE_METADATA, true, target);
  };
}
