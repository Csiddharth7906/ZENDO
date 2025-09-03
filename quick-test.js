const http = require('http');

// Test login
const loginData = JSON.stringify({
  email: 'test@example.com',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', body);
    
    // Test /me endpoint with cookie
    if (res.statusCode === 200 && res.headers['set-cookie']) {
      const cookie = res.headers['set-cookie'][0];
      console.log('Cookie:', cookie);
      
      // Test /me
      const meOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
          'Cookie': cookie
        }
      };
      
      const meReq = http.request(meOptions, (meRes) => {
        console.log(`\n/me Status: ${meRes.statusCode}`);
        let meBody = '';
        meRes.on('data', (chunk) => meBody += chunk);
        meRes.on('end', () => {
          console.log('/me Response:', meBody);
        });
      });
      
      meReq.end();
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem: ${e.message}`);
});

req.write(loginData);
req.end();
