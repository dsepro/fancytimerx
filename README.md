# fancytimerx

考試資訊板 + 倒數計時器，外殼是半透明玻璃，底下是一層慢慢流動的色底。
An examination information board with a countdown timer, a liquid-glass shell
and a slow mesh-gradient backdrop.

## 功能 / Features

- **倒數計時以真實時鐘為基準**：以截止時間（wall clock deadline）計算剩餘秒數，
  不是每秒減一。切到背景分頁、鎖機、休眠回來都不會累積誤差。
  The countdown is derived from a wall-clock deadline, so background tabs,
  sleep and throttling never add drift.
- **考試資訊卡片**：考場、編號、科目、試卷、時長、開始／結束時間、應考語言。
  可獨立調節文字大小（100–150%），方便投影時學生看得清。
- **玻璃外殼**：卡片、頁首與按鈕是磨砂玻璃面；計時中的大字和考試資訊文字
  都放在接近不透明的內層，對比度不依賴背景。可在「考試設定 → 介面效果」
  切換成實色。
- **日夜像素開關**：頁尾的小農莊，點一下或左右拖曳即切換日夜（同時切換全站主題）。
  倒數進行中場景會停住，節省電力。
- **鍵盤快捷鍵**：按 `H` 收起／叫回頂部工具列。

## 開發 / Development

```bash
pnpm install
pnpm dev        # http://localhost:9002
pnpm build
```

> 注意：PWA service worker 在開發模式也會註冊，改版後看不到新內容時請用無痕視窗
> 或先 unregister service worker。
> The PWA service worker is registered in dev mode too; use a private window or
> unregister it if you do not see changes.

## 部署 / Deploy

Next.js 15 應用，Netlify 直接連接此 repo 即可（build command `pnpm build`，
publish directory `.next`，用官方的 Next.js runtime plugin）。

## Credits

- 日夜開關改編自 [toggle-daylight](https://ludion.ai/p/toggle-daylight) by
  @Lattice_Node，MIT License。原始碼已 vendored 到
  `src/lib/daylight-world.ts`，只改了掛載方式（不再自動 mount，改為回傳
  `{ destroy, setPaused, setNight, refreshPalette }` 的 handle）。
