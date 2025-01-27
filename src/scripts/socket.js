import P2P from 'socket.io-p2p';
import { io } from 'socket.io-client';

export const socket = io("http://localhost:3030");
const opts = { autoUpgrade: false, numClients: 2 };
const p2p = new P2P(socket, opts, function(){
    console.log('We all speak WebRTC now');
});

p2p.on('peer-msg', (data) => {
    console.log('From a peer %s', data);
});
p2p.on('go-private', function () {
    p2p.upgrade();
});