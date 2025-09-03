const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Test cookie setting
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  const token = 'test-token-123456';
  
  // Set cookie with multiple methods
  res.cookie('token', token, {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  });
  
  console.log('Cookie set successfully');
  
  res.json({
    success: true,
    token: token,
    message: 'Login successful'
  });
});

// Test cookie reading
app.get('/api/auth/me', (req, res) => {
  console.log('Me request - cookies:', req.cookies);
  console.log('Me request - headers:', req.headers);
  
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (token) {
    res.json({
      success: true,
      data: { user: { email: 'test@example.com' } },
      token: token
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'No token found'
    });
  }
});

app.listen(5000, () => {
  console.log('Test server running on port 5000');
});
