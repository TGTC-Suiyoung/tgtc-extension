// TGTC 扩展 · background service worker
// content script 的 fetch 受页面 CORS 限制（MV3），跨域请求统一走这里
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "tgtc_lookup") {
    (async () => {
      const { tgtc_key: key } = await chrome.storage.local.get(["tgtc_key"]);
      if (!key) {
        sendResponse({ ok: false, status: 0, err: "NO_KEY" });
        return;
      }
      try {
        const res = await fetch("https://www.tgtcbot.com/api/v1/aggregation/token", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": key },
          body: JSON.stringify({ ca: msg.ca, categories: ["basic", "structure", "security", "traders"] }),
        });
        const data = await res.json().catch(() => null);
        sendResponse({ ok: res.ok, status: res.status, data });
      } catch (e) {
        sendResponse({ ok: false, status: 0, err: String(e && e.message || e) });
      }
    })();
    return true; // 保持消息通道以支持异步响应
  }
});
