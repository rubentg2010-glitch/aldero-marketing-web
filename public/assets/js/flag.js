(function(){var d=document.documentElement;d.className=d.className.replace("no-js","js");
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var seen=false;try{seen=sessionStorage.getItem("aldero-intro")==="1";}catch(e){}
if(reduce||seen){d.classList.add("no-intro");}else{d.classList.add("intro-on");
setTimeout(function(){if(!d.classList.contains("intro-run"))d.classList.add("intro-done");},2200);}
if(!reduce){d.classList.add("anim");setTimeout(function(){if(!d.classList.contains("anim-ok"))d.classList.add("anim-fallback");},3200);}})();
