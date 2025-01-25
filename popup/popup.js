document.getElementById("launch").addEventListener("click", function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("page/index.html") });
});
