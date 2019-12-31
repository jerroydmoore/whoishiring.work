// API endpoints:
// api.whoishiring.work/v1/latest
// api.whoishiring.work/v1/months
// api.whoishiring.work/v1/months/December+2019/posts

const express = require('express');
const logger = require('./logger');
const pino = require('express-pino-logger')({ logger });

process.on('uncaughtException', (err, origin) => {
  logger.fatal({ origin, err }, 'uncaught error caused the application to crash');
});
process.on('unhandledRejection', (err /*, promise*/) => {
  logger.fatal({ err /*, promise*/ }, 'unhandledRejection event was emitted');
});

const app = express();
app.use(pino);

app.use('/v1/whoishiring', require('./routes/v1/whoishiring'));

app.use('/healthz', (req, res) => res.status(200).json({ message: 'healthy!' }));
app.get('/', (req, res) => res.status(200).json({ message: 'hello world!' }));

module.exports = app;
