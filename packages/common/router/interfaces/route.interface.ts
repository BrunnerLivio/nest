import { RequestMethod } from '../../';

interface RouteRegister {
  path: string;
  method?: RequestMethod;
}

interface RouteUseHandler {
  useHandler: (req: any, res: any, next: Function, container: any) => Promise<any> | any;
}

interface RouteCallThrough {
  callThrough?: boolean;
}

export type RouteWithCallThrough = RouteRegister & RouteCallThrough & { callThrough: true };
export type RouteWithUseHandler = RouteRegister & RouteUseHandler & { callThrough?: false | undefined | null };

export type Route = RouteWithCallThrough | RouteWithUseHandler;