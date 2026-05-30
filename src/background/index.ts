chrome.runtime.onInstalled.addListener(() => {
  console.log("Phantom installed");
});

chrome.runtime.onMessage.addListener((_message, _sender, sendResponse) => {
  sendResponse({ ok: true });
  return true;
});

export {};
