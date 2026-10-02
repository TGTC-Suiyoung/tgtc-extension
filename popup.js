// TGTC 数据引擎 · popup = Key 设置面板（X 内联评估为主场）
// 中英双语：跟随浏览器语言，非中文环境自动显示英文（开源面向国际用户）
const $ = id => document.getElementById(id);

const LANG = (navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
const T = {
  zh: {
    sub: "X 推文中的合约，点一下即评估 · tgtcbot.com",
    keyLabel: "API Key（私聊 @TG_TC_BOT → 我的 API 获取）",
    how: "<b>怎么用：</b><br><span class=\"step-no\">①</span> 填好上方 Key（自动保存）<br><span class=\"step-no\">②</span> 打开 <b>x.com</b> 刷推文<br><span class=\"step-no\">③</span> 带 BSC 合约的推文右上角出现 <b>⚡</b><br><span class=\"step-no\">④</span> 点一下 → 原地弹出评估卡片（价格 / 安全 / 聪明钱）",
    linkGet: "获取 Key →",
    linkMore: "更多端点 →",
    ok: "✓ Key 已保存 —— X 页面上 ⚡ 已可用",
    no: "⚙️ 未填写 Key —— X 页面上 ⚡ 将不可用",
    statScan: "今日扫描 {n}",
    statDanger: "命中危险 {n}",
    board: "打开看板 →",
  },
  en: {
    sub: "BSC contracts in tweets, one click to evaluate · tgtcbot.com",
    keyLabel: "API Key (DM @TG_TC_BOT → My API)",
    how: "<b>How to use:</b><br><span class=\"step-no\">①</span> Enter your Key above (auto-saved)<br><span class=\"step-no\">②</span> Open <b>x.com</b> and scroll<br><span class=\"step-no\">③</span> Tweets with a BSC contract show a <b>⚡</b> badge<br><span class=\"step-no\">④</span> Click it → the assessment card pops up (price / safety / smart money)",
    linkGet: "Get a Key →",
    linkMore: "More endpoints →",
    ok: "✓ Key saved — ⚡ is ready on X",
    no: "⚙️ No key yet — ⚡ won't work on X",
    statScan: "Scanned today {n}",
    statDanger: "Flagged {n}",
    board: "Dashboard →",
  },
}[LANG];

async function refreshStatus() {
  const { tgtc_key: key } = await chrome.storage.local.get(["tgtc_key"]);
  const st = $("status");
  if (key && key.startsWith("sk_")) {
    st.className = "status ok";
    st.textContent = T.ok;
  } else {
    st.className = "status no";
    st.textContent = T.no;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  $("sub").textContent = T.sub;
  $("keyLabel").textContent = T.keyLabel;
  $("how").innerHTML = T.how;
  $("linkGet").textContent = T.linkGet;
  $("linkMore").textContent = T.linkMore;
  $("linkMore").href = LANG === "zh"
    ? "https://www.tgtcbot.com/changelog.zh.html"
    : "https://www.tgtcbot.com/changelog.html";
  // 今日扫描统计（本地计数：扫描 CA 数 / 命中危险数）+ 看板入口
  try {
    const { tgtc_scan_stats: st } = await chrome.storage.local.get(["tgtc_scan_stats"]);
    const today = new Date().toISOString().slice(0, 10);
    const cur = (st && st.date === today) ? st : { scanned: 0, danger: 0 };
    $("statScan").innerHTML = T.statScan.replace("{n}", "<b>" + (cur.scanned || 0) + "</b>");
    $("statDanger").innerHTML = T.statDanger.replace("{n}", "<b>" + (cur.danger || 0) + "</b>");
    $("statBoard").textContent = T.board;
  } catch (e) { /* 统计展示失败不影响主流程 */ }
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
