// TGTC 扩展 · background service worker
// content script 的 fetch 受页面 CORS 限制（MV3），跨域请求统一走这里
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && (msg.type === "tgtc_lookup" || msg.type === "tgtc_sentiment")) {
    (async () => {
      const { tgtc_key: key } = await chrome.storage.local.get(["tgtc_key"]);
      if (!key) {
        sendResponse({ ok: false, status: 0, err: "NO_KEY" });
        return;
      }
      try {
        const path = msg.type === "tgtc_lookup" ? "/api/v1/aggregation/token" : "/api/v1/twitter/sentiment";
        const body = msg.type === "tgtc_lookup"
          ? { ca: msg.ca, categories: ["basic", "structure", "security", "traders"] }
          : { ca: msg.ca };
        const res = await fetch("https://www.tgtcbot.com" + path, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": key },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        sendResponse({ ok: res.ok, status: res.status, data });
        // 本地转化统计（今日扫描 CA 数 / 命中危险数）：仅计数，不收集任何账号信息
        if (res.ok && data && msg.type === "tgtc_lookup") {
          try {
            const today = new Date().toISOString().slice(0, 10);
            const st = await chrome.storage.local.get(["tgtc_scan_stats"]);
            const cur = (st.tgtc_scan_stats && st.tgtc_scan_stats.date === today)
              ? st.tgtc_scan_stats : { date: today, scanned: 0, danger: 0 };
            cur.scanned = (cur.scanned || 0) + 1;
            if (data.honeypot === true) cur.danger = (cur.danger || 0) + 1;
            await chrome.storage.local.set({ tgtc_scan_stats: cur });
          } catch (e) { /* 计数失败不影响主流程 */ }
        }
      } catch (e) {
        sendResponse({ ok: false, status: 0, err: String(e && e.message || e) });
      }
    })();
    return true; // 保持消息通道以支持异步响应
  }
});
