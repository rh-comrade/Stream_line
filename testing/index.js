const autocannon = require('autocannon');

const url = 'http://localhost:5173';

const instance = autocannon({
  url: url,
  connections: 1000,  // You can increase if needed, but avoid 2000 for logging every request
  duration: 10,
  method: 'GET',
});

instance.on('response', (client, statusCode, resBytes, responseTime) => {
  console.log(`Status: ${statusCode}, Response Time: ${responseTime} ms, Size: ${resBytes} bytes`);
});

instance.on('reqError', (err) => {
  console.error('Request Error:', err.message);
});

instance.on('done', (result) => {
  console.log('Load test finished');
});

