// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Create an Express application
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.io to the HTTP server
const io = socketIo(server);

// Import the websocket configuration from websocket.js
const setupWebSocket = require('./websocket');

// Initialize WebSocket with the setup function
setupWebSocket(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
