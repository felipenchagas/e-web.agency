document.addEventListener("DOMContentLoaded",function(){if(document.querySelectorAll(".elementor-invisible").forEach(function(e){e.classList.remove("elementor-invisible"),e.classList.add("fade-in-up")}),!document.getElementById("fadeInUpStyle")){var e=document.createElement("style");e.id="fadeInUpStyle",e.innerHTML=`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 20%, 0);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }
      .fade-in-up {
        animation: fadeInUp 0.8s ease forwards;
      }
    `,document.head.appendChild(e)}var t=document.querySelector(".elementor-element-7dbf4d5b");if(t){var a=t.getAttribute("data-settings");if(a){a=a.replace(/&quot;/g,'"');try{var i=JSON.parse(a);if(i.background_slideshow_gallery&&i.background_slideshow_gallery.length>0){var n=i.background_slideshow_gallery,o=i.background_slideshow_slide_duration||5e3,l=i.background_slideshow_transition_duration||500,r=document.createElement("div");r.style.position="absolute",r.style.top="0",r.style.left="0",r.style.width="100%",r.style.height="100%",r.style.zIndex="0",r.style.overflow="hidden",t.insertBefore(r,t.firstChild),"static"===window.getComputedStyle(t).position&&(t.style.position="relative"),t.style.zIndex="1";var s=document.createElement("div"),d=document.createElement("div");function y(e,t){e.style.backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('"+t+"')"}[s,d].forEach(function(e){e.style.position="absolute",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.backgroundSize="cover",e.style.backgroundPosition="center",e.style.transition="opacity "+l+"ms ease-in-out",e.style.opacity="0"}),r.appendChild(s),r.appendChild(d);var c=s,$=d,f=0;function p(){y($,n[f].url),$.offsetHeight,$.style.opacity="1",setTimeout(function(){c.style.opacity="0";var e=c;c=$,$=e,f=(f+1)%n.length,setTimeout(p,o)},l)}y(c,n[f].url),c.style.opacity="1",f=(f+1)%n.length,setTimeout(p,o)}}catch(u){console.error("Erro ao fazer parse de data-settings:",u)}}}});
	
