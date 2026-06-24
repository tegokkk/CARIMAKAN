const serverless = require('serverless-http');
const app = require('../../backend/src/app');

const handler = serverless(app);

exports.handler = async (event, context) => {
  const path = event.path || '';

  if (path.startsWith('/.netlify/functions/api/')) {
    event.path = `/api/${path.replace('/.netlify/functions/api/', '')}`;
  } else if (path === '/.netlify/functions/api') {
    event.path = '/api';
  }

  return handler(event, context);
};
