import { Router } from 'express';

import indexRouter from './index.js';
import sessionRouter from './sessionRoutes.js';

export type RouteConfig = {
  route: string;
  router: Router;
};

export const routerConfig: RouteConfig[] = [
  { route: '/', router: indexRouter },
  { route: '/session', router: sessionRouter }
];
