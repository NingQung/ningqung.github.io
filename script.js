const sections = [...document.querySelectorAll("main > section")];
const links = [...document.querySelectorAll("nav [data-section]")];

// Native scrolling and CSS snapping also support touch, keyboard and long sections.
let scheduled = false;
function updateNavigation() {
  const line = window.innerHeight * 0.45;
  let active = sections[0].id;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= line) active = section.id;
  }
  if (active === "bottom") active = "contact";
  for (const link of links) {
    if (link.dataset.section === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  scheduled = false;
}
window.addEventListener("scroll", () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();
