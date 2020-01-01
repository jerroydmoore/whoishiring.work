'use strict';

const awsServerlessExpress = require('aws-serverless-express');

const app = require('./app');
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

exports.handler_test = (event, context) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'hello world',
    event,
    context,
  }),
});
