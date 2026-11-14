//#region elements and state
const project_records = document.getElementById("project-records");
const project_prev = document.getElementById("project-prev");
const project_next = document.getElementById("project-next");
const project_range = document.getElementById("project-range");
const project_detail = document.querySelector("[data-project-slug]");
const project_cards = [];

let project_start = 0;
//#endregion

//#region initialize
if(project_records){
  project_data.forEach(function(project,index){
    const card = project_card_create(project,index);
    project_cards.push(card);
    project_records.append(card);
  });

  project_prev.addEventListener("click",()=>{
    project_move(-1);
  });
  project_next.addEventListener("click",()=>{
    project_move(1);
  });

  // 視窗寬度改變時，重新讀取 CSS 的顯示張數與間距。
  const project_resize = new ResizeObserver(project_display);
  project_resize.observe(project_records.parentElement);
  project_display();
}

if(project_detail){
  project_detail_display();
}
//#endregion

//#region create elements
function project_element_create(tag,className,text){
  const element = document.createElement(tag);

  if(className){
    element.className = className;
  }
  if(text !== undefined){
    element.textContent = text;
  }

  return element;
}

// 卡片的 HTML 結構在這裡修改；文字內容放在 projects-data.js。
function project_card_create(project,index){
  const card = project_element_create("article","project-card");
  const visual = project_visual_create(project,index);
  const glass = project_element_create("div","glass-card");
  const number = String(index + 1).padStart(3,"0");
  const category = project_element_create("p","project-category",`№ ${number} ${project.category}`);
  const title = project_element_create("h3","project-title",project.title);
  const summary = project_element_create("div","project-summary",project.summary);
  const link = project_element_create("a","project-link","查看檔案 ↗");

  card.dataset.projectSlug = project.slug;
  if(project.className){
    card.className += ` ${project.className}`;
  }

  link.href = `/${project.slug}/`;
  link.setAttribute("aria-label",`查看${project.title}`);

  glass.append(category,title,summary,link);
  card.append(visual,glass);

  return card;
}

function project_visual_create(project,index){
  if(project.image){
    const image = project_element_create("img","project-image");
    image.src = project.image;
    image.alt = project.alt;
    image.loading = "lazy";

    return image;
  }

  // 未指定圖片時，以既有的 CSS 圖形佔位。
  const visual = project_element_create("div",`schema ${project.schema}`);
  const shape_primary = project_element_create("i");
  const shape_secondary = project_element_create("b");
  const number = String(index + 1).padStart(2,"0");
  const caption = project_element_create("small","",`FIG. ${number}`);

  visual.setAttribute("role","img");
  visual.setAttribute("aria-label",project.alt);
  visual.append(shape_primary,shape_secondary,caption);

  return visual;
}
//#endregion

//#region carousel
function project_move(direction){
  project_start += direction;
  project_display();
}

function project_display(){
  const style = getComputedStyle(project_records);
  const count = project_cards.length;
  // JS 與 CSS 共用張數設定，避免斷點變動後兩邊不同步。
  const visible = Math.max(1,Math.floor(Number(style.getPropertyValue("--project-visible")) || 3));
  const gap = parseFloat(style.columnGap) || 0;
  const width = count > 0 ? project_cards[0].getBoundingClientRect().width : 0;
  const last_start = Math.max(0,count - visible);

  project_start = Math.max(0,Math.min(project_start,last_start));
  project_records.style.transform = `translateX(${-project_start * (width + gap)}px)`;

  project_cards.forEach(function(card,index){
    // 隱藏在視窗外的卡片不可被 Tab 選取。
    card.inert = index < project_start || index >= project_start + visible;
  });

  project_prev.disabled = project_start === 0;
  project_next.disabled = project_start >= last_start;

  const first = count > 0 ? project_start + 1 : 0;
  const last = Math.min(project_start + visible,count);
  project_range.textContent = `${first}–${last} / ${count}`;
}
//#endregion

//#region detail page
function project_detail_display(){
  const slug = project_detail.dataset.projectSlug;
  const index = project_data.findIndex(project => project.slug === slug);

  if(index === -1){
    return;
  }

  const project = project_data[index];
  const category = project_element_create("p","kicker",project.category);
  const title = project_element_create("h1","",project.title);
  const visual = project_visual_create(project,index);
  const body = project_element_create("p","project-description",project.body);

  document.title = `${project.title} | Ningweb`;
  project_detail.append(category,title,visual,body);
}
//#endregion
