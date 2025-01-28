import browser from "webextension-polyfill";
import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.1/+esm";

// Open in a page instead of popup
browser.action.onClicked.addListener(() => {
  browser.tabs.create({ url: browser.runtime.getURL("index.html") });
});

//#region Connect and receive from sockets
browser.runtime.onMessage.addListener((message) => {
  if (message.event === "joinRoom")
    connect(message.roomId);
});

let isHost = false;
const URL = "ws://localhost:3030";
let ws;

function connect(roomId) {
  browser.storage.local.set({ roomId });

  ws = io(URL, {
    forceNew: true,
    transports: ["websocket"],
    auth: { key },
    query: { roomId },
  });

  ws.on("error", console.error);
  ws.on("connect", () => console.log("Connected to server"));
  ws.on("host", () => {
    console.log("I am the host :D");
    isHost = true;
  });
  ws.on("play", (text) =>
      browser.runtime.sendMessage({ event: "play", text }));
}
//#endregion

//#region Set connection key
let key = "";

browser.storage.local.get(["key", "lastUsed"]).then((data) => {
  const lastUsed = parseInt(data.lastUsed || 0);
  const fiveMinutesAgo = Date.now() - 1000 * 60 * 5;

  // Check if we need to generate a new key
  if (lastUsed < fiveMinutesAgo || !data.key) {
    const newKey = randomString(32); // Generate a new random key
    browser.storage.local.set({ key: newKey, lastUsed: Date.now() }).then(() => {
      console.log("Key and lastUsed updated:", newKey);
    });
  } else {
    console.log("Key is still valid:", data.key);
  }
});

setInterval(() => {
  browser.storage.local.set({ lastUsed: Date.now() });
}, 5000);

function randomString(length) {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
//#endregion

//#region Sending to socket
browser.runtime.onMessage.addListener((message) => {
  if (!ws) return;
  if (message.event === "play") ws.emit("play", message.text);
});
//#endregion