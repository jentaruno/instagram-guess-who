//just for sending a signal to "content.js" to start scraping
document.getElementById("scraping-btn").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("hi");
    chrome.tabs.sendMessage(tabs[0].id, { msg: "get-mutuals" });
  });
});

document.getElementById("play-btn").addEventListener("click", function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("page/index.html") });
});
