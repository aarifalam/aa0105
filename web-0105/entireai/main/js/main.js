document.addEventListener("DOMContentLoaded",function(){var e,n=document.querySelectorAll(".testimonial"),s=document.querySelectorAll(".slider-dot"),t=0;function i(e){n.length&&s.length&&(n.forEach(function(e){e.classList.remove("active")}),s.forEach(function(e){e.classList.remove("active")}),n[e].classList.add("active"),s[e].classList.add("active"),t=e)}function a(){clearInterval(e),e=setInterval(function(){i((t+1)%n.length)},5e3)}n.length&&s.length&&(s.forEach(function(n,s){n.addEventListener("click",function(){clearInterval(e),i(s),a()})}),i(0),a());var c=document.getElementById("backToTop");c&&(window.addEventListener("scroll",function(){c.classList.toggle("visible",window.scrollY>300)}),c.addEventListener("click",function(e){e.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})})),document.querySelectorAll('a[href^="#"]').forEach(function(e){e.addEventListener("click",function(e){var n=this.getAttribute("href");if("#"!==n){var s=document.querySelector(n);s&&(e.preventDefault(),window.scrollTo({top:s.offsetTop-80,behavior:"smooth"}))}})}),emailjs.init("l6oN9IIN5L4DD_r_y");var l=document.getElementById("emailSignupForm");if(l){var o=l.querySelector(".btn-primary"),r=document.createElement("div");r.className="subscription-message",r.style.display="none",l.appendChild(r),l.addEventListener("submit",function(e){e.preventDefault();var n=l.querySelector('input[type="email"]').value.trim();n&&(o.classList.add("loading"),o.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...',o.disabled=!0,emailjs.send("service_5wxw12r","template_ro49rwx",{email:n,date:new Date().toLocaleString()}).then(function(e){r.innerHTML="",r.className="subscription-message success",r.innerHTML=`
          <div class="success-animation">
            <svg class="checkmark" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <div class="success-content">
              <h3>Thank You!</h3>
              <p>You've successfully subscribed. Check your email for confirmation.</p>
            </div>
          </div>
        `,r.style.display="block",l.reset()},function(e){r.innerHTML="",r.className="subscription-message error",r.innerHTML=`
          <div class="error-animation">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="error-content">
              <h3>Oops!</h3>
              <p>Something went wrong. Please try again later.</p>
            </div>
          </div>
        `,r.style.display="block"}).finally(function(){o.classList.remove("loading"),o.innerHTML='<span class="btn-text">Join me \uD83E\uDE77</span><span class="btn-icon"><i class="fas fa-arrow-right"></i></span>',o.disabled=!1,setTimeout(function(){r.style.opacity="0",setTimeout(function(){r.style.display="none",r.style.opacity="1"},500)},5e3)}))})}});