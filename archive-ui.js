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

// One timer services independent cell schedules. Pause while the tab is hidden or reduced motion is enabled.
(() => {
  const field = document.querySelector('.signal-field');
  const track = field.closest('main');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cells = [...field.querySelectorAll('.signal-grid i')].map(el => ({ el, due: 0 }));
  const random = (min, max) => min + Math.random() * (max - min);
  let timer, running = false;
  function tick() {
    const now = performance.now();
    for (const cell of cells) {
      if (now < cell.due) continue;
      const lit = cell.el.classList.toggle('is-lit');
      cell.due = now + (lit ? random(180, 420) : random(2200, 12000));
    }
    timer = setTimeout(tick, Math.ceil(Math.min(...cells.map(c => c.due)) - now));
  }
  function sync() {
    const enabled = track.classList.contains('in_home') && !document.hidden && !motion.matches;
    if (enabled === running) return;
    running = enabled;
    clearTimeout(timer);
    const now = performance.now();
    for (const c of cells) {
      c.el.classList.remove('is-lit');
      c.due = now + random(2200, 12000);
    }
    if (enabled) tick();
  }
  new MutationObserver(sync).observe(track, { attributes:true, attributeFilter:['class'] });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  sync();
})();

// Wait for the actual track transition, not a guessed timeout/delay.
// A generation token discards arrivals interrupted by another navigation.
(() => {
  const track = document.querySelector('main');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...track.querySelectorAll(':scope > section')].map(section => ({
    state: `in_${section.id}`,
    content: section.querySelector(':scope > .signature-lockup, :scope > .inner, :scope > footer')
  }));
  let previousState = track.className, generation = 0;
  function clear() {
    targets.forEach(({content}) => content?.classList.remove('arrival-pending', 'arrival-playing'));
  }
  function onNavigation() {
    if (track.className === previousState) return;
    previousState = track.className;
    const ticket = ++generation;
    clear();
    const target = targets.find(({state}) => track.classList.contains(state))?.content;
    if (!target || motion.matches) return;
    target.classList.add('arrival-pending');
    requestAnimationFrame(async () => {
      // getAnimations flushes styles and includes an interrupted/replaced top transition.
      const transitions = track.getAnimations().filter(animation => animation.transitionProperty === 'top');
      await Promise.allSettled(transitions.map(animation => animation.finished));
      if (ticket !== generation || motion.matches) return;
      target.classList.replace('arrival-pending', 'arrival-playing');
    });
  }
  new MutationObserver(onNavigation).observe(track, {attributes:true, attributeFilter:['class']});
  motion.addEventListener('change', () => { ++generation; clear(); });
  targets.forEach(({content}) => content?.addEventListener('animationend', event => {
    if (event.target === content && event.animationName === 'section-arrival-slide') {
      content.classList.remove('arrival-playing');
    }
  }));
})();
