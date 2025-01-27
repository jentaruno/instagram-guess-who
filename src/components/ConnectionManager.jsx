import React from 'react';
import {socket} from "../scripts/socket.js";

export function ConnectionManager() {
    function connect() {
        socket.connect();
        socket.emit("peer-msg");
    }

    function disconnect() {
        socket.disconnect();
    }

    return (
        <>
            <button onClick={ connect }>Connect</button>
            <button onClick={ disconnect }>Disconnect</button>
        </>
    );
}