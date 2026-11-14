// 計畫內容只改這個檔案；陣列順序就是列表順序。
// slug：獨立頁的資料夾名稱，例如 p01-sos → /p01-sos/
// title / category / summary：卡片標題、分類、簡介。
// body：獨立頁內文。image：圖片網址，建議使用 /assets/xxx.webp。
// alt：圖片替代文字。schema：未放圖片時的 CSS 示意圖（pillar / spectrum / tabs）。
// 選填 className：卡片的自訂 class，可在 secProject.css 加上對應樣式。
// 新作品需複製一個 pXX-xxx/index.html，修改 data-project-slug 與 slug 一致。

//#region project data
const project_data = [
  {
    slug: "p01-sos",
    title: "SOS 柱場景",
    category: "SCENE",
    schema: "pillar",
    image: "",
    alt: "求救柱示意圖",
    summary: "Blender 人物情境圖，從一座緊急求救柱開始。",
    body: "一張以學生服少女與緊急求救柱為中心的 Blender 情境圖。求救柱獨立建模，再連結至主場景；面板貼圖以 Krita 繪製。",
  },
  {
    slug: "p02-spectral-rendering",
    title: "光譜渲染",
    category: "RENDERING",
    schema: "spectrum",
    image: "",
    alt: "光譜示意圖",
    summary: "從波長到畫面，整理光譜渲染的研究。",
    body: "從資訊工程專題出發，探索光的波長如何影響渲染結果。這裡將整理研究過程與圖像。",
  },
  {
    slug: "p03-ningtab",
    title: "ningTab",
    category: "INTERFACE",
    schema: "tabs",
    image: "",
    alt: "新分頁介面示意圖",
    summary: "自訂新分頁：書籤、工作表與色彩主題。",
    body: "為日常使用設計的自訂新分頁，探索書籤、工作表與配色如何共存。",
  },
  {
    slug: "p04-coming-soon",
    title: "待新增計畫",
    category: "PLACEHOLDER",
    schema: "tabs",
    image: "",
    alt: "計畫佔位示意圖",
    summary: "第四張佔位，之後替換為新的作品。",
    body: "這是第四個計畫的佔位頁，作品內容待補。",
  },
];
//#endregion
