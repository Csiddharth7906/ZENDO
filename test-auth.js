const https = require('https');
const http = require('http');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication Flow...\n');

    // Step 1: Register
    console.log('1️⃣ Testing Registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData, {
      withCredentials: true
    });

    console.log('✅ Registration Response:', {
      status: registerResponse.status,
      success: registerResponse.data.success,
      hasToken: !!registerResponse.data.token,
      hasUser: !!registerResponse.data.data?.user
    });

    // Step 2: Login
    console.log('\n2️⃣ Testing Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData, {
      withCredentials: true
    });

    console.log('✅ Login Response:', {
      status: loginResponse.status,
      success: loginResponse.data.success,
      hasToken: !!loginResponse.data.token,
      hasUser: !!loginResponse.data.data?.user
    });

    // Extract cookies for next request
    const cookies = loginResponse.headers['set-cookie'];
    console.log('🍪 Cookies received:', cookies);

    // Step 3: Test /me endpoint
    console.log('\n3️⃣ Testing /me endpoint...');
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      withCredentials: true,
      headers: {
        Cookie: cookies ? cookies.join('; ') : ''
      }
    });

    console.log('✅ /me Response:', {
      status: meResponse.status,
      success: meResponse.data.success,
      hasUser: !!meResponse.data.data?.user,
      userEmail: meResponse.data.data?.user?.email
    });

    console.log('\n🎉 All tests passed! Authentication is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
  }
}

testAuth();
