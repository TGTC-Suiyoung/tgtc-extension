/* TGTC X 内联评估（简单版）：识别推文中的 BSC CA → 角标 ⚡ → 点击原地弹卡片 */
(() => {
  "use strict";
  const BASE = "https://www.tgtcbot.com";
  const CA_RE = /\b0x[0-9a-fA-F]{40}\b/g;

  // ── 中英双语（跟随浏览器语言；开源面向国际用户，非中文环境自动显示英文）──
  const LANG = (navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
  const T = {
    zh: {
      badgeTitle: "TGTC 评估（BSC 链上数据）",
      loading: "⏳ TGTC 评估中…",
      errNoKey: "⚠️ 请先点击浏览器工具栏 TGTC 图标，填入 API Key",
      errNotFound: "❌ 非代币或查询失败（可能是钱包地址）",
      errNet: "⚠️ 网络异常：",
      tierOk: "通过", tierWarn: "留意", tierBad: "貔貅",
      rHoneypot: "貔貅（疑似不可卖出）", rBlack: "黑名单", rMint: "Mint 未放弃",
      rNoSell: "不可卖出", rLp: "LP 销毁 ", rTax: "税率 ",
      okVerified: "合约已验证", okOpen: "开源", okCto: "社区接管",
      okNone: "未发现明显风险",
      padPre: "⏳ ", padLive: "🚀 ", presale: "预售 ", live: "已发射",
      secMarket: "行情", secChain: "链上", secMoves: "动向", secSafety: "安全",
      mcap: "市值", liq: "流动性", vol24: "24h 成交", holders: "持有人",
      age: "上线", bsr: "买卖比", ath: "距高点", swaps: "换手",
      vol1h: "1h 量", supply: "供应",
      smart: "聪明钱", sniper: "狙击手", bundle: "捆绑包", top10: "前10",
      tax: "税", dev: "开发者", fish: "钓鱼", bot: "机器人",
      whale: "巨鲸", vault: "金库",
      in: "上车", out: "下车", net: "净",
      moreCa: "检测到 {n} 个 CA，评估首个",
      moreNames: "等 {n} 位",
      close: "关闭",
      bscscan: "BscScan", tgtc: "TGTC 详情",
      athNew: "新高",
    },
    en: {
      badgeTitle: "TGTC evaluation (BSC on-chain)",
      loading: "⏳ TGTC evaluating…",
      errNoKey: "⚠️ Click the TGTC icon and enter your API Key first",
      errNotFound: "❌ Not a token or query failed (maybe a wallet address)",
      errNet: "⚠️ Network error: ",
      tierOk: "Pass", tierWarn: "Caution", tierBad: "Honeypot",
      rHoneypot: "Honeypot (sell likely blocked)", rBlack: "Blacklisted", rMint: "Mint not renounced",
      rNoSell: "Cannot sell", rLp: "LP burned ", rTax: "Tax ",
      okVerified: "Contract verified", okOpen: "Open source", okCto: "CTO",
      okNone: "No obvious risk found",
      padPre: "⏳ ", padLive: "🚀 ", presale: "presale ", live: "Live",
      secMarket: "Market", secChain: "On-chain", secMoves: "Moves", secSafety: "Safety",
      mcap: "Mcap", liq: "Liquidity", vol24: "24h Vol", holders: "Holders",
      age: "Age", bsr: "Buy:Sell", ath: "From ATH", swaps: "Swaps",
      vol1h: "1h Vol", supply: "Supply",
      smart: "Smart", sniper: "Snipers", bundle: "Bundlers", top10: "Top-10",
      tax: "Tax", dev: "Dev", fish: "Phishing", bot: "Bots",
      whale: "Whales", vault: "Vault",
      in: "in", out: "out", net: "net",
      moreCa: "{n} CAs found, evaluating the first",
      moreNames: "and {n} more",
      close: "Close",
      bscscan: "BscScan", tgtc: "TGTC",
      athNew: "ATH",
    },
  }[LANG];

  function extractCa(article) {
    const found = [];
    const roots = article.querySelectorAll('[data-testid="tweetText"]');
    for (const el of roots) {
      const t = el.textContent || "";
      for (const m of t.matchAll(CA_RE)) {
        const c = m[0].toLowerCase();
        if (!found.includes(c)) found.push(c);
      }
    }
    return found.slice(0, 3);
  }

  function processArticle(article) {
    if (article.dataset.tgtcDone) return;
    const cas = extractCa(article);
    if (!cas.length) return;
    article.dataset.tgtcDone = "1";
    article.style.position = "relative";

    const badge = document.createElement("button");
    badge.className = "tgtc-x-badge";
    badge.textContent = "⚡";
    badge.title = T.badgeTitle;
    badge.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCard(badge, cas);
    });
    article.appendChild(badge);
  }

  function closeCard() {
    const old = document.querySelector(".tgtc-x-card");
    if (old) old.remove();
    document.removeEventListener("click", onDocClick, true);
  }
  function onDocClick(e) {
    if (!e.target.closest(".tgtc-x-card") && !e.target.closest(".tgtc-x-badge")) closeCard();
  }

  async function openCard(anchor, cas) {
    closeCard();
    const card = document.createElement("div");
    card.className = "tgtc-x-card";
    card.innerHTML = `<div class="tgtc-x-load">${T.loading}</div>`;
    appendCard(anchor, card);
    try {
      const d = await fetchViaWorker(cas[0]);
      if (d === "NO_KEY") {
        card.innerHTML = `<div class="tgtc-x-err">${T.errNoKey}</div>`;
        return;
      }
      if (!d) {
        card.innerHTML = `<div class="tgtc-x-err">${T.errNotFound}</div>`;
        return;
      }
      renderCard(card, d, cas);
    } catch (e) {
      card.innerHTML = `<div class="tgtc-x-err">${T.errNet}${e.message || e}</div>`;
    }
  }

  function appendCard(anchor, card) {
    document.body.appendChild(card);
    const r = anchor.getBoundingClientRect();
    card.style.top = Math.max(8, Math.min(r.bottom + 8, window.innerHeight - 220)) + "px";
    card.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 350)) + "px";
    document.addEventListener("click", onDocClick, true);
  }

  // content script 跨域受限（MV3）→ 统一走 background worker 转发
  function fetchViaWorker(ca) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: "tgtc_lookup", ca }, (resp) => {
        if (chrome.runtime.lastError) { resolve(null); return; }
        if (!resp || resp.err === "NO_KEY") { resolve("NO_KEY"); return; }
        resolve(resp && resp.ok ? resp.data : null);
      });
    });
  }

  function fmt(v) {
    v = Number(v || 0);
    if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
    if (v >= 1e3) return "$" + (v / 1e3).toFixed(1) + "K";
    if (v >= 1) return "$" + v.toFixed(2);
    if (v <= 0) return "$0";
    // 小数：不用科学计数法（如 0.0001234），按有效数字保留精度
    return "$" + v.toLocaleString("en-US", { maximumSignificantDigits: 6 });
  }

  // 普通数字缩写（供应量等，无 $ 前缀）：1.2K / 3.4M / 5.6B
  function fmtNum(v) {
    v = Number(v || 0);
    if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
    if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
    if (v >= 1e3) return (v / 1e3).toFixed(1) + "K";
    return v.toFixed(0);
  }

  // 带符号美元（净买入额）：+$12.5K / −$3.2K
  function fmtUsd(v) {
    v = Number(v || 0);
    if (v === 0) return "0";
    const a = Math.abs(v);
    const s = a >= 1e6 ? "$" + (a / 1e6).toFixed(2) + "M"
      : a >= 1e3 ? "$" + (a / 1e3).toFixed(1) + "K"
      : "$" + a.toFixed(0);
    return (v > 0 ? "+" : "−") + s;
  }

  function boolOf(v) {
    if (v === true || v === 1 || v === "1" || v === "yes" || v === "true") return true;
    if (v === false || v === 0 || v === "0" || v === "no" || v === "false") return false;
    return null;
  }

  // 安全评级：只有「貔貅（honeypot）」算致命项；其余风险逐条列出，不做武断的「高风险」定性
  function safetyOf(d) {
    const hp = boolOf(d.honeypot);
    const mintRen = boolOf(d.mint_renounced) === true || boolOf(d.renounced) === true;
    const mintKnown = boolOf(d.mint_renounced) !== null || boolOf(d.renounced) !== null;
    const black = boolOf(d.blacklist);
    const sellable = boolOf(d.sellable);
    const lpRaw = d.lp_burned_ratio;
    const lp = Number(lpRaw || 0);
    const taxRaw = Math.max(Number(d.buy_tax || 0), Number(d.sell_tax || 0));
    const taxKnown = (d.buy_tax !== undefined && d.buy_tax !== null) ||
      (d.sell_tax !== undefined && d.sell_tax !== null);
    const risks = [];
    if (hp === true) risks.push(T.rHoneypot);
    if (black === true) risks.push(T.rBlack);
    if (mintKnown && !mintRen) risks.push(T.rMint);
    // can_sell 与 honeypot 高度重叠，且新币 security 数据未就绪时常缺失（后端已默认 1 可卖）；
    // 单独出现 0 很可能是误报 → 仅在貔貅确认时才标记「不可卖出」
    if (hp === true && sellable === false) risks.push(T.rNoSell);
    if (lpRaw !== undefined && lpRaw !== null && lp < 0.9) risks.push(T.rLp + (lp * 100).toFixed(0) + "%");
    if (taxKnown && taxRaw >= 0.1) risks.push(T.rTax + (taxRaw * 100).toFixed(0) + "%");
    if (hp === true) return { tier: "bad", label: T.tierBad, risks };
    if (!risks.length) return { tier: "ok", label: T.tierOk, risks };
    return { tier: "warn", label: T.tierWarn, risks };
  }

  function fmtAge(h) {
    h = Number(h || 0);
    if (h <= 0) return "—";
    if (h < 1) return "<1h";
    if (h < 48) return (h < 10 ? h.toFixed(1) : h.toFixed(0)) + "h";
    return (h / 24).toFixed(1) + "d";
  }

  function renderCard(card, d, cas) {
    const pct = (x) => (x === undefined || x === null ? "—" : (Number(x) * 100).toFixed(1) + "%");
    const s = safetyOf(d);
    const tierIcon = s.tier === "ok" ? "✓" : s.tier === "warn" ? "⚠" : "✗";
    const chg1h = Number(d.chg_1h_pct || 0);
    const chg1hCls = chg1h > 0 ? "up" : chg1h < 0 ? "down" : "flat";
    const chg1hTxt = chg1h === 0 ? "0%" : (chg1h > 0 ? "+" : "") + chg1h.toFixed(1) + "%";
    const chg = Number(d.chg_24h_pct || 0);
    const chgCls = chg > 0 ? "up" : chg < 0 ? "down" : "flat";
    const chgTxt = chg === 0 ? "0%" : (chg > 0 ? "+" : "") + chg.toFixed(1) + "%";
    const bsr = Number(d.buy_sell_ratio_24h || 0);
    const bsrTxt = bsr > 0 ? "1:" + bsr.toFixed(2) : "—";
    const price = Number(d.price || 0);
    const ath = Number(d.ath_price || 0);
    const athTxt = ath > 0 && price > 0 ? (price >= ath ? T.athNew : "−" + ((1 - price / ath) * 100).toFixed(1) + "%") : "—";
    const athCls = ath > 0 && price > 0 ? (price >= ath ? "up" : "down") : "flat";
    // 可信正向标签（聚合接口 basic/security 分类）：与风险标签并列，绿底展示
    const okTags = [];
    if (Number(d.contract_verified) === 1) okTags.push(T.okVerified);
    if (boolOf(d.open_source) === true) okTags.push(T.okOpen);
    if (boolOf(d.community_takeover) === true) okTags.push(T.okCto);
    // 发射台进度：预售中 xx% / 已发射（打新场景第一信息）
    const pad = String(d.launchpad || "");
    const prog = Number(d.launchpad_progress || 0);
    const pumpHtml = pad ? (prog >= 1
      ? `<div class="tgtc-x-pump">${T.padLive}${pad} · ${T.live}</div>`
      : prog > 0 ? `<div class="tgtc-x-pump">${T.padPre}${pad} · ${T.presale}${(prog * 100).toFixed(0)}%</div>` : "") : "";
    // 聪明钱/KOL 上下车摘要 + 净买入额（traders 类别：钱包地址数，非交易次数）
    // KOL 来自 token_traders tag='renowned'（GMGN 默认 top 排行不含 kol tag 钱包）
    const tr = d.traders && typeof d.traders === "object" ? d.traders : null;
    const smartNet = Number(tr && tr.smart_net || 0);
    const kolNet = Number(tr && tr.kol_net || 0);
    const kolCount = Number(tr && tr.kol_count || 0);
    const kolNames = Array.isArray(tr && tr.kol_names) ? tr.kol_names : [];
    const hasMoves = tr && (tr.smart_buy || tr.smart_sell || tr.kol_buy || tr.kol_sell ||
      smartNet !== 0 || kolNet !== 0 || kolCount > 0);
    const kolNameTxt = kolNames.length
      ? kolNames.slice(0, 2).join(" · ") + (kolCount > 2 ? " " + T.moreNames.replace("{n}", kolCount) : "") : "";
    const kolRow = kolCount || tr.kol_buy || tr.kol_sell || kolNet !== 0 ? `
        <span>👑 KOL <b class="up">${Number(tr.kol_buy || 0)} ${T.in}</b><b class="down">${Number(tr.kol_sell || 0)} ${T.out}</b><b class="${kolNet > 0 ? "up" : kolNet < 0 ? "down" : "flat"}">${T.net} ${fmtUsd(kolNet)}</b></span>
        ${kolNameTxt ? `<span class="tgtc-x-kolnames">${kolNameTxt}</span>` : ""}` : "";
    const movesHtml = hasMoves ? `
      <div class="tgtc-x-sec">${T.secMoves}</div>
      <div class="tgtc-x-moves">
        <span>🧠 ${T.smart} <b class="up">${Number(tr.smart_buy || 0)} ${T.in}</b><b class="down">${Number(tr.smart_sell || 0)} ${T.out}</b><b class="${smartNet > 0 ? "up" : smartNet < 0 ? "down" : "flat"}">${T.net} ${fmtUsd(smartNet)}</b></span>
        ${kolRow}
      </div>` : "";
    card.innerHTML = `
      <div class="tgtc-x-head">
        <span class="tgtc-x-tier ${s.tier}">${tierIcon} ${s.label}</span>
        <b>${d.symbol || "—"}</b>
        <span>${d.name || ""} · BSC</span>
        <button class="tgtc-x-close" title="${T.close}">×</button>
      </div>
      <div class="tgtc-x-price-row">
        <span class="tgtc-x-price">${fmt(d.price)}</span>
        <span class="tgtc-x-chg ${chg1hCls}">1h ${chg1hTxt}</span>
        <span class="tgtc-x-chg ${chgCls}">24h ${chgTxt}</span>
      </div>
      ${pumpHtml}
      <div class="tgtc-x-sec">${T.secMarket}</div>
      <div class="tgtc-x-grid">
        <div><span>${T.mcap}</span><b>${fmt(d.mcap)}</b></div>
        <div><span>${T.liq}</span><b>${fmt(d.liquidity)}</b></div>
        <div><span>${T.vol24}</span><b>${fmt(d.volume_24h)}</b></div>
        <div><span>${T.holders}</span><b>${Number(d.holder_count || 0).toLocaleString()}</b></div>
        <div><span>${T.age}</span><b>${fmtAge(d.age_hours)}</b></div>
        <div><span>${T.bsr}</span><b>${bsrTxt}</b></div>
        <div><span>${T.ath}</span><b class="tgtc-x-num ${athCls}">${athTxt}</b></div>
        <div><span>${T.swaps}</span><b>${Number(d.swaps_24h || 0).toLocaleString()}</b></div>
        <div><span>${T.vol1h}</span><b>${fmt(d.volume_1h)}</b></div>
        <div><span>${T.supply}</span><b>${fmtNum(d.circulating_supply)} / ${fmtNum(d.total_supply)}</b></div>
      </div>
      <div class="tgtc-x-sec">${T.secChain}</div>
      <div class="tgtc-x-grid">
        <div><span>${T.smart}</span><b>${d.smart_wallets ?? "—"}</b></div>
        <div><span>${T.sniper}</span><b>${pct(d.sniper_ratio)}</b></div>
        <div><span>${T.bundle}</span><b>${pct(d.bundle_ratio)}</b></div>
        <div><span>${T.top10}</span><b>${pct(d.top10_holders)}</b></div>
        <div><span>${T.tax}</span><b>${pct(d.buy_tax)} / ${pct(d.sell_tax)}</b></div>
        <div><span>${T.dev}</span><b>${pct(d.dev_hold_pct)}</b></div>
        <div><span>${T.fish}</span><b>${pct(d.fishing_ratio)}</b></div>
        <div><span>${T.bot}</span><b>${pct(d.bot_ratio)}</b></div>
        <div><span>${T.whale}</span><b>${Number(d.whale_wallets || 0)}</b></div>
        <div><span>${T.vault}</span><b>${pct(d.vault_ratio)}</b></div>
      </div>
      ${movesHtml}
      <div class="tgtc-x-sec">${T.secSafety}</div>
      <div class="tgtc-x-risk">
        ${s.risks.length
          ? s.risks.map((r) => `<span class="tgtc-x-tag ${s.tier}">${r}</span>`).join("")
          : `<span class="tgtc-x-tag ok">${T.okNone}</span>`}
        ${okTags.map((t) => `<span class="tgtc-x-tag ok">${t}</span>`).join("")}
      </div>
      <div class="tgtc-x-foot">
        ${cas.length > 1 ? `<span class="tgtc-x-more">${T.moreCa.replace("{n}", cas.length)}</span>` : ""}
        <a href="https://bscscan.com/token/${d.ca || cas[0]}" target="_blank" rel="noopener">${T.bscscan}</a>
        <a href="https://www.tgtcbot.com/changelog.zh.html" target="_blank" rel="noopener">${T.tgtc}</a>
      </div>`;
    card.querySelector(".tgtc-x-close").addEventListener("click", closeCard);
  }

  // ── 扫描：初始 + 滚动加载（MutationObserver）──
  function scanAll() {
    document.querySelectorAll('article[data-testid="tweet"]').forEach(processArticle);
  }
  const obs = new MutationObserver((muts) => {
    let n = 0;
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches('article[data-testid="tweet"]')) processArticle(node);
        else if (node.querySelectorAll) node.querySelectorAll('article[data-testid="tweet"]').forEach(processArticle);
        if (++n > 40) break; // 节流：单批最多处理 40 个
      }
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
  scanAll();
  // 防抖重扫（页面结构变化时兜底）
  let t;
  window.addEventListener("load", () => { clearTimeout(t); t = setTimeout(scanAll, 800); });
})();
