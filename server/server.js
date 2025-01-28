import express from "express";
import { Server } from "socket.io";

const app = express();

app.route("/").get((_, res) => res.json({ status: "ok" }));

const wss = new Server(
    app.listen(3030, () => console.log("Started server")),
    {
        pingInterval: 5000,
        pingTimeout: 10000,
        cors: {
            origin: "*",
        },
    }
);

// Map of roomId -> key
const keys = new Map();

wss.on('connection', function (socket) {
    const key = socket.handshake.auth.key;
    const roomId = socket.handshake.query.roomId;

    if (key === undefined || roomId === undefined || Array.isArray(key) || Array.isArray(roomId))
        return socket.disconnect();

    if (keys.get(roomId) === undefined) {
        console.log("Host opened room " + roomId);
        keys.set(roomId, key);
        socket.emit("host");
    }

    socket.join(roomId);
    console.log("Joined room " + roomId);

    socket.on("error", console.error);

    socket.on("play", (...data) => {
        console.log("play");
        if (keys.get(roomId) === key)
            socket.to(roomId).emit("play", ...data);
    });
})