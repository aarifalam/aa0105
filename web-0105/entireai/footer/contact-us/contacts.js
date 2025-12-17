document.addEventListener("DOMContentLoaded",function(){let e=document.querySelectorAll(".contact-card, .social-card, .note-card");e.forEach(e=>{e.addEventListener("mouseenter",()=>e.style.zIndex="10"),e.addEventListener("mouseleave",()=>e.style.zIndex="1")});let t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.style.opacity="1",e.target.style.transform="translateY(0)")})},{threshold:.1,rootMargin:"0px 0px -50px 0px"}),o=document.querySelectorAll(".contact-card, .social-card, .about-section, .notes-section");o.forEach(e=>{e.style.opacity="0",e.style.transform="translateY(20px)",e.style.transition="opacity 0.6s ease, transform 0.6s ease",t.observe(e)});let n=document.querySelectorAll(".contact-btn");n.forEach(e=>{e.addEventListener("click",function(e){let t=document.createElement("span"),o=this.getBoundingClientRect(),n=Math.max(o.width,o.height),l=e.clientX-o.left-n/2,a=e.clientY-o.top-n/2;t.style.width=t.style.height=n+"px",t.style.left=l+"px",t.style.top=a+"px",t.classList.add("ripple"),this.appendChild(t),setTimeout(()=>t.remove(),600)})})}),function(){let e="contacts1.js",t=!1;setInterval(function o(){let n=document.querySelectorAll("script[src]"),l=!1;if(n.forEach(t=>{t.src.includes(e)&&(l=!0)}),!l){var a;a=`Required file "${e}" is missing, deleted, renamed, or blocked.`,t||(t=!0,document.open(),document.write(`
      <html>
      <head><title>SECURITY ALERT</title></head>
      <body style="
        margin:0;
        height:100vh;
        background:black;
        color:red;
        font-family:monospace;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        text-align:center;
      ">
        <h1>⚠ UNAUTHORIZED MODIFICATION ⚠</h1>

        <p style="color:#ff4444; font-size:18px;">
          REASON: ${a}
        </p>

        <p style="color:white; max-width:700px; margin:20px;">
          A required protected JavaScript file has been removed, renamed, or blocked.
        </p>

        <p style="color:#00ff00; font-size:18px;">
          Contact Developer: aarifalam0105@gmail.com
        </p>

        <button onclick="location.href='mailto:aarifalam0105@gmail.com'"
          style="padding:12px 25px; background:#00ff00; color:black; border:none; cursor:pointer;">
          Contact Developer
        </button>

        <p style="color:yellow; margin-top:20px;">
          Redirecting in <span id="cd">10</span> seconds...
        </p>

        <script>
          let t = 10;
          setInterval(() => {
            t--;
            const cd = document.getElementById("cd");
            if (cd) cd.textContent = t;
            if (t <= 0) location.href = "https://aarifalam.life/";
          }, 1000);
        </script>

      </body>
      </html>
    `),document.close())}},1e3)}();