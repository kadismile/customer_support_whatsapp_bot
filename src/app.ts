import cors from 'cors';
import express from 'express';

import { errorRequestHandler } from './middleware/generalErrorRequestHandler.js';
import { RouteConfig, routerConfig } from './routes/config.js';

const app = express();
app.use(express.json());
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));



routerConfig.forEach(({ route, router }: RouteConfig) => {
  app.use(route, router);
});

app.use(errorRequestHandler);
app.use((req, res) => res.status(404).json());

export default app;
