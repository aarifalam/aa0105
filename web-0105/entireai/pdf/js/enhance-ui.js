document.addEventListener("DOMContentLoaded",()=>{let t=document.querySelector(".download-section"),e=document.querySelector(".convert-button"),n=()=>{let e=t.getBoundingClientRect(),n=e.top+window.pageYOffset,o=n-window.innerHeight/2+e.height/2;window.scrollTo({top:o,behavior:"smooth"})},o=t.style.display,i=new MutationObserver(e=>{e.forEach(e=>{if("style"===e.attributeName){let i=t.style.display;i!==o&&"none"!==i&&n()}})});i.observe(t,{attributes:!0,attributeFilter:["style"]}),e&&e.addEventListener("click",()=>{});let a=document.createElement("style");a.textContent=`
    .download-section {
      margin: 20px 0;
      padding: 20px 0;
      border-top: 1px solid #eee;
    }
    #download-pdf-button { /* Target your actual download button */
      display: inline-block;
      padding: 12px 24px;
      background: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 10px 0;
    }
    .thumbnail-actions {
      opacity: 1 !important;
      justify-content: space-between;
      width: 100%;
      padding: 4px;
      top: 4px;
      left: 4px;
      right: 4px;
    }
    .thumbnail-btn {
      width: 26px !important;
      height: 26px !important;
      font-size: 14px !important;
      background: rgba(0, 0, 0, 0.6) !important;
    }
    .rotate-btn::after {
      content: "↻";
    }
    .delete-btn::after {
      content: "\xd7";
    }
  `,document.head.appendChild(a)});