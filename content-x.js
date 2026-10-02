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
      badgeText: "⚡ 查CA",
      loading: "⏳ TGTC 评估中…",
      errNoKey: "⚠️ 请先点击浏览器工具栏 TGTC 图标，填入 API Key",
      errNotFound: "❌ 非代币或查询失败（可能是钱包地址）",
      errNet: "⚠️ 网络异常：",
      tierOk: "通过", tierWarn: "留意", tierBad: "貔貅", tierUnknown: "未知",
      rHoneypot: "貔貅（疑似不可卖出）", rBlack: "黑名单", rMint: "Mint 未放弃",
      rNoSell: "不可卖出", rLp: "LP 销毁 ", rTax: "税率 ",
      okVerified: "合约已验证", okOpen: "开源", okCto: "社区接管",
      okNone: "未发现明显风险",
      padPre: "⏳ ", padLive: "🚀 ", presale: "预售 ", live: "已发射",
      secMarket: "行情", secChain: "链上", secMoves: "动向", secSafety: "安全",
      secCore: "核心安全", lpBurned: "LP 烧毁", honeypotLabel: "蜜罐", mintLabel: "Mint",
      officialSec: "官方号画像", officialRename: "改名次数", officialDel: "删帖数", officialCreate: "发币数",
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
      copyCa: "复制 CA",
      copied: "已复制",
      expand: "展开详情",
      collapse: "收起",
      caPrev: "上一个 CA",
      caNext: "下一个 CA",
      symMismatch: "⚠️ 推文 {s} 与链上 symbol（{sym}）不一致——谨防同名仿盘",
      bscscan: "BscScan", tgtc: "TGTC 详情",
      athNew: "新高",
    },
    en: {
      badgeTitle: "TGTC evaluation (BSC on-chain)",
      badgeText: "⚡ Check CA",
      loading: "⏳ TGTC evaluating…",
      errNoKey: "⚠️ Click the TGTC icon and enter your API Key first",
      errNotFound: "❌ Not a token or query failed (maybe a wallet address)",
      errNet: "⚠️ Network error: ",
      tierOk: "Pass", tierWarn: "Caution", tierBad: "Honeypot", tierUnknown: "Unknown",
      rHoneypot: "Honeypot (sell likely blocked)", rBlack: "Blacklisted", rMint: "Mint not renounced",
      rNoSell: "Cannot sell", rLp: "LP burned ", rTax: "Tax ",
      okVerified: "Contract verified", okOpen: "Open source", okCto: "CTO",
      okNone: "No obvious risk found",
      padPre: "⏳ ", padLive: "🚀 ", presale: "presale ", live: "Live",
      secMarket: "Market", secChain: "On-chain", secMoves: "Moves", secSafety: "Safety",
      secCore: "Key Safety", lpBurned: "LP Burned", honeypotLabel: "Honeypot", mintLabel: "Mint",
      officialSec: "Official account", officialRename: "Username renames", officialDel: "Deleted tweets", officialCreate: "Tokens created",
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
      copyCa: "Copy CA",
      copied: "Copied",
      expand: "Details",
      collapse: "Collapse",
      caPrev: "Previous CA",
      caNext: "Next CA",
      symMismatch: "⚠️ Tweet's {s} doesn't match on-chain symbol ({sym}) — watch for copycats",
      bscscan: "BscScan", tgtc: "TGTC",
      athNew: "ATH",
    },
  }[LANG];

  // 站点详情页链接（开源后国际用户点开英文页）
  const CHANGELOG_URL = LANG === "zh"
    ? "https://www.tgtcbot.com/changelog.zh.html"
    : "https://www.tgtcbot.com/changelog.html";

  const CASHTAG_RE = /\$([A-Za-z0-9]{1,12})/g;

  function extractCa(article) {
    const cas = [];
    const cashtags = [];
    const roots = article.querySelectorAll('[data-testid="tweetText"]');
    for (const el of roots) {
      const t = el.textContent || "";
      for (const m of t.matchAll(CA_RE)) {
        const c = m[0].toLowerCase();
        if (!cas.includes(c)) cas.push(c);
      }
      for (const m of t.matchAll(CASHTAG_RE)) {
        const s = m[1].toUpperCase();
        if (s !== "USD" && !cashtags.includes(s)) cashtags.push(s);
      }
    }
    return { cas: cas.slice(0, 3), cashtags: cashtags.slice(0, 5) };
  }

  function processArticle(article) {
    if (article.dataset.tgtcDone) return;
    const { cas, cashtags } = extractCa(article);
    if (!cas.length) return;
    article.dataset.tgtcDone = "1";
    article.style.position = "relative";

    const badge = document.createElement("button");
    badge.className = "tgtc-x-badge";
    badge.textContent = T.badgeText;
    badge.title = T.badgeTitle;
    badge.dataset.cashtags = JSON.stringify(cashtags);
    badge.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCard(badge, cas, cashtags);
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

  // 打开卡片：多 CA 推文支持 ◀ ▶ 切换评估（同 CA 10s 缓存命中不重复扣次）
  async function openCard(anchor, cas, cashtags) {
    closeCard();
    const card = document.createElement("div");
    card.className = "tgtc-x-card";
    card.innerHTML = `<div class="tgtc-x-load">${T.loading}</div>`;
    appendCard(anchor, card);
    let idx = 0;
    const load = async (i) => {
      idx = i;
      card.innerHTML = `<div class="tgtc-x-load">${T.loading}</div>`;
      try {
        const d = await fetchViaWorker(cas[i]);
        if (d === "NO_KEY") {
          card.innerHTML = `<div class="tgtc-x-err">${T.errNoKey}</div>`;
          return;
        }
        if (!d) {
          card.innerHTML = `<div class="tgtc-x-err">${T.errNotFound}</div>`;
          return;
        }
        renderCard(card, d, { cas, cashtags: cashtags || [], idx, onSwitch: load });
      } catch (e) {
        card.innerHTML = `<div class="tgtc-x-err">${T.errNet}${e.message || e}</div>`;
      }
    };
    await load(0);
  }

  function appendCard(anchor, card) {
    document.body.appendChild(card);
    const r = anchor.getBoundingClientRect();
    card.style.top = Math.max(8, Math.min(r.bottom + 8, window.innerHeight - 220)) + "px";
    card.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 370)) + "px";
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

  // 剪贴板写入（用户点击触发；x.com 为 https，navigator.clipboard 可用，降级 execCommand）
  async function copyText(t) {
    try {
      await navigator.clipboard.writeText(t);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }

  function boolOf(v) {
    if (v === true || v === 1 || v === "1" || v === "yes" || v === "true") return true;
    if (v === false || v === 0 || v === "0" || v === "no" || v === "false") return false;
    return null;
  }

  // 安全评级：只有「貔貅（honeypot）」算致命项；其余风险逐条列出，不做武断的「高风险」定性
  // 关键安全字段全未知（新币 security 数据未就绪）→ 「⚪ 未知」态，绝不默认绿（信任感设计）
  function safetyOf(d) {
    const hp = boolOf(d.honeypot);
    const mintRen = boolOf(d.mint_renounced) === true || boolOf(d.renounced) === true;
    const mintKnown = boolOf(d.mint_renounced) !== null || boolOf(d.renounced) !== null;
    const black = boolOf(d.blacklist);
    const sellable = boolOf(d.sellable);
    const lpRaw = d.lp_burned_ratio;
    const lp = Number(lpRaw || 0);
    const lpKnown = lpRaw !== undefined && lpRaw !== null;
    const taxRaw = Math.max(Number(d.buy_tax || 0), Number(d.sell_tax || 0));
    const taxKnown = (d.buy_tax !== undefined && d.buy_tax !== null) ||
      (d.sell_tax !== undefined && d.sell_tax !== null);
    const keyKnown = [hp !== null, mintKnown, lpKnown, taxKnown].filter(Boolean).length >= 2;
    const risks = [];
    if (hp === true) risks.push(T.rHoneypot);
    if (black === true) risks.push(T.rBlack);
    if (mintKnown && !mintRen) risks.push(T.rMint);
    // can_sell 与 honeypot 高度重叠，且新币 security 数据未就绪时常缺失（后端已默认 1 可卖）；
    // 单独出现 0 很可能是误报 → 仅在貔貅确认时才标记「不可卖出」
    if (hp === true && sellable === false) risks.push(T.rNoSell);
    if (lpKnown && lp < 0.9) risks.push(T.rLp + (lp * 100).toFixed(0) + "%");
    if (taxKnown && taxRaw >= 0.1) risks.push(T.rTax + (taxRaw * 100).toFixed(0) + "%");
    if (hp === true) return { tier: "bad", label: T.tierBad, risks };
    if (!keyKnown && !risks.length) return { tier: "unknown", label: T.tierUnknown, risks };
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

  function renderCard(card, d, ctx) {
    const cas = ctx.cas;
    const pct = (x) => (x === undefined || x === null ? "—" : (Number(x) * 100).toFixed(1) + "%");
    const s = safetyOf(d);
    const tierIcon = s.tier === "unknown" ? "◇" : s.tier === "ok" ? "✓" : s.tier === "warn" ? "⚠" : "✗";
    // 同名防错：推文里的 $CASHTAG 与链上 symbol 不一致 → 顶部警示（BSC 仿盘多）
    const symWarn = (() => {
      const sym = String(d.symbol || "").toUpperCase();
      const bad = (ctx.cashtags || []).find((t) => t && t !== sym);
      return bad ? `<div class="tgtc-x-symwarn">${T.symMismatch.replace("{s}", "$" + bad).replace("{sym}", sym)}</div>` : "";
    })();
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
    // KOL 来自独立过滤的交易者排行（默认 top 排行不含 kol 钱包）
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
    // 轻卡默认视图：价格 + 6 项核心安全 + 操作行；点「展开详情」显示全字段（扫推特快速决策）
    const hpV = boolOf(d.honeypot);
    const mintRenV = boolOf(d.mint_renounced) === true || boolOf(d.renounced) === true;
    const mintKnownV = boolOf(d.mint_renounced) !== null || boolOf(d.renounced) !== null;
    const hpTxt = hpV === true ? "✗" : hpV === false ? "✓" : "—";
    const mintTxt = mintRenV ? "✓" : mintKnownV ? "✗" : "—";
    // 官方号深层画像（改名/删帖/发币历史计数，聚合接口 basic 分类附带）
    const rn = Number(d.twitter_rename_count || 0);
    const dt = Number(d.twitter_deleted_tweet_count || 0);
    const ct = Number(d.twitter_created_token_count || 0);
    const officialHtml = (rn + dt + ct) > 0 ? `
      <div class="tgtc-x-sec">${T.officialSec}</div>
      <div class="tgtc-x-grid">
        <div><span>${T.officialRename}</span><b>${rn}</b></div>
        <div><span>${T.officialDel}</span><b>${dt}</b></div>
        <div><span>${T.officialCreate}</span><b>${ct}</b></div>
      </div>` : "";
    card.innerHTML = `
      <div class="tgtc-x-head">
        <span class="tgtc-x-tier ${s.tier}">${tierIcon} ${s.label}</span>
        <b>${d.symbol || "—"}</b>
        <span>${d.name || ""} · BSC</span>
        ${cas.length > 1 ? `
        <span class="tgtc-x-ca-nav">
          <button class="tgtc-x-ca-prev" title="${T.caPrev}">◀</button>
          <span class="tgtc-x-ca-cur">${ctx.idx + 1}/${cas.length}</span>
          <button class="tgtc-x-ca-next" title="${T.caNext}">▶</button>
        </span>` : ""}
        <button class="tgtc-x-close" title="${T.close}">×</button>
      </div>
      ${symWarn}
      <div class="tgtc-x-price-row">
        <span class="tgtc-x-price">${fmt(d.price)}</span>
        <span class="tgtc-x-chg ${chg1hCls}">1h ${chg1hTxt}</span>
        <span class="tgtc-x-chg ${chgCls}">24h ${chgTxt}</span>
      </div>
      <div class="tgtc-x-sec">${T.secCore}</div>
      <div class="tgtc-x-grid">
        <div><span>${T.mcap}</span><b>${fmt(d.mcap)}</b></div>
        <div><span>${T.liq}</span><b>${fmt(d.liquidity)}</b></div>
        <div><span>${T.lpBurned}</span><b>${pct(d.lp_burned_ratio)}</b></div>
        <div><span>${T.tax}</span><b>${pct(d.buy_tax)} / ${pct(d.sell_tax)}</b></div>
        <div><span>${T.honeypotLabel}</span><b>${hpTxt}</b></div>
        <div><span>${T.mintLabel}</span><b>${mintTxt}</b></div>
      </div>
      <div class="tgtc-x-actions">
        <button class="tgtc-x-copy">${T.copyCa}</button>
        <a href="https://bscscan.com/token/${d.ca || cas[ctx.idx]}" target="_blank" rel="noopener">BscScan</a>
        <a href="https://dexscreener.com/bsc/${d.ca || cas[ctx.idx]}" target="_blank" rel="noopener">DexScreener</a>
        <button class="tgtc-x-toggle">${T.expand}</button>
      </div>
      <div class="tgtc-x-detail">
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
      ${officialHtml}
      <div class="tgtc-x-sec">${T.secSafety}</div>
      <div class="tgtc-x-risk">
        ${s.risks.length
          ? s.risks.map((r) => `<span class="tgtc-x-tag ${s.tier}">${r}</span>`).join("")
          : `<span class="tgtc-x-tag ok">${T.okNone}</span>`}
        ${okTags.map((t) => `<span class="tgtc-x-tag ok">${t}</span>`).join("")}
      </div>
      <div class="tgtc-x-foot">
        ${cas.length > 1 ? `<span class="tgtc-x-more">${T.moreCa.replace("{n}", cas.length)}</span>` : ""}
        <a href="https://bscscan.com/token/${d.ca || cas[ctx.idx]}" target="_blank" rel="noopener">${T.bscscan}</a>
        <a href="${CHANGELOG_URL}" target="_blank" rel="noopener">${T.tgtc}</a>
      </div>
      </div>`;
    card.querySelector(".tgtc-x-close").addEventListener("click", closeCard);
    const prev = card.querySelector(".tgtc-x-ca-prev");
    const next = card.querySelector(".tgtc-x-ca-next");
    if (prev && next) {
      prev.addEventListener("click", (e) => { e.stopPropagation(); ctx.onSwitch(Math.max(0, ctx.idx - 1)); });
      next.addEventListener("click", (e) => { e.stopPropagation(); ctx.onSwitch(Math.min(cas.length - 1, ctx.idx + 1)); });
    }
    const copyBtn = card.querySelector(".tgtc-x-copy");
    if (copyBtn) copyBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await copyText(d.ca || cas[ctx.idx]);
      copyBtn.textContent = T.copied;
      setTimeout(() => { copyBtn.textContent = T.copyCa; }, 1600);
    });
    const toggle = card.querySelector(".tgtc-x-toggle");
    const detail = card.querySelector(".tgtc-x-detail");
    if (toggle && detail) toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const hidden = detail.classList.toggle("tgtc-x-hidden");
      toggle.textContent = hidden ? T.expand : T.collapse;
    });
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
