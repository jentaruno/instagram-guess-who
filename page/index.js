async function handleClick() {
  const igUsername = document.getElementById("ig_username").value;
  const tab = await chrome.tabs.create({
    url: "https://instagram.com",
    active: false,
  });
  chrome.runtime.onMessage.addListener(function getMutuals(request, sender) {
    if (request.type !== "ready" || sender.tab.id !== tab.id) return;
    console.log("instagram tab ready");
    // once message is received, remove this listener
    chrome.runtime.onMessage.removeListener(getMutuals);
    // add listener to process received mutuals
    chrome.runtime.onMessage.addListener(function processMutuals(
      request,
      sender
    ) {
      if (sender.tab.id !== tab.id) return;
      console.log("response received from tab");
      if (request.type === "mutuals") {
        // TODO: launch game with mutuals
        console.log(request.mutuals);
      } else if (request.type === "error") {
        // TODO: error handling
        console.log(request.error);
      } else {
        // invalid response, ignore it
        return;
      }
      // when mutuals/error received, remove listener and close ig tab
      chrome.runtime.onMessage.removeListener(processMutuals);
      chrome.tabs.remove(tab.id);
    });
    // send igUsername to get mutuals
    chrome.tabs.sendMessage(sender.tab.id, {
      msg: "get-mutuals",
      username: igUsername,
    });
  });
}

document.getElementById("scraping-btn").addEventListener("click", handleClick);
