const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server working!' });
});

// Simple auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@example.com' && password === 'password123') {
    const token = 'simple-token-123';
    
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.json({
      success: true,
      token,
      data: { user: { email, name: 'Test User' } }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
  
  if (token === 'simple-token-123') {
    res.json({
      success: true,
      data: { user: { email: 'test@example.com', name: 'Test User' } }
    });
  } else {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
