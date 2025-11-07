// Simple test to verify the Lambda function works
const handler = require('./index').handler;

const testEvent = {
  httpMethod: 'GET',
  path: '/api/health',
  headers: {},
  queryStringParameters: null,
  body: null,
  requestContext: {
    requestId: 'test-request-id'
  }
};

const testContext = {
  callbackWaitsForEmptyEventLoop: false
};

console.log('Testing Lambda function...');

handler(testEvent, testContext)
  .then(result => {
    console.log('Success! Result:', JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  });