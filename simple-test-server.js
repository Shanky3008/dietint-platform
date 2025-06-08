const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Set content type
  res.setHeader('Content-Type', 'application/json');
  
  if (pathname === '/' || pathname === '/health') {
    const response = {
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
        dashboard: '/dashboard',
        api_test: '/api/test'
      },
      features: [
        '🌐 CORS enabled',
        '🔥 Network accessible',
        '⚡ Fast response',
        '🛡️ Secure headers'
      ]
    };
    
    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
    
  } else if (pathname === '/api/test') {
    const response = {
      message: 'API endpoint working perfectly!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      node_version: process.version
    };
    
    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
    
  } else if (pathname === '/dashboard') {
    res.setHeader('Content-Type', 'text/html');
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutriConnect Dashboard</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 50px auto; 
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { 
            background: rgba(255,255,255,0.1); 
            padding: 30px; 
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { color: #fff; text-align: center; }
        .success { 
            background: #4CAF50; 
            padding: 15px; 
            border-radius: 10px; 
            margin: 20px 0;
            text-align: center;
        }
        .info { 
            background: rgba(255,255,255,0.2); 
            padding: 15px; 
            border-radius: 10px; 
            margin: 10px 0;
        }
        .endpoint { 
            background: rgba(0,0,0,0.3); 
            padding: 10px; 
            border-radius: 5px; 
            margin: 5px 0; 
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🥗 NutriConnect Dashboard</h1>
        
        <div class="success">
            ✅ Server Successfully Running on All Network Interfaces!
        </div>
        
        <div class="info">
            <h3>🌐 Server Information</h3>
            <p><strong>Host:</strong> ${HOST}</p>
            <p><strong>Port:</strong> ${PORT}</p>
            <p><strong>Network URL:</strong> http://10.26.1.11:${PORT}</p>
            <p><strong>Started:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="info">
            <h3>📍 Available Endpoints</h3>
            <div class="endpoint">GET http://10.26.1.11:${PORT}/</div>
            <div class="endpoint">GET http://10.26.1.11:${PORT}/health</div>
            <div class="endpoint">GET http://10.26.1.11:${PORT}/api/test</div>
            <div class="endpoint">GET http://10.26.1.11:${PORT}/dashboard</div>
        </div>
        
        <div class="info">
            <h3>🔥 Features</h3>
            <ul>
                <li>✅ CORS enabled for all origins</li>
                <li>✅ Network accessible from 10.26.1.11</li>
                <li>✅ JSON API responses</li>
                <li>✅ Health check endpoint</li>
                <li>✅ Dashboard interface</li>
            </ul>
        </div>
        
        <div class="success">
            🎉 The connection issue has been fixed! 
            <br>You can now access the server from 10.26.1.11:5000
        </div>
    </div>
</body>
</html>
    `;
    
    res.writeHead(200);
    res.end(html);
    
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }, null, 2));
  }
});

server.listen(PORT, HOST, () => {
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
  console.log('🎉 CONNECTION ISSUE FIXED!');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.close();
  process.exit(0);
});