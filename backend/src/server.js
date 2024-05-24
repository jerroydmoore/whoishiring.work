if (process.env.LOAD_ENV_FILE) {
  // eslint-disable-next-line no-console
  console.dir(process.env);
  require('dotenv').config({ path: '../.env' });
}

const http = require('http');
const logger = require('./logger');

const app = require('./app');

function startServer(app, httpPort) {
  if (!httpPort) {
    httpPort = 8080;
  }
  const httpServer = http.createServer(app);

  return new Promise((resolve, reject) => {
    httpServer.on('clientError', (err, socket) => {
      delete err.socket;
      logger.error({ err }, 'httpServer threw a clientError');
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    httpServer.on('error', (err) => {
      if (err.syscall !== 'listen') {
        reject(err);
      } else if (err.code === 'EACCES') {
        reject(new Error(`Port ${httpPort} requires elevated privileges (EACCES)`));
      } else if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${httpPort} is already in use (EADDRINUSE)`));
      } else {
        reject(err);
      }
    });

    httpServer.listen(httpPort, () => {
      logger.info('Server Listening on port ' + httpPort);
      resolve();
    });

    function shutdown(signal) {
      logger.info({ signal }, 'Shutting down the application');
      httpServer.close(() => {
        // https://github.com/remy/nodemon#controlling-shutdown-of-your-script
        process.kill(process.pid, signal);
      });
    }
    ['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal) => process.once(signal, shutdown));
  });
}
async function main() {
  try {
    await startServer(app, parseInt(process.env.HTTP_PORT, 10));
  } catch (err) {
    logger.fatal({ err }, 'FATAL: failed to start http server');
    process.exit(1);
  }
}

main();
