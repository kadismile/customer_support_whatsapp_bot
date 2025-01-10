
import app from './app.js';
import Logger from './libs/logger.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => Logger.info(`🌏 Server running on PORT: ${PORT}`));
