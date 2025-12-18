fetch("https://aa0105-lib.pages.dev/json-lib/cloud-greeting-card.json").then(e=>e.json()).then(e=>{let t=new FormData;t.append("file",imageFile),t.append("upload_preset",e.uploadPreset),fetch(e.apiUrl,{method:"POST",body:t}).then(e=>e.json()).then(e=>{console.log("Image URL:",e.secure_url)})});let selectedEmojis=["\uD83C\uDF89","\uD83C\uDF82","\uD83C\uDF88","\uD83C\uDF81","✨"],isFlipping=!1;function initializeApp(){let e=document.getElementById("mobileMenuBtn"),t=document.getElementById("navLinks");e&&t&&e.addEventListener("click",function(){t.classList.toggle("active")}),initializeEmojiSelection(),loadFromLocalStorage(),loadCardFromURL(),updateCard(),setupAutoSave(),setupCardInteraction()}function initializeEmojiSelection(){let e=document.querySelectorAll(".emoji-option");e.forEach(e=>{let t=e.dataset.emoji;selectedEmojis.includes(t)&&e.classList.add("selected"),e.addEventListener("click",function(){toggleEmoji(t,this)})}),updateSelectedEmojisDisplay()}function toggleEmoji(e,t){let a=selectedEmojis.indexOf(e);-1===a?(selectedEmojis.push(e),t.classList.add("selected")):(selectedEmojis.splice(a,1),t.classList.remove("selected")),updateSelectedEmojisDisplay(),saveToLocalStorage()}function updateSelectedEmojisDisplay(){let e=document.getElementById("selectedEmojis");e&&(selectedEmojis.length>0?e.innerHTML=`<p>Selected emojis: ${selectedEmojis.join(" ")}</p>`:e.innerHTML="<p>No emojis selected. Click emojis above to select.</p>")}function setupCardInteraction(){let e=document.getElementById("flipCard");e&&e.addEventListener("click",function(){this.classList.toggle("flipped"),this.classList.contains("flipped")&&showRandomEmojis()})}function showRandomEmojis(){if(0===selectedEmojis.length||isFlipping)return;isFlipping=!0;let e=Math.floor(3*Math.random())+3;for(let t=0;t<e;t++)setTimeout(()=>{let e=selectedEmojis[Math.floor(Math.random()*selectedEmojis.length)];createFloatingEmoji(e)},200*t);setTimeout(()=>{isFlipping=!1},1e3)}function createFloatingEmoji(e){let t=document.createElement("div");t.className="random-emoji",t.textContent=e,t.style.left=80*Math.random()+10+"%",t.style.top=80*Math.random()+10+"%",t.style.color=getRandomColor(),t.style.fontSize=20*Math.random()+40+"px",document.body.appendChild(t),setTimeout(()=>{t.remove()},2e3)}function getRandomColor(){let e=["#FF5252","#FF4081","#E040FB","#7C4DFF","#536DFE","#448AFF","#40C4FF","#18FFFF","#64FFDA","#69F0AE","#B2FF59","#EEFF41","#FFFF00","#FFD740","#FFAB40"];return e[Math.floor(Math.random()*e.length)]}function isValidUrl(e){if(!e||""===e.trim())return!0;try{return new URL(e),!0}catch(t){return!1}}function showError(e,t){let a=document.getElementById(e);return!a||(a.textContent=t,a.style.display="block",!1)}function hideError(e){let t=document.getElementById(e);return t&&(t.style.display="none"),!0}function validateInputs(){let e=!0,t=document.getElementById("frontInput");t.value.trim()?(hideError("frontError"),t.classList.remove("has-error")):(e=showError("frontError","Front message is required")&&e,t.classList.add("has-error"));let a=document.getElementById("imageUrl").value.trim();a&&!isValidUrl(a)?(e=showError("imageError","Please enter a valid URL")&&e,document.getElementById("imageUrl").classList.add("has-error")):(hideError("imageError"),document.getElementById("imageUrl").classList.remove("has-error"));let r=document.getElementById("backTitle");r.value.trim()?(hideError("titleError"),r.classList.remove("has-error")):(e=showError("titleError","Back title is required")&&e,r.classList.add("has-error"));let l=document.getElementById("backInput");l.value.trim()?(hideError("messageError"),l.classList.remove("has-error")):(e=showError("messageError","Back message is required")&&e,l.classList.add("has-error"));let o=!1;for(let i of["instagram","facebook","twitter","youtube"]){let s=document.getElementById(i),n=s.value.trim();n&&!isValidUrl(n)?(o=!0,s.classList.add("has-error")):s.classList.remove("has-error")}return o?e=showError("socialError","Please enter valid URLs for social media")&&e:hideError("socialError"),e}function updateCard(){if(!validateInputs()){showTemporaryMessage("Please fix errors before updating","error");return}try{let e=document.getElementById("frontInput").value;document.getElementById("frontMessage").innerText=e;let t=document.getElementById("imageUrl").value.trim()||"https://i.imgur.com/JqYeYn7.jpg",a=document.getElementById("profileImage");a.classList.add("loading");let r=new Image;r.onload=function(){a.src=t,a.classList.remove("loading")},r.onerror=function(){a.src="https://i.imgur.com/JqYeYn7.jpg",a.classList.remove("loading"),showTemporaryMessage("Could not load image. Using default.","error")},r.src=t;let l=document.getElementById("backTitle").value;document.getElementById("birthdayText").innerText=l;let o=document.getElementById("backInput").value;document.getElementById("backText").innerHTML=o.replace(/\n/g,"<br>"),updateSocialLinks(),saveToLocalStorage(),showTemporaryMessage("Card updated successfully!","success")}catch(i){console.error("Error updating card:",i),showTemporaryMessage("Error updating card","error")}}function updateSocialLinks(){let e=document.getElementById("instagram").value.trim(),t=document.getElementById("facebook").value.trim(),a=document.getElementById("twitter").value.trim(),r=document.getElementById("youtube").value.trim(),l=document.getElementById("socialIcons");l.innerHTML="",[{url:e,icon:"fab fa-instagram",label:"Instagram"},{url:t,icon:"fab fa-facebook",label:"Facebook"},{url:a,icon:"fab fa-twitter",label:"Twitter"},{url:r,icon:"fab fa-youtube",label:"YouTube"}].forEach(e=>{if(e.url){let t=document.createElement("a");t.href=e.url,t.target="_blank",t.rel="noopener noreferrer",t.setAttribute("aria-label",e.label);let a=document.createElement("i");a.className=e.icon,t.appendChild(a),l.appendChild(t)}}),0===l.children.length&&(l.innerHTML='<p style="color:#666; font-style:italic;">No social links added</p>')}function downloadCard(){if(!validateInputs()){showTemporaryMessage("Please fix errors before downloading","error");return}try{let e=document.getElementById("frontInput").value,t=document.getElementById("imageUrl").value.trim()||"https://i.imgur.com/JqYeYn7.jpg",a=document.getElementById("backTitle").value,r=document.getElementById("backInput").value.replace(/\n/g,"<br>"),l=document.getElementById("instagram").value.trim(),o=document.getElementById("facebook").value.trim(),i=document.getElementById("twitter").value.trim(),s=document.getElementById("youtube").value.trim(),n="";l&&(n+=`<a href="${escapeHtml(l)}" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>`),o&&(n+=`<a href="${escapeHtml(o)}" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>`),i&&(n+=`<a href="${escapeHtml(i)}" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>`),s&&(n+=`<a href="${escapeHtml(s)}" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>`);let d=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Birthday Card</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .card-container {
            width: 100%;
            max-width: 500px;
        }
        
        .flip-card {
            background-color: transparent;
            width: 100%;
            height: 600px;
            perspective: 1000px;
        }
        
        .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.8s;
            transform-style: preserve-3d;
            box-shadow: 0 15px 35px rgba(0,0,0,0.3);
            border-radius: 20px;
            cursor: pointer;
        }
        
        .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px;
        }
        
        .flip-card-front {
            background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
            color: #d32f2f;
            font-size: 2.5rem;
            font-weight: bold;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.2);
            border: 8px solid #FFD700;
        }
        
        .flip-card-back {
            background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
            color: #333;
            font-size: 1.2rem;
            line-height: 1.8;
            transform: rotateY(180deg);
            border: 8px solid #4CAF50;
            overflow-y: auto;
        }
        
        .profile-image {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            object-fit: cover;
            border: 6px solid white;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            margin-bottom: 25px;
        }
        
        .birthday-text {
            font-size: 2rem;
            font-weight: bold;
            color: #E91E63;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            margin: 20px 0;
        }
        
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .social-icons a {
            color: #333;
            font-size: 28px;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
        }
        
        .social-icons a:hover {
            transform: scale(1.2);
            color: #E91E63;
            background: rgba(255,255,255,0.5);
        }
        
        .message {
            margin: 20px 0;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        .footer-note {
            margin-top: 30px;
            font-size: 0.9rem;
            color: #666;
            font-style: italic;
        }
        
        @media (max-width: 600px) {
            .flip-card {
                height: 500px;
            }
            
            .flip-card-front {
                font-size: 2rem;
                padding: 20px;
            }
            
            .flip-card-back {
                font-size: 1rem;
                padding: 20px;
            }
            
            .profile-image {
                width: 140px;
                height: 140px;
            }
            
            .birthday-text {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="card-container">
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    ${escapeHtml(e)}
                </div>
                <div class="flip-card-back">
                    <img src="${escapeHtml(t)}" alt="Birthday Person" class="profile-image" onerror="this.src='https://i.imgur.com/JqYeYn7.jpg'">
                    <div class="birthday-text">${escapeHtml(a)}</div>
                    <div class="message">${r}</div>
                    ${n?`<div class="social-icons">${n}</div>`:""}
                    <div class="footer-note">Made with ❤️ using GreetingCard Maker</div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Add flip functionality
        document.querySelector('.flip-card').addEventListener('click', function() {
            this.querySelector('.flip-card-inner').style.transform = 
                this.querySelector('.flip-card-inner').style.transform === 'rotateY(180deg)' 
                ? 'rotateY(0deg)' 
                : 'rotateY(180deg)';
        });
    </script>
</body>
</html>`,c=new Blob([d],{type:"text/html"}),m=document.createElement("a");m.href=URL.createObjectURL(c),m.download="birthday_card.html",document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(m.href),showTemporaryMessage("Card downloaded successfully!","success")}catch(g){console.error("Error downloading card:",g),showTemporaryMessage("Error downloading card","error")}}function escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function addConfetti(){let e=["#FF5252","#FF4081","#E040FB","#7C4DFF","#536DFE","#448AFF","#40C4FF","#18FFFF","#64FFDA","#69F0AE"];document.querySelectorAll(".confetti").forEach(e=>e.remove());for(let t=0;t<150;t++)setTimeout(()=>{let t=document.createElement("div");t.className="confetti",t.style.left=100*Math.random()+"vw",t.style.backgroundColor=e[Math.floor(Math.random()*e.length)],t.style.width=15*Math.random()+5+"px",t.style.height=15*Math.random()+5+"px",t.style.borderRadius=Math.random()>.5?"50%":"0",t.style.animationDuration=3*Math.random()+2+"s",t.style.animationDelay=1*Math.random()+"s",document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},6e3)},10*t);showTemporaryMessage("Confetti added! \uD83C\uDF89","success")}function showTemporaryMessage(e,t="info"){let a=document.querySelectorAll(".success-message");a.forEach(e=>e.remove());let r=document.createElement("div");r.className="success-message",r.style.backgroundColor="success"===t?"#4CAF50":"error"===t?"#F44336":"#2196F3",r.innerHTML=`
    <i class="${"success"===t?"fas fa-check-circle":"error"===t?"fas fa-exclamation-circle":"fas fa-info-circle"}"></i>
    <span>${e}</span>
  `,document.body.appendChild(r),setTimeout(()=>{r.parentNode&&r.remove()},3e3)}function saveToLocalStorage(){try{let e={frontMessage:document.getElementById("frontInput").value,imageUrl:document.getElementById("imageUrl").value,backTitle:document.getElementById("backTitle").value,backMessage:document.getElementById("backInput").value,instagram:document.getElementById("instagram").value,facebook:document.getElementById("facebook").value,twitter:document.getElementById("twitter").value,youtube:document.getElementById("youtube").value,selectedEmojis:selectedEmojis,timestamp:new Date().toISOString()};localStorage.setItem("birthdayCardData",JSON.stringify(e))}catch(t){console.error("Local storage error:",t)}}function loadFromLocalStorage(){try{let e=localStorage.getItem("birthdayCardData");if(e){let t=JSON.parse(e);t.frontMessage&&(document.getElementById("frontInput").value=t.frontMessage),t.imageUrl&&(document.getElementById("imageUrl").value=t.imageUrl),t.backTitle&&(document.getElementById("backTitle").value=t.backTitle),t.backMessage&&(document.getElementById("backInput").value=t.backMessage),t.instagram&&(document.getElementById("instagram").value=t.instagram),t.facebook&&(document.getElementById("facebook").value=t.facebook),t.twitter&&(document.getElementById("twitter").value=t.twitter),t.youtube&&(document.getElementById("youtube").value=t.youtube),t.selectedEmojis&&Array.isArray(t.selectedEmojis)&&(selectedEmojis=t.selectedEmojis,updateSelectedEmojisDisplay(),document.querySelectorAll(".emoji-option").forEach(e=>{let t=e.dataset.emoji;selectedEmojis.includes(t)?e.classList.add("selected"):e.classList.remove("selected")}))}}catch(a){console.error("Error loading saved data:",a)}}function setupAutoSave(){["frontInput","imageUrl","backTitle","backInput","instagram","facebook","twitter","youtube"].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener("input",()=>{saveToLocalStorage()})})}async function uploadImage(){let e=document.createElement("input");e.type="file",e.accept="image/*,.jpg,.jpeg,.png,.gif,.webp",e.onchange=async e=>{let t=e.target.files[0];if(!t)return;if(t.size>10485760){showTemporaryMessage("File size must be less than 10MB","error");return}if(!["image/jpeg","image/png","image/gif","image/webp"].includes(t.type)){showTemporaryMessage("Please select a valid image file (JPEG, PNG, GIF, WebP)","error");return}let a=document.getElementById("uploadProgress"),r=document.getElementById("progressFill"),l=document.getElementById("progressText");a.style.display="block";let o=new FormData;o.append("file",t),o.append("upload_preset",CLOUDINARY_CONFIG.uploadPreset),o.append("api_key",CLOUDINARY_CONFIG.apiKey);try{showTemporaryMessage("Uploading image...","info");let i=await fetch(CLOUDINARY_CONFIG.apiUrl,{method:"POST",body:o});if(!i.ok)throw Error(`Upload failed: ${i.status}`);let s=await i.json();if(s.secure_url)document.getElementById("imageUrl").value=s.secure_url,updateCard(),showTemporaryMessage("Image uploaded successfully!","success");else throw Error("Upload failed: No URL returned")}catch(n){console.error("Upload error:",n),showTemporaryMessage("Upload failed. Please try again.","error")}finally{setTimeout(()=>{a.style.display="none",r.style.width="0%",l.textContent="0%"},2e3)}},e.click()}function generateShareableURL(){if(!validateInputs()){showTemporaryMessage("Please fix errors before generating URL","error");return}try{let e={frontMessage:document.getElementById("frontInput").value,imageUrl:document.getElementById("imageUrl").value.trim()||"https://i.imgur.com/JqYeYn7.jpg",backTitle:document.getElementById("backTitle").value,backMessage:document.getElementById("backInput").value,instagram:document.getElementById("instagram").value.trim(),facebook:document.getElementById("facebook").value.trim(),twitter:document.getElementById("twitter").value.trim(),youtube:document.getElementById("youtube").value.trim(),selectedEmojis:selectedEmojis,timestamp:Date.now(),version:"1.0"},t=JSON.stringify(e),a=btoa(encodeURIComponent(t)),r=window.location.origin+window.location.pathname,l=`${r}?card=${a}`,o=document.getElementById("shareableUrl"),i=document.getElementById("generatedUrlContainer");o.value=l,i.style.display="block",i.scrollIntoView({behavior:"smooth",block:"center"}),showTemporaryMessage("Shareable URL generated!","success")}catch(s){console.error("Error generating URL:",s),showTemporaryMessage("Error generating URL","error")}}function copyShareUrl(){let e=document.getElementById("shareableUrl");if(!e.value){showTemporaryMessage("No URL to copy","error");return}e.select(),e.setSelectionRange(0,99999),navigator.clipboard.writeText(e.value).then(()=>{showTemporaryMessage("URL copied to clipboard!","success")}).catch(e=>{console.error("Copy failed:",e);try{document.execCommand("copy"),showTemporaryMessage("URL copied to clipboard!","success")}catch(t){showTemporaryMessage("Failed to copy URL","error")}})}function testShareUrl(){let e=document.getElementById("shareableUrl").value;e&&window.open(e,"_blank","noopener,noreferrer")}function loadCardFromURL(){let e=new URLSearchParams(window.location.search),t=e.get("card");if(t)try{let a=decodeURIComponent(atob(t)),r=JSON.parse(a);if(r.frontMessage&&(document.getElementById("frontInput").value=r.frontMessage),r.imageUrl&&(document.getElementById("imageUrl").value=r.imageUrl),r.backTitle&&(document.getElementById("backTitle").value=r.backTitle),r.backMessage&&(document.getElementById("backInput").value=r.backMessage),r.instagram&&(document.getElementById("instagram").value=r.instagram),r.facebook&&(document.getElementById("facebook").value=r.facebook),r.twitter&&(document.getElementById("twitter").value=r.twitter),r.youtube&&(document.getElementById("youtube").value=r.youtube),r.selectedEmojis&&Array.isArray(r.selectedEmojis)&&(selectedEmojis=r.selectedEmojis,updateSelectedEmojisDisplay(),document.querySelectorAll(".emoji-option").forEach(e=>{let t=e.dataset.emoji;selectedEmojis.includes(t)?e.classList.add("selected"):e.classList.remove("selected")})),updateCard(),history.replaceState){let l=window.location.pathname;history.replaceState(null,"",l)}showTemporaryMessage("Card loaded from URL!","success")}catch(o){console.error("Error loading card from URL:",o),showTemporaryMessage("Error loading card from URL","error")}}document.addEventListener("DOMContentLoaded",function(){initializeApp()});
