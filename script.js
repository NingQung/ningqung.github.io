//2023/04/12 還沒整理

const main = document.querySelector("main");
const nav = document.querySelector("nav");
const nav_li = document.querySelectorAll("nav ol li");
const nav_nav = document.getElementById("nav_nav");
const mainSec = document.querySelectorAll("main section");
const transition_duration = 600;
var canscroll = true;
var mainPos=0;

//#region initialize
nav_display("home");
ms_display(0);
navtext_display(0);
//#endregion

window.addEventListener('wheel',e =>{
  if(canscroll && e.deltaY !== 0){
    canscroll = false;
    
    if(e.deltaY > 0){//down
      if(mainPos < mainSec.length - 1){
        mainPos++;
      }
    }else{//up
      if(mainPos>0){
        mainPos--;
      }
      
    }
    nav_display(mainSec[Math.min(mainPos, nav_li.length - 1)].id);
    ms_display(mainPos);
    navtext_display(Math.min(mainPos, nav_li.length - 1));
    setTimeout(()=>{
      canscroll = true;
    },transition_duration);
  }
});
nav_li.forEach(function(e,index){
  e.addEventListener('click',()=>{
    nav_display(e.id);
    mainPos = index;
    ms_display(mainPos);
    navtext_display(index);
  })
});
function nav_display(e){
  nav_nav.className = `in_${e}`;
}
function ms_display(e){
  switch(e){
    case 0:
      main.className = "in_home";
      break;
    case 1:
      main.className = "in_profile";
      break;
    case 2:
      main.className = "in_project";
      break;
    case 3:
      main.className = "in_dayLog";
      break;
    case 4:
      main.className = "in_contact";
      break;
    case 5:
      main.className = "in_bottom";
      break;
  }
}
function navtext_display(e){
  for(var i=0;i<nav_li.length;i++){
    if(i == e){
      nav_li[i].className = "nav_active";
    }else{
      nav_li[i].className = "";
    }
  }
}


