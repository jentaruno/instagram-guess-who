import { createServer } from 'http';
import { Server as P2PServer } from 'socket.io-p2p-server';
import { Server as SocketIOServer } from 'socket.io';

const server = createServer();
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'], // Allowed HTTP methods
    },
});
server.listen(3030, () => {
    console.log('Server is running on port 3030');
});

io.use(P2PServer);

io.on('connection', function (socket) {
    socket.on('peer-msg', function (data) {
        console.log('Message from peer: %s', data)
        socket.broadcast.emit('peer-msg', data)
    })

    socket.on('peer-file', function (data) {
        console.log('File from peer: %s', data)
        socket.broadcast.emit('peer-file', data)
    })

    socket.on('go-private', function (data) {
        socket.broadcast.emit('go-private', data)
    })
})