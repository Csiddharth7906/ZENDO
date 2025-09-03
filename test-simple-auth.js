const http = require('http');

// Simple test without external dependencies
function makeRequest(method, path, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const setCookies = res.headers['set-cookie'] || [];
        resolve({
          status: res.statusCode,
          headers: res.headers,
          cookies: setCookies,
          data: body ? JSON.parse(body) : null
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication Flow...\n');

    // Step 1: Register
    console.log('1️⃣ Testing Registration...');
    const registerResponse = await makeRequest('POST', '/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Registration:', {
      status: registerResponse.status,
      success: registerResponse.data?.success,
      hasToken: !!registerResponse.data?.token,
      cookies: registerResponse.cookies
    });

    // Step 2: Login
    console.log('\n2️⃣ Testing Login...');
    const loginResponse = await makeRequest('POST', '/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Login:', {
      status: loginResponse.status,
      success: loginResponse.data?.success,
      hasToken: !!loginResponse.data?.token,
      cookies: loginResponse.cookies
    });

    // Extract token cookie
    let tokenCookie = '';
    if (loginResponse.cookies.length > 0) {
      const cookieHeader = loginResponse.cookies.find(c => c.includes('token='));
      if (cookieHeader) {
        tokenCookie = cookieHeader.split(';')[0]; // Get just "token=value"
      }
    }

    console.log('🍪 Token cookie:', tokenCookie);

    // Step 3: Test /me with cookie
    console.log('\n3️⃣ Testing /me with cookie...');
    const meResponse = await makeRequest('GET', '/auth/me', null, tokenCookie);

    console.log('✅ /me Response:', {
      status: meResponse.status,
      success: meResponse.data?.success,
      hasUser: !!meResponse.data?.data?.user,
      userEmail: meResponse.data?.data?.user?.email
    });

    if (meResponse.status === 200) {
      console.log('\n🎉 Cookie authentication is working!');
    } else {
      console.log('\n❌ Cookie authentication failed');
      console.log('Response:', meResponse.data);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testAuth();
