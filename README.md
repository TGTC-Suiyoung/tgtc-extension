<p align="center">
  <img src="apple-touch-icon.png" width="96" alt="TGTC">
</p>

# ⚡ TGTC — BSC Token Lookup

**One-click on-chain evaluation for BSC tokens, right in your X (Twitter) feed.**

Scan tweets for BSC contract addresses (CA), drop a **⚡ badge** on each match, and open a full
on-chain assessment card with a single click — no page switches, no copy-paste.

[中文说明 ↓](#中文说明)

---

## ✨ Features

- **Auto-detects BSC addresses** in tweets (`0x` + 40 hex chars)
- **⚡ badge** on matching tweets (click to open the card)
- **Full assessment card** in one screen:
  - Price + **1h / 24h change** · **launchpad progress** (presale % / live)
  - Market: market cap · liquidity · 24h volume · holders · age · buy:sell ratio · distance from ATH · swaps · 1h volume · supply
  - On-chain: smart money · snipers · bundlers · top-10 · taxes · dev holdings · phishing · bots · whales · vault
  - **Smart-money & KOL moves**: wallets in / out + **net buy volume**
  - Safety rating with itemized risk tags (honeypot / mint not renounced / LP burn / tax / blacklist — plus verified / open-source / CTO)
- **Key saved once**, change anytime in the popup
- Dark theme, matches X's look

## 📸 Screenshots

![⚡ badge on a tweet](screenshots/badge.png)

![Assessment card](screenshots/card.png)

## 🚀 Install (load unpacked)

1. Download / clone this repo, or download the ZIP and extract.
2. Open `chrome://extensions` in Chrome.
3. Toggle **Developer mode** (top-right).
4. Click **Load unpacked** → select the folder containing `manifest.json`.
5. Pin the extension from the puzzle icon.

## 🧭 Usage

1. Click the TGTC icon in the toolbar → paste your **API Key** (saved automatically).
2. Get a key: DM [@TG_TC_BOT](https://t.me/TG_TC_BOT) on Telegram → "我的 API" → it's the same
   key you use for the [TGTC Data API](https://www.tgtcbot.com/doc.zh.html). New users get
   **500 free credits** on signup.
3. Browse X — tweets with a BSC contract show a **⚡** in the corner.
4. Click it → the assessment card pops up right there.

## 🔌 How it works

The extension is a thin client: it sends the contract address to the
[TGTC aggregation API](https://www.tgtcbot.com/doc.zh.html) (`POST /api/v1/aggregation/token`)
with your key and renders the returned on-chain data. All data is aggregated and served by
**tgtcbot.com** — the extension itself stores no data, only your key (in `chrome.storage.local`).

Each assessment consumes credits from your TGTC balance (one aggregate call = 4 credits,
cache hits are free). See [pricing](https://www.tgtcbot.com/pricing.zh.html) for details.

## 🗂 Structure

| File | Role |
|---|---|
| `manifest.json` | MV3 manifest (storage + host permissions for tgtcbot.com) |
| `background.js` | Service worker — the only place cross-origin fetches happen (MV3 CORS) |
| `content-x.js` | X page script: CA detection, ⚡ badge, assessment card |
| `content-x.css` | Badge + card styles |
| `popup.html` / `popup.js` | API Key settings popup |

## 📝 Changelog

### v1.5.0 — 2026-10-03 · Four-state safety / multi-CA / copycat warning / quick card / popup stats

- **⚪ Unknown state (never default green).** Decision logic: count how many of the 4 key
  safety fields are present — `honeypot`, `mint_renounced`/`renounced`, `lp_burned_ratio`,
  `buy_tax`/`sell_tax`. If fewer than **2 are known**, the badge shows grey **◇ Unknown**
  instead of any pass verdict — **no data ≠ safe**. Once ≥2 are known, normal rating applies:
  `honeypot=true` → **✗ Honeypot** (red); no risks → **✓ Pass** (green); otherwise **⚠ Caution**
  (amber) with itemized risk tags (blacklist / mint not renounced / LP burned <90% / tax ≥10%).
- **🔀 Multi-CA switch.** A tweet with several contract addresses gets **◀ n/N ▶**
  navigation in the card header to evaluate each one. The same CA within the 10s API cache
  window is **not re-billed**.
- **⚠️ Cashtag mismatch warning.** Logic: extract `$TICKER` tags from the tweet body
  (`$` + 1–12 alphanumerics, `USD` excluded); compare against the on-chain `symbol` from the
  API. If they differ, a yellow banner shows: *"Tweet's $FLAP doesn't match on-chain symbol
  (XXX) — watch for copycats."* BSC has heavy copycat forks, so this is a manual-verify prompt.
- **🃏 Quick card default view.** Clicking ⚡ shows **price + 6 core safety fields**
  (market cap / liquidity / LP burned / buy-sell tax / honeypot / mint) plus an action row —
  **Copy CA · BscScan · DexScreener · Details**. Expanding reveals all fields
  (market 10, on-chain 10, smart-money/KOL moves, full safety tags).
- **📊 Popup stats.** The popup shows today's **scans** and **flagged** counts (local
  `chrome.storage`, resets daily, no account data collected) plus a **Dashboard** link
  back to tgtcbot.com.

### v1.4.0 — 2026-10-02 · i18n + icons

- Auto language (Chinese UI for `zh` browsers, English otherwise); extension icons
  (16/48/128); site links follow the browser language.

---

## ⚠️ Disclaimer

This extension displays aggregated on-chain data only. It is **not** financial advice. Crypto
assets are highly volatile — evaluate risks yourself.

## 📄 License

MIT — see [LICENSE](LICENSE). This is the official client of the TGTC service; data is
provided by tgtcbot.com.

---

## 中文说明

**TGTC — BSC Token Lookup** 是一个浏览器扩展：打开 X（Twitter）刷推文，带 BSC 合约地址的推文
右上角会出现 ⚡ 徽章，点击即可原地弹出全维度链上评估卡片——无需离开页面。

### 安装

1. 下载本仓库（或 ZIP 解压）
2. Chrome 打开 `chrome://extensions` → 右上角开启**开发者模式**
3. 点**加载已解压的扩展程序** → 选择含 `manifest.json` 的文件夹
4. 工具栏拼图图标里固定 TGTC

### 使用

1. 点工具栏 TGTC 图标 → 粘贴 **API Key**（自动保存）
2. 获取 Key：Telegram 私聊 [@TG_TC_BOT](https://t.me/TG_TC_BOT) →「我的 API」；新用户注册赠送 **500 次**
3. 刷 X —— 带 BSC 合约的推文出现 ⚡
4. 点 ⚡ → 评估卡片弹出（价格/涨跌、发射台进度、行情、链上筹码、聪明钱/KOL 动向、安全评级）

### 数据与计费

扩展是轻客户端：把合约地址 + 你的 Key 发给 [TGTC 聚合接口](https://www.tgtcbot.com/doc.zh.html)，
渲染返回的链上数据。所有数据由 **tgtcbot.com** 聚合提供，扩展本身不存任何数据（Key 仅存本地）。
每次评估消耗账户次数（聚合查询 4 次/次，缓存命中免费），详见[定价页](https://www.tgtcbot.com/pricing.zh.html)。

### 更新记录

**v1.5.0（2026-10-03）· 四态评级 / 多 CA 切换 / 同名防错 / 轻卡视图 / 弹窗转化点**

- **⚪ 未知态（不默认绿）**：判断逻辑——统计 4 个关键安全字段的已知数量：
  `honeypot`（蜜罐）、`mint_renounced`/`renounced`（Mint 是否放弃）、`lp_burned_ratio`（LP 烧毁比例）、
  `buy_tax`/`sell_tax`（买卖税）。**已知不足 2 项 → 灰色「◇ 未知」**，绝不判定安全——没数据 ≠ 安全。
  已知 ≥2 项后正常评级：`honeypot=true` → ✗ 貔貅（红）；无风险 → ✓ 通过（绿）；否则 ⚠ 留意（黄），
  并逐条列出风险标签（黑名单 / Mint 未放弃 / LP 烧毁 <90% / 税率 ≥10%）。
- **🔀 多 CA 切换**：一条推文带多个合约 → 卡片头部 ◀ n/N ▶ 挨个评估；
  同 CA 在 10 秒 API 缓存窗口内重复查询**不重复扣次**。
- **⚠️ 同名防错**：判断逻辑——从推文正文提取 `$TICKER`（`$` + 1~12 位字母数字，排除 USD），
  与聚合接口返回的链上 `symbol`（大写）比对；不一致 → 顶部黄色警示条
  「推文 $FLAP 与链上 symbol（XXX）不一致——谨防同名仿盘」。BSC 仿盘多，这是人工核对提醒。
- **🃏 轻卡默认视图**：点 ⚡ 默认显示 **价格 + 6 项核心安全**（市值 / 流动性 / LP 烧毁 / 买卖税 / 蜜罐 / Mint 权限）
  + 操作行（**复制 CA · BscScan · DexScreener · 展开详情**）；展开后显示全部字段
  （行情 10 项 / 链上 10 项 / 聪明钱·KOL 动向 / 完整安全标签）。
- **📊 弹窗转化点**：弹窗显示今日**扫描数**与**命中危险数**（本地 `chrome.storage` 计数，
  跨日自动重置，不收集任何账号信息）+「打开看板」入口（引流 tgtcbot.com）。

**v1.4.x（2026-10-02）· 中英双语 + 图标**：界面自动跟随浏览器语言（中文环境中文、其他英文）；
新增扩展图标（16/48/128）；站点链接按语言自动切换（中文/英文页）。

### 免责声明

仅展示聚合链上数据，**不构成投资建议**。加密资产价格波动剧烈，请自行评估风险。
