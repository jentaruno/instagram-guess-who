import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener((message) => {
    console.log("Received message from service worker: ", message);
    if (message.event === "play") {
        console.log(message.text);
    }
});