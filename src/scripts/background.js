import browser from "webextension-polyfill";
import { io } from "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.1/+esm";

browser.action.onClicked.addListener(() => {
  browser.tabs.create({ url: browser.runtime.getURL("index.html") });
});

browser.runtime.onMessage.addListener((message) => {
  if (message.event === "joinRoom")
    connect(message.roomId);
});

let key = "";
let isHost = false;

function randomString(length) {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
browser.storage.local.get(["key", "lastUsed"]).then((data) => {
  data.lastUsed = parseInt(data.lastUsed || 0);
  if (data.lastUsed < Date.now() - 1000 * 60 * 5) data.key = randomString(32);
  key = data.key;
  browser.storage.local.set({ key });
});
setInterval(() => browser.storage.local.set({ lastUsed: Date.now() }), 5000);

browser.runtime.onMessage.addListener((message) => {
  if (!ws) return;
  if (message.event === "play") ws.emit("play", message.text);
});

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