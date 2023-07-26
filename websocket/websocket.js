const { Server } = require('socket.io');

const io = new Server(8080);

io.on('connection', (socket) => {
    console.log(`New listener connected.\nID: ${socket.id}\nIP: ${socket.handshake.address} (${socket.handshake.headers['x-forwarded-for']})`);
});

console.log('Socket server started on port 8080');

module.exports = io;