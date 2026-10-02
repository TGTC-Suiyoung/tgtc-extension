# 📝 Changelog

Update history for **TGTC — BSC Token Lookup**. All versions below are loaded in
`chrome://extensions` → **Load unpacked** (Developer mode).

---

## UI polish — 2026-10-03
- Badge colors (green/orange), symbols & spacing, card width & font tuning, metric-row spacing,
  footer dedup & action-row reshuffle, sentiment card layout and title rename
  (covers v1.5.4, v1.6.3–v1.6.5, v1.6.7–v1.6.13, v1.6.16, v1.6.18–v1.6.19).

## v1.6.17 — 2026-10-03 · Sentiment title links to official site
- The top label is now a blue hyperlink: index.zh.html for zh browsers, index.html otherwise.

## v1.6.15 — 2026-10-03 · Original tweet links
- Each top tweet shows clean text plus a "View original" link to the X post (auto-hidden if unavailable).

## v1.6.14 — 2026-10-03 · Tweet cleanup
- Sentiment tweet rendering strips the CA (0x…40 hex) and trailing URLs (incl. broken fragments).

## v1.6.6 — 2026-10-03 · URL-safe truncation
- Tweet truncation never cuts a URL — partial URL tails are dropped.

## v1.6.2 — 2026-10-03 · Sentiment error classification
- 401→add key, 404→not a token, 429→out of credits, others→analysis failed.

## v1.6.1 — 2026-10-03 · Pure tweet analysis
- Search X mentions by CA → top 10 by views → AI analysis (heat rating / summary / key signals).
  Billed 10 credits; 10-min cache hits are free.

## v1.6.0 — 2026-10-03 · CA Sentiment Scan (new)
- New "🧵 Sentiment" button next to the badge: one click builds an X sentiment card for the CA
  (AI summary + top-view tweets), billed separately.

## v1.5.3 — 2026-10-03 · Check CA + official-account deep profile

- **Badge text** changed to **⚡ Check CA** (Chinese: ⚡ 查CA) — clearer than a bare ⚡.
- **Official-account deep profile** on the card (details view): the token's linked
  Twitter account shows history that is **not visible on its profile page** —
  `Username renames` (count from the rename-history list), `Deleted tweets`, and
  `Tokens created`. Shown only when non-zero. Same data source as the TGTC Bot card.

## v1.5.2 — 2026-10-02 · Popup card-based redesign

- Popup rebuilt from plain text into **card panels**: gradient brand header, Key panel,
  side-by-side **daily stats cards** (scanned / flagged, red for danger), usage steps
  with highlighted numbers, bottom links separated by a divider.

## v1.5.1 — 2026-10-01 · Badge pill button

- The ⚡ dot badge became a **pill button** ("⚡ Check CA" / "⚡ 查CA") — more visible
  on tweets while staying unobtrusive; hover scale 1.1.

## v1.5.0 — 2026-09-30 · Four-state safety / multi-CA / copycat warning / quick card / popup stats

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

## v1.4.x — 2026-09-29 · i18n + icons

- Auto language (Chinese UI for `zh` browsers, English otherwise); extension icons
  (16/48/128); site links follow the browser language.

---

# 中文更新记录

**TGTC — BSC Token Lookup** 的历史版本。本地加载方式：
`chrome://extensions` → 开发者模式 → 加载已解压的扩展程序。

## 优化UI界面（2026-10-03）
- 徽章配色绿橙、符号与间距调整、卡片宽度与字号打磨、指标行间距收紧、底部去重与操作行重排、
  舆情卡排版优化与标题改名（覆盖 v1.5.4、v1.6.3–v1.6.5、v1.6.7–v1.6.13、v1.6.16、v1.6.18–v1.6.19）

## v1.6.17（2026-10-03）· 舆情分析标题挂官网链接
- 「TGTC舆情分析（基于X平台已有推文分析，DYOR）」变为蓝色超链接：中文环境跳 index.zh.html、英文跳 index.html。

## v1.6.15（2026-10-03）· 高阅读推文挂原文链接
- 每条高阅读推文正文去 CA、去链接，底部新增「查看原文」链接（跳转 X 原文页，无链接自动隐藏）。

## v1.6.14（2026-10-03）· 推文净化
- 舆情卡推文渲染去掉 CA（0x+40位）与尾部链接（含残缺残段），只显示文字内容。

## v1.6.6（2026-10-03）· 网址截断保护
- 推文文本截断时若切进 URL 则去掉残缺尾巴——文字可截断、网址不截断。

## v1.6.2（2026-10-03）· 舆情错误提示分类
- 舆情失败按状态分类提示：401→填 Key、404→非代币或查询失败、429→次数不足、其他→分析失败。

## v1.6.1（2026-10-03）· 舆情改纯推文版
- 按 CA 搜索 X 推文 → 阅读量 top10 → AI 分析（热度评级/摘要/关键信号）；独立计费 10 次，10 分钟缓存命中不扣次。

## v1.6.0（2026-10-03）· CA 舆情速览（新功能）
- 徽章旁新增「🧵 CA舆情」按钮：一键生成该 CA 的 X 平台舆情速览卡（AI 汇总 + 高阅读推文），独立计费。

## v1.5.3（2026-10-03）· 查CA + 官方号深层画像

- 徽章文字改为 **⚡ 查CA**（英文 ⚡ Check CA）——比光秃秃的 ⚡ 明确得多。
- 卡片详情新增 **官方号画像**：代币关联的官方推特展示**页面上看不到的历史痕迹**——
  改名次数（改名历史列表长度）/ 删帖数 / 发币数，有痕迹才显示。与 TGTC Bot 卡片同数据源。

## v1.5.2（2026-10-02）· 弹窗卡片化改版

- 弹窗从纯文字堆叠重建成**卡片分区**：渐变品牌标题、Key 面板、并排**今日统计卡**
  （扫描数 / 命中危险，危险红显）、步骤序号高亮、底部链接分隔线。

## v1.5.1（2026-10-01）· 徽章胶囊按钮

- ⚡ 圆点徽章改成**胶囊按钮**（「⚡ 查CA」）——推文上更明显但不抢眼，hover 放大 1.1。

## v1.5.0（2026-09-30）· 四态评级 / 多 CA 切换 / 同名防错 / 轻卡视图 / 弹窗转化点

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

## v1.4.x（2026-09-29）· 中英双语 + 图标

- 界面自动跟随浏览器语言（中文环境中文、其他英文）；新增扩展图标（16/48/128）；
  站点链接按语言自动切换（中文/英文页）。
