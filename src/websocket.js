// websocket.js

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Securely handle the offer
        socket.on('offer', (offer, targetId) => {
            if (!offer || !targetId) {
                return console.error('Invalid offer or target ID received');
            }
            socket.to(targetId).emit('offer', offer, socket.id);
        });

        // Securely handle the answer
        socket.on('answer', (answer, targetId) => {
            if (!answer || !targetId) {
                return console.error('Invalid answer or target ID received');
            }
            socket.to(targetId).emit('answer', answer);
        });

        // Securely handle ICE candidates
        socket.on('candidate', (candidate, targetId) => {
            if (!candidate || !targetId) {
                return console.error('Invalid candidate or target ID received');
            }
            socket.to(targetId).emit('candidate', candidate);
        });

        // Log disconnections
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        // Implement additional security measures such as rate limiting
        // and data validation here
    });
};
