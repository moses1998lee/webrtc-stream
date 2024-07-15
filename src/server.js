const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const setupWebSocket = require('./websocket');
const helmet = require('helmet');

const app = express();
app.use(helmet()); // Security best practices
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "https://yourdomain.com",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
setupWebSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
