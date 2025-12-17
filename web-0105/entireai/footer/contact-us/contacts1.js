document.addEventListener("DOMContentLoaded",function(){let e=!1;function t(){if(e)return;e=!0,document.body.innerHTML=`
      <div style="
        position:fixed; inset:0;
        background:black; color:red;
        font-family:monospace;
        display:flex; flex-direction:column;
        justify-content:center; align-items:center;
        text-align:center; z-index:999999;
      ">
        <h1>⚠ UNAUTHORIZED MODIFICATION DETECTED ⚠</h1>
        <p style="color:white; max-width:600px;">
          Developer identity has been altered or removed.
        </p>
        <p style="color:#00ff00; font-size:18px;">
          Contact: aarifalam0105@gmail.com
        </p>
        <button onclick="location.href='mailto:aarifalam0105@gmail.com'"
          style="background:#00ff00; color:black; padding:12px 25px; border:none; cursor:pointer;">
          Contact Developer
        </button>
        <p style="color:yellow;">Redirecting in <span id="cd">10</span>...</p>
      </div>
    `;let t=10;setInterval(()=>{t--,document.getElementById("cd").innerText=t,t<=0&&(location.href="https://aarifalam.life/footer/contact-us/contact")},1e3)}function o(){let e=document.querySelector(".webdev-content span"),o=document.querySelector(".webdev-contact a[href^='mailto']");if(!e||!o)return t();let n=e.textContent.trim().toLowerCase(),a=o.getAttribute("href").replace("mailto:","").trim().toLowerCase();("@aarifalam0105"!==n||"aarifalam0105@gmail.com"!==a)&&t()}o(),new MutationObserver(o).observe(document.body,{childList:!0,subtree:!0,characterData:!0})});