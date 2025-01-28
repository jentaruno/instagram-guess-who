import React, {useState} from 'react';
import browser from "webextension-polyfill";

export function ConnectionManager() {
    const [roomId, setRoomId] = useState("");
    function joinRoom() {
        browser.runtime.sendMessage({ event: "joinRoom", roomId })
    }

    function sendMessage() {
        browser.runtime.sendMessage({ event: "play", text: "Hej!" });
    }

    return (
        <div>
            <div className={"flex flex-row"}>
                <input type={"text"} onChange={(event) => {
                    setRoomId(event.target.value);
                }}/>
                <button onClick={joinRoom}>Join</button>
            </div>
            <button onClick={sendMessage}>Send message</button>
        </div>
    );
}