# 計畫區維護

## 檔案分工

- `projects-data.js`：作品資料與排列順序。
- `projects.js`：元素建立、箭頭切換、獨立頁內容，以 `//#region` 分段。
- `style/secProject.css`：計畫卡片、圖片、示意圖、左右箭頭與響應式設定。
- `style/project-detail.css`：作品獨立頁排版。

## 新增或修改作品

1. 在 `projects-data.js` 的 `project_data` 陣列複製一筆資料。
2. 修改 `slug`、標題、分類、簡介與內文；調整陣列順序即可調整卡片順序。
3. 有圖片時填 `image: "/assets/example.webp"` 與 `alt`；留空會使用 `schema` 指定的 CSS 示意圖。
4. 複製 `p04-coming-soon/index.html` 到新的資料夾，例如 `p05-example/index.html`。
5. 將新檔的 `data-project-slug` 改成 `p05-example`，必須與資料的 `slug` 一致。

獨立頁與列表共用資料；新增資料不會自動在伺服器建立 HTML 檔，步驟 4、5 仍需完成。

## 自訂外觀

`secProject.css` 開頭集中設定張數、間距、時間、圖片高度與裁切、玻璃顏色、模糊程度、文字框位移等。桌面預設三張，1000px 以下兩張，760px 以下一張，斷點位於檔案底部。

要單獨修改一張卡片，可直接用穩定的 slug：

```css
.project-card[data-project-slug="p01-sos"]{
  --project-image-position: 50% 30%;
  --project-card-glass: #182740bd;
}
```

也可以在作品資料加上 `className: "project-featured"`，再寫 `.project-featured{ ... }`。卡片提供 `.project-category`、`.project-title`、`.project-summary`、`.project-link`，方便分別設計。

若要改卡片結構，修改 `project_card_create()`；圖片結構位於 `project_visual_create()`。內容以 `textContent` 放入，文字欄位不會當成 HTML 執行。
