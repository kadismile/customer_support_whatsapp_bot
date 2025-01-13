import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorRequestHandler } from './middleware/generalErrorRequestHandler.js';
import { RouteConfig, routerConfig } from './routes/config.js';

const app = express();
app.use(express.json());
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../src/views/build')));

routerConfig.forEach(({ route, router }: RouteConfig) => {
  app.use(route, router);
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/views/build', 'index.html'));
});

app.use(errorRequestHandler);
app.use((req, res) => res.status(404).json());

export default app;
