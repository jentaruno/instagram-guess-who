import browser from "webextension-polyfill";

export default async function handleClick(
  igUsername,
  handleResponse,
  handleError
) {
  const tab = await browser.tabs.create({
    url: "https://instagram.com",
    active: false,
  });
  browser.runtime.onMessage.addListener(function getMutuals(request, sender) {
    if (request.type !== "ready" || sender.tab.id !== tab.id) return;
    console.log("instagram tab ready");
    // once message is received, remove this listener
    browser.runtime.onMessage.removeListener(getMutuals);
    // add listener to process received mutuals
    browser.runtime.onMessage.addListener(function processMutuals(
      request,
      sender
    ) {
      if (sender.tab.id !== tab.id) return;
      console.log("response received from tab");
      if (request.type === "mutuals") {
        // mutuals data received, start game
        console.log(request.mutuals);
        handleResponse(request.mutuals);
      } else if (request.type === "error") {
        // pass error to the frontend
        console.log(request.error);
        handleError(request.error);
      } else {
        // invalid response, ignore it
        return;
      }
      // when mutuals/error received, remove listener and close ig tab
      browser.runtime.onMessage.removeListener(processMutuals);
      browser.tabs.remove(tab.id);
    });
    // send igUsername to get mutuals
    browser.tabs.sendMessage(sender.tab.id, {
      msg: "get-mutuals",
      username: igUsername,
    });
  });
}
