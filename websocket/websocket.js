const { Server } = require('socket.io');

const io = new Server(8080);

io.on('connection', (socket) => {
    console.log('New listener connected.');
});

console.log('Socket server started on port 8080');

module.exports = io;