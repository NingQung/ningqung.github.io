// 計畫資料來源：新增作品時加入一筆，並建立同名路徑下的 index.html。
// image 可填圖片 URL；未填時使用既有 CSS 示意圖。
const projects = [
  {slug:'p01-sos', title:'SOS 柱場景', category:'SCENE', schema:'pillar', image:'', alt:'求救柱示意圖', summary:'Blender 人物情境圖，從一座緊急求救柱開始。', body:'一張以學生服少女與緊急求救柱為中心的 Blender 情境圖。求救柱獨立建模，再連結至主場景；面板貼圖以 Krita 繪製。'},
  {slug:'p02-spectral-rendering', title:'光譜渲染', category:'RENDERING', schema:'spectrum', image:'', alt:'光譜示意圖', summary:'從波長到畫面，整理光譜渲染的研究。', body:'從資訊工程專題出發，探索光的波長如何影響渲染結果。這裡將整理研究過程與圖像。'},
  {slug:'p03-ningtab', title:'ningTab', category:'INTERFACE', schema:'tabs', image:'', alt:'新分頁介面示意圖', summary:'自訂新分頁：書籤、工作表與色彩主題。', body:'為日常使用設計的自訂新分頁，探索書籤、工作表與配色如何共存。'},
  {slug:'p04-coming-soon', title:'待新增計畫', category:'PLACEHOLDER', schema:'tabs', image:'', alt:'計畫佔位示意圖', summary:'第四張佔位，之後替換為新的作品。', body:'這是第四個計畫的佔位頁，作品內容待補。'}
];
function projectElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
function projectVisual(project, index) {
  if (project.image) {
    const image = projectElement('img', 'project-image');
    image.src = project.image; image.alt = project.alt; image.loading = 'lazy';
    return image;
  }
  const visual = projectElement('div', `schema ${project.schema}`);
  visual.setAttribute('role', 'img'); visual.setAttribute('aria-label', project.alt);
  visual.append(projectElement('i'), projectElement('b'), projectElement('small', '', `FIG. ${String(index + 1).padStart(2,'0')}`));
  return visual;
}
const records = document.querySelector('#project-records');
if (records) {
  const cards = projects.map((project, index) => {
    const card = projectElement('article');
    const glass = projectElement('div', 'glass-card');
    const link = projectElement('a', 'project-link', '查看檔案 ↗');
    link.href = `/${project.slug}/`;
    link.setAttribute('aria-label', `查看${project.title}`);
    glass.append(projectElement('p', '', `№ ${String(index + 1).padStart(3,'0')} ${project.category}`), projectElement('h3', '', project.title), projectElement('div', '', project.summary), link);
    card.append(projectVisual(project, index), glass);
    return card;
  });
  records.append(...cards);
  const previous = document.querySelector('#project-prev');
  const next = document.querySelector('#project-next');
  const range = document.querySelector('#project-range');
  let start = 0;
  function render() {
    const visible = Number(getComputedStyle(records).getPropertyValue('--project-visible')) || 3;
    start = Math.max(0, Math.min(start, cards.length - visible));
    const step = cards.length ? cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(records).columnGap) : 0;
    records.style.transform = `translateX(${-start * step}px)`;
    cards.forEach((card, index) => { card.inert = index < start || index >= start + visible; });
    previous.disabled = start === 0;
    next.disabled = start + visible >= cards.length;
    range.textContent = `${cards.length ? start + 1 : 0}–${Math.min(start + visible, cards.length)} / ${cards.length}`;
  }
  previous.addEventListener('click', () => { start--; render(); });
  next.addEventListener('click', () => { start++; render(); });
  new ResizeObserver(render).observe(records.parentElement);
  render();
}
const detail = document.querySelector('[data-project-slug]');
if (detail) {
  const index = projects.findIndex(project => project.slug === detail.dataset.projectSlug);
  const project = projects[index];
  if (project) {
    document.title = `${project.title} | Ningweb`;
    detail.append(projectElement('p', 'kicker', project.category), projectElement('h1', '', project.title), projectVisual(project, index), projectElement('p', 'project-description', project.body));
  }
}
