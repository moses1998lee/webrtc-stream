// websocket.js
module.exports = function setupWebSocket(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.emit('welcome', 'Welcome to the WebSocket server!');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};