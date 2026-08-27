'use strict';

const awsServerlessExpress = require('aws-serverless-express');

const app = require('./app');
const server = awsServerlessExpress.createServer(app);

exports.main = (event, context) => {
  const { promise } = awsServerlessExpress.proxy(server, event, context, 'PROMISE');
  return promise;
};
