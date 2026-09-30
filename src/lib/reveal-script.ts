/**
 * Scroll reveal, as an inline script instead of a React component: a single
 * IntersectionObserver marks every `[data-reveal]` element with `data-revealed` when it enters
 * the viewport (the animation itself is CSS, globals.css). Running at DOMContentLoaded — not
 * after the JS bundle hydrates — keeps content in the first screen from waiting ~1s+ on slow
 * phones (it was delaying LCP). A MutationObserver catches content rendered later (client
 * navigations, lazy sections).
 */
export const REVEAL_SCRIPT = `(function(){
function start(){
  var reveal=function(el){el.setAttribute("data-revealed","")};
  if(!("IntersectionObserver" in window)){document.querySelectorAll("[data-reveal]").forEach(reveal);return}
  var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}})},{rootMargin:"0px 0px -12% 0px",threshold:0.01});
  var observeAll=function(){document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach(function(el){io.observe(el)})};
  observeAll();
  new MutationObserver(observeAll).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();`;
