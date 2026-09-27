const cursor_circle = document.getElementById("cursor_circle");
const cursor_bar = document.querySelectorAll("div.cursorbar");
let isload = 0;

var cancursor=true
window.addEventListener('mousedown' , e =>{
  if(e.button == 1){
    e.preventDefault();
    e.stopPropagation();
    return false;
  }else if(e.button == 0 && cancursor){
    cancursor = false;
    cursor_circle.className = "cursor_active";
    cursor_circle.style.top = e.y+"px";
    cursor_circle.style.left = e.x+"px";
    setTimeout(()=>{
      cursor_circle.className = "";
      cancursor = true;
    },500);
  }
})//
let cursor_p=[{x:0,y:0},{x:0,y:0},{x:0,y:0}];
window.addEventListener("mousemove",e=>{
  cursor_p[0].x=e.pageX;
  cursor_p[0].y=e.pageY;
  if(isload == 0){
    cursor_bar.forEach(e=>{
      e.style.opacity = 1;
    })
    isload = 1;
  }
})
function cursorEff (){
  cursor_bar.forEach(function(e,index){
    e.style.top = cursor_p[index].y +index*15+"px";
    e.style.left =cursor_p[index].x +index*5+"px";
  })
  cursor_p[2].x=(cursor_p[2].x-cursor_p[1].x)*0.3 +cursor_p[1].x;
  cursor_p[2].y=(cursor_p[2].y-cursor_p[1].y)*0.3 +cursor_p[1].y;
  cursor_p[1].x=(cursor_p[1].x-cursor_p[0].x)*0.3 +cursor_p[0].x;
  cursor_p[1].y=(cursor_p[1].y-cursor_p[0].y)*0.3 +cursor_p[0].y;
}
function cursoranimate(){
  cursorEff();
  window.requestAnimationFrame(cursoranimate);
}
cursoranimate();
