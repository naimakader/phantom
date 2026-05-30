chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "APPLY_SIMULATION") {
    const html = document.documentElement;
    html.style.filter = message.filter !== "none" ? message.filter : "";
    sendResponse({ ok: true });
  }
  return true;
});

export {};
