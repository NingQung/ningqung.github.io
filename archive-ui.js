const pages = Array.from(document.querySelectorAll('nav li'));
function go(index) { pages[index].click(); }
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => go(Number(button.dataset.go))));
pages.forEach((item, i) => {
  item.tabIndex = 0; item.setAttribute('role','button');
  item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); } });
});
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
  // 每個分頁各自記錄；sessionStorage 讓返回作品列表或重新整理也不重播。
  const storageKey = 'ningweb:visited-sections:v1';
  let visited;
  try { visited = new Set(JSON.parse(sessionStorage.getItem(storageKey) || '[]')); }
  catch { visited = new Set(); }
  const remember = state => {
    visited.add(state);
    try { sessionStorage.setItem(storageKey, JSON.stringify([...visited])); } catch {}
  };
  let previousState = null, generation = 0;
  function clear() {
    targets.forEach(({content}) => content?.classList.remove('arrival-pending', 'arrival-playing'));
  }
  function onNavigation() {
    if (track.className === previousState) return;
    previousState = track.className;
    const ticket = ++generation;
    clear();
    const target = targets.find(({state}) => track.classList.contains(state))?.content;
    if (!target || visited.has(previousState)) return;
    const state = previousState;
    if (motion.matches) { remember(state); return; }
    target.classList.add('arrival-pending');
    requestAnimationFrame(async () => {
      // getAnimations flushes styles and includes an interrupted/replaced top transition.
      const transitions = track.getAnimations().filter(animation => animation.transitionProperty === 'top');
      await Promise.allSettled(transitions.map(animation => animation.finished));
      if (ticket !== generation || motion.matches) return;
      remember(state); // 定位完成、真正開始播放才算進入；快速跳過不會消耗首次動畫。
      target.classList.replace('arrival-pending', 'arrival-playing');
    });
  }
  onNavigation(); // 初次載入的首頁也適用。
  new MutationObserver(onNavigation).observe(track, {attributes:true, attributeFilter:['class']});
  motion.addEventListener('change', () => { ++generation; clear(); });
  targets.forEach(({content}) => content?.addEventListener('animationend', event => {
    if (event.target === content && event.animationName === 'section-arrival-slide') {
      content.classList.remove('arrival-playing');
    }
  }));
})();

// A detail page's back link restores the project section, without changing nav markup.
if (location.hash === '#project') go(2);
