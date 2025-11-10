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

  function newTimeout(duration, listener, message) {
    return setTimeout(() => {
      browser.runtime.onMessage.removeListener(listener);
      browser.tabs.remove(tab.id);
      handleError(message);
    }, duration);
  }
  let timeout = newTimeout(10000, getMutuals, "Instagram tab timed out");
  function getMutuals(request, sender) {
    if (request.type !== "ready" || sender.tab.id !== tab.id) return;
    console.log("instagram tab ready");
    clearTimeout(timeout);
    // once message is received, remove this listener
    browser.runtime.onMessage.removeListener(getMutuals);
    // add listener to process received mutuals
    browser.runtime.onMessage.addListener(processMutuals);
    // send igUsername to get mutuals
    browser.tabs.sendMessage(sender.tab.id, {
      msg: "get-mutuals",
      username: igUsername,
    });
    // start new timeout
    timeout = newTimeout(
      10000,
      processMutuals,
      "Getting mutuals from Instagram timed out"
    );
  }
  browser.runtime.onMessage.addListener(getMutuals);

  function processMutuals(request, sender) {
    if (sender.tab.id !== tab.id) return;
    console.log("response received from tab");
    if (request.type === "mutuals") {
      // mutuals data received, handle response
      console.log(request);
      handleResponse(request.mutuals, request.username);
    } else if (request.type === "error") {
      // pass error to the frontend
      console.log(request.error);
      handleError(request.error);
    } else {
      // invalid response, ignore it
      return;
    }
    // when mutuals/error received, remove listener, clear timeout, and close ig tab
    clearTimeout(timeout);
    browser.runtime.onMessage.removeListener(processMutuals);
    browser.tabs.remove(tab.id);
  }
}
