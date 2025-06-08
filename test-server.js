const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.json({
    status: '✅ NutriConnect Server Running Successfully!',
    message: 'Server is accessible from all network interfaces',
    host: HOST,
    port: PORT,
    timestamp: new Date().toISOString(),
    accessible_from: [
      `http://localhost:${PORT}`,
      `http://127.0.0.1:${PORT}`,
      `http://10.26.1.11:${PORT}`,
      `http://${HOST}:${PORT}`
    ],
    endpoints: {
      home: '/',
      health: '/health',
      dashboard: '/app/dashboard/page.tsx',
      components: '/components/',
      api_test: '/api/test'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    node_version: process.version
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API endpoint working!', 
    timestamp: new Date().toISOString() 
  });
});

// Serve the dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'dashboard', 'page.tsx'));
});

// Serve components
app.get('/components/*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  res.sendFile(filePath);
});

// Start server
app.listen(PORT, HOST, () => {
  console.log('🚀================================🚀');
  console.log('   NutriConnect Server Started');
  console.log('🚀================================🚀');
  console.log('');
  console.log(`📍 Server URL: http://${HOST}:${PORT}`);
  console.log(`🌐 Network Access: http://10.26.1.11:${PORT}`);
  console.log(`🏠 Local Access: http://localhost:${PORT}`);
  console.log('');
  console.log('📊 Available Endpoints:');
  console.log(`   🔹 Home: http://10.26.1.11:${PORT}/`);
  console.log(`   🔹 Health: http://10.26.1.11:${PORT}/health`);
  console.log(`   🔹 API Test: http://10.26.1.11:${PORT}/api/test`);
  console.log(`   🔹 Dashboard: http://10.26.1.11:${PORT}/dashboard`);
  console.log('');
  console.log('✅ Server is ready and accessible from all network interfaces!');
  console.log('🔥 You can now access it from 10.26.1.11:5000');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});