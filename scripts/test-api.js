// Test quotation API
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/quotations/ZZT-2026-0001',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    try {
      const json = JSON.parse(data);
      console.log('\nParsed:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Not JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
