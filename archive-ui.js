const pages = Array.from(document.querySelectorAll('nav li'));
function go(index) { pages[index].click(); }
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => go(Number(button.dataset.go))));
pages.forEach((item, i) => {
  item.tabIndex = 0; item.setAttribute('role','button');
  item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); } });
});
const details = [
  ['SOS 柱場景','一張以學生服少女與緊急求救柱為中心的 Blender 情境圖。求救柱獨立建模，再連結至主場景；面板貼圖以 Krita 繪製。'],
  ['光譜渲染','從資訊工程專題出發，探索光的波長如何影響渲染結果。這裡將整理研究過程與圖像。'],
  ['ningTab','為日常使用設計的自訂新分頁，探索書籤、工作表與配色如何共存。']
];
const dialog = document.querySelector('#record');
document.querySelectorAll('[data-entry]').forEach(button => button.addEventListener('click', () => {
 const n=Number(button.dataset.entry);
 dialog.querySelector('.kicker').textContent='PROJECT RECORD / 00'+(n+1);
 dialog.querySelector('h3').textContent=details[n][0];dialog.querySelector('.record-body').textContent=details[n][1]; dialog.showModal();
}));
dialog.querySelector('.close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('wheel',e=>e.stopPropagation());
