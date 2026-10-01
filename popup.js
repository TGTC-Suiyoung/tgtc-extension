// TGTC 数据引擎 · popup = Key 设置面板（X 内联评估为主场）
const $ = id => document.getElementById(id);

async function refreshStatus() {
  const { tgtc_key: key } = await chrome.storage.local.get(["tgtc_key"]);
  const st = $("status");
  if (key && key.startsWith("sk_")) {
    st.className = "status ok";
    st.textContent = "✓ Key 已保存 —— X 页面上 ⚡ 已可用";
  } else {
    st.className = "status no";
    st.textContent = "⚙️ 未填写 Key —— X 页面上 ⚡ 将不可用";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const { tgtc_key: key } = await chrome.storage.local.get(["tgtc_key"]);
  if (key) $("key").value = key;
  refreshStatus();
});

$("key").addEventListener("input", async () => {
  const v = $("key").value.trim();
  if (v) await chrome.storage.local.set({ tgtc_key: v });
  else await chrome.storage.local.remove("tgtc_key");
  refreshStatus();
});
