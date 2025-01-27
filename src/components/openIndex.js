import browser from "webextension-polyfill";

export default function openIndex() {
  browser.tabs.create({ url: browser.runtime.getURL("index.html") });
}
