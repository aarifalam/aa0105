fetch("https://aa0105-lib.pages.dev/json-lib/cloud-greeting-card.json").then(e=>e.json()).then(e=>{let t=new FormData;t.append("file",imageFile),t.append("upload_preset",e.uploadPreset),fetch(e.apiUrl,{method:"POST",body:t}).then(e=>e.json()).then(e=>{console.log("Image URL:",e.secure_url)})});let selectedEmojis=["\uD83C\uDF89","\uD83C\uDF82","\uD83C\uDF88","\uD83C\uDF81","✨"],isFlipping=!1;function initializeApp(){let e=document.getElementById("mobileMenuBtn"),t=document.getElementById("navLinks");e&&t&&e.addEventListener("click",function(){t.classList.toggle("active")}),initializeEmojiSelection(),loadFromLocalStorage(),loadCardFromURL(),updateCard(),setupAutoSave(),setupCardInteraction()}function initializeEmojiSelection(){document.querySelectorAll(".emoji-option").forEach(e=>{let t=e.dataset.emoji;selectedEmojis.includes(t)&&e.classList.add("selected"),e.addEventListener("click",function(){toggleEmoji(t,this)})}),updateSelectedEmojisDisplay()}function toggleEmoji(e,t){let a=selectedEmojis.indexOf(e);-1===a?(selectedEmojis.push(e),t.classList.add("selected")):(selectedEmojis.splice(a,1),t.classList.remove("selected")),updateSelectedEmojisDisplay(),saveToLocalStorage()}function updateSelectedEmojisDisplay(){let e=document.getElementById("selectedEmojis");e&&(selectedEmojis.length>0?e.innerHTML=`<p>Selected emojis: ${selectedEmojis.join(" ")}</p>`:e.innerHTML="<p>No emojis selected. Click emojis above to select.</p>")}function setupCardInteraction(){let e=document.getElementById("flipCard");e&&e.addEventListener("click",function(){this.classList.toggle("flipped"),this.classList.contains("flipped")&&showRandomEmojis()})}function showRandomEmojis(){if(0===selectedEmojis.length||isFlipping)return;isFlipping=!0;let e=Math.floor(3*Math.random())+3;for(let t=0;t<e;t++)setTimeout(()=>{createFloatingEmoji(selectedEmojis[Math.floor(Math.random()*selectedEmojis.length)])},200*t);setTimeout(()=>{isFlipping=!1},1e3)}function createFloatingEmoji(e){let t=document.createElement("div");t.className="random-emoji",t.textContent=e,t.style.left=80*Math.random()+10+"%",t.style.top=80*Math.random()+10+"%",t.style.color=getRandomColor(),t.style.fontSize=20*Math.random()+40+"px",document.body.appendChild(t),setTimeout(()=>{t.remove()},2e3)}function getRandomColor(){let e=["#FF5252","#FF4081","#E040FB","#7C4DFF","#536DFE","#448AFF","#40C4FF","#18FFFF","#64FFDA","#69F0AE","#B2FF59","#EEFF41","#FFFF00","#FFD740","#FFAB40"];return e[Math.floor(Math.random()*e.length)]}function isValidUrl(e){if(!e||""===e.trim())return!0;try{return new URL(e),!0}catch(t){return!1}}function showError(e,t){let a=document.getElementById(e);return!a||(a.textContent=t,a.style.display="block",!1)}function hideError(e){let t=document.getElementById(e);return t&&(t.style.display="none"),!0}function validateInputs(){let e=!0,t=document.getElementById("frontInput");t.value.trim()?(hideError("frontError"),t.classList.remove("has-error")):(e=showError("frontError","Front message is required")&&e,t.classList.add("has-error"));let a=document.getElementById("imageUrl").value.trim();a&&!isValidUrl(a)?(e=showError("imageError","Please enter a valid URL")&&e,document.getElementById("imageUrl").classList.add("has-error")):(hideError("imageError"),document.getElementById("imageUrl").classList.remove("has-error"));let r=document.getElementById("backTitle");r.value.trim()?(hideError("titleError"),r.classList.remove("has-error")):(e=showError("titleError","Back title is required")&&e,r.classList.add("has-error"));let l=document.getElementById("backInput");l.value.trim()?(hideError("messageError"),l.classList.remove("has-error")):(e=showError("messageError","Back message is required")&&e,l.classList.add("has-error"));let o=!1;for(let i of["instagram","facebook","twitter","youtube"]){let s=document.getElementById(i),n=s.value.trim();n&&!isValidUrl(n)?(o=!0,s.classList.add("has-error")):s.classList.remove("has-error")}return o?e=showError("socialError","Please enter valid URLs for social media")&&e:hideError("socialError"),e}function updateCard(){if(!validateInputs()){showTemporaryMessage("Please fix errors before updating","error");return}try{let e=document.getElementById("frontInput").value;document.getElementById("frontMessage").innerText=e;let t=document.getElementById("imageUrl").value.trim()||"https://i.imgur.com/JqYeYn7.jpg",a=document.getElementById("profileImage");a.classList.add("loading");let r=new Image;r.onload=function(){a.src=t,a.classList.remove("loading")},r.onerror=function(){a.src="https://i.imgur.com/JqYeYn7.jpg",a.classList.remove("loading"),showTemporaryMessage("Could not load image. Using default.","error")},r.src=t;let l=document.getElementById("backTitle").value;document.getElementById("birthdayText").innerText=l;let o=document.getElementById("backInput").value;document.getElementById("backText").innerHTML=o.replace(/\n/g,"<br>"),updateSocialLinks(),saveToLocalStorage(),showTemporaryMessage("Card updated successfully!","success")}catch(i){console.error("Error updating card:",i),showTemporaryMessage("Error updating card","error")}}function updateSocialLinks(){let e=document.getElementById("instagram").value.trim(),t=document.getElementById("facebook").value.trim(),a=document.getElementById("twitter").value.trim(),r=document.getElementById("youtube").value.trim(),l=document.getElementById("socialIcons");l.innerHTML="",[{url:e,icon:"fab fa-instagram",label:"Instagram"},{url:t,icon:"fab fa-facebook",label:"Facebook"},{url:a,icon:"fab fa-twitter",label:"Twitter"},{url:r,icon:"fab fa-youtube",label:"YouTube"}].forEach(e=>{if(e.url){let t=document.createElement("a");t.href=e.url,t.target="_blank",t.rel="noopener noreferrer",t.setAttribute("aria-label",e.label);let a=document.createElement("i");a.className=e.icon,t.appendChild(a),l.appendChild(t)}}),0===l.children.length&&(l.innerHTML='<p style="color:#666; font-style:italic;">No social links added</p>')}function downloadCard(){if(!validateInputs()){showTemporaryMessage("Please fix errors before downloading","error");return}try{let e=document.getElementById("frontInput").value,t=document.getElementById("imageUrl").value.trim()||"https://i.imgur.com/JqYeYn7.jpg",a=document.getElementById("backTitle").value,r=document.getElementById("backInput").value.replace(/\n/g,"<br>"),l=document.getElementById("instagram").value.trim(),o=document.getElementById("facebook").value.trim(),i=document.getElementById("twitter").value.trim(),s=document.getElementById("youtube").value.trim(),n="";l&&(n+=`<a href="${escapeHtml(l)}" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>`),o&&(n+=`<a href="${escapeHtml(o)}" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>`),i&&(n+=`<a href="${escapeHtml(i)}" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>`),s&&(n+=`<a href="${escapeHtml(s)}" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a>`);let d=`<!DOCTYPE html>
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
        background: linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 50%, 
            #4a1e6e 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        position: relative;
        overflow-x: hidden;
    }
    
    body::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
    }
    
    .card-container {
        width: 100%;
        max-width: 480px;
        position: relative;
        z-index: 1;
    }
    
    .card-container::after {
        content: '';
        position: absolute;
        top: 20px;
        left: 20px;
        right: -20px;
        bottom: -20px;
        background: rgba(0,0,0,0.1);
        border-radius: 30px;
        z-index: -1;
        filter: blur(20px);
        opacity: 0.5;
    }
    
    .flip-card {
        background-color: transparent;
        width: 100%;
        height: 580px;
        perspective: 1500px;
    }
    
    .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        transform-style: preserve-3d;
        box-shadow: 
            0 20px 60px rgba(0,0,0,0.3),
            0 0 0 1px rgba(255,255,255,0.1) inset;
        border-radius: 24px;
        cursor: pointer;
        overflow: hidden;
    }
    
    .flip-card:hover .flip-card-inner {
        transform: rotateY(180deg);
    }
    
    .flip-card:hover .flip-card-inner::before {
        opacity: 1;
    }
    
    .flip-card-inner::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, 
            rgba(255,255,255,0.1) 0%,
            transparent 50%,
            rgba(255,255,255,0.1) 100%);
        opacity: 0;
        transition: opacity 0.6s ease;
        z-index: 2;
        pointer-events: none;
        border-radius: 24px;
    }
    
    .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px 35px;
        overflow: hidden;
    }
    
    .flip-card-front {
        background: linear-gradient(145deg, 
            #ff6b6b 0%, 
            #ff8e53 50%, 
            #ffb347 100%);
        color: #fff;
        font-size: 2.3rem;
        font-weight: 800;
        text-shadow: 
            2px 2px 4px rgba(0,0,0,0.3),
            0 0 30px rgba(255,255,255,0.3);
        border: none;
        position: relative;
    }
    
    .flip-card-front::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 70%),
            radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 70%);
        border-radius: 24px;
    }
    
    .flip-card-back {
        background: linear-gradient(145deg, 
            #a18cd1 0%, 
            #fbc2eb 100%);
        color: #2d3748;
        font-size: 1.1rem;
        line-height: 1.7;
        transform: rotateY(180deg);
        border: none;
        position: relative;
    }
    
    .flip-card-back::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, 
            rgba(255,255,255,0.2) 0%,
            rgba(255,255,255,0.1) 50%,
            rgba(255,255,255,0.2) 100%);
        border-radius: 24px;
    }
    
    .profile-image {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        object-fit: cover;
        border: 6px solid rgba(255,255,255,0.9);
        box-shadow: 
            0 15px 35px rgba(0,0,0,0.2),
            0 0 0 1px rgba(255,255,255,0.3) inset;
        margin-bottom: 25px;
        position: relative;
        z-index: 2;
        transition: all 0.4s ease;
    }
    
    .flip-card-back:hover .profile-image {
        transform: scale(1.05);
        box-shadow: 
            0 20px 40px rgba(0,0,0,0.3),
            0 0 0 1px rgba(255,255,255,0.4) inset;
    }
    
    .birthday-text {
        font-size: 1.9rem;
        font-weight: 700;
        color: #d53f8c;
        text-shadow: 
            1px 1px 2px rgba(0,0,0,0.1),
            0 0 20px rgba(255,255,255,0.3);
        margin: 20px 0;
        padding: 10px 30px;
        background: rgba(255,255,255,0.15);
        border-radius: 50px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        position: relative;
        z-index: 2;
    }
    
    .message {
        margin: 20px 0;
        font-size: 1.05rem;
        line-height: 1.65;
        color: #2d3748;
        position: relative;
        z-index: 2;
        text-align: center;
        max-width: 100%;
        word-wrap: break-word;
        padding: 15px;
        background: rgba(255,255,255,0.1);
        border-radius: 16px;
        backdrop-filter: blur(5px);
    }
    
    .social-icons {
        display: flex;
        justify-content: center;
        gap: 18px;
        margin-top: 25px;
        flex-wrap: wrap;
        position: relative;
        z-index: 2;
        padding: 15px;
        background: rgba(255,255,255,0.1);
        border-radius: 25px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.15);
    }
    
    .social-icons a {
        color: #2d3748;
        font-size: 24px;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        position: relative;
        overflow: hidden;
    }
    
    .social-icons a::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
            transparent, 
            rgba(255,255,255,0.4), 
            transparent);
        transition: left 0.6s ease;
    }
    
    .social-icons a:hover::before {
        left: 100%;
    }
    
    .social-icons a:hover {
        transform: translateY(-5px) scale(1.15);
        color: #e53e3e;
        background: rgba(255,255,255,0.4);
        box-shadow: 
            0 10px 20px rgba(0,0,0,0.15),
            0 0 0 1px rgba(255,255,255,0.3) inset;
    }
    
    .footer-note {
        margin-top: 25px;
        font-size: 0.85rem;
        color: rgba(45,55,72,0.7);
        font-style: italic;
        position: relative;
        z-index: 2;
        padding: 10px 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 15px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    @media (max-width: 600px) {
        body {
            padding: 15px;
        }
        
        .flip-card {
            height: 520px;
        }
        
        .flip-card-inner {
            border-radius: 20px;
        }
        
        .flip-card-front, .flip-card-back {
            padding: 25px 20px;
            border-radius: 20px;
        }
        
        .flip-card-front {
            font-size: 1.9rem;
        }
        
        .flip-card-back {
            font-size: 1rem;
        }
        
        .profile-image {
            width: 130px;
            height: 130px;
            margin-bottom: 20px;
        }
        
        .birthday-text {
            font-size: 1.6rem;
            padding: 8px 25px;
        }
        
        .message {
            font-size: 0.95rem;
            padding: 12px;
        }
        
        .social-icons {
            gap: 15px;
            padding: 12px;
        }
        
        .social-icons a {
            width: 42px;
            height: 42px;
            font-size: 22px;
        }
        
        .footer-note {
            font-size: 0.8rem;
            margin-top: 20px;
        }
    }
    
    @media (max-width: 400px) {
        .flip-card {
            height: 480px;
        }
        
        .flip-card-front {
            font-size: 1.7rem;
        }
        
        .birthday-text {
            font-size: 1.4rem;
        }
        
        .profile-image {
            width: 110px;
            height: 110px;
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
    // Enhanced flip card functionality with smooth animations and accessibility
    (function() {
        'use strict';
        
        const card = document.querySelector('.flip-card');
        if (!card) return;
        
        const inner = card.querySelector('.flip-card-inner');
        let isAnimating = false;
        let isFlipped = false;
        let animationFrameId = null;
        
        // Create floating particles effect
        function createFloatingParticles() {
            const particles = document.createElement('div');
            particles.className = 'floating-particles';
            particles.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 10;
                border-radius: inherit;
                overflow: hidden;
            `;
            
            inner.appendChild(particles);
            
            // Create 20 particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: rgba(255, 255, 255, ${Math.random() * 0.6 + 0.2});
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: floatParticle ${Math.random() * 3 + 2}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 1}s;
                `;
                particles.appendChild(particle);
            }
            
            // Add CSS for animation
            if (!document.querySelector('#particle-animation')) {
                const style = document.createElement('style');
                style.id = 'particle-animation';
                style.textContent = `
                    @keyframes floatParticle {
                        0%, 100% {
                            transform: translate(0, 0) scale(1);
                            opacity: 0.3;
                        }
                        50% {
                            transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.2);
                            opacity: 0.8;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            return particles;
        }
        
        // Add glow effect during animation
        function addGlowEffect() {
            if (!card.querySelector('.card-glow')) {
                const glow = document.createElement('div');
                glow.className = 'card-glow';
                glow.style.cssText = `
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    right: -10px;
                    bottom: -10px;
                    background: radial-gradient(circle at center, 
                        rgba(255,255,255,0.3) 0%, 
                        rgba(255,255,255,0.1) 40%, 
                        transparent 70%);
                    border-radius: 30px;
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    pointer-events: none;
                `;
                card.appendChild(glow);
                return glow;
            }
            return card.querySelector('.card-glow');
        }
        
        // Enhanced flip function with smooth animation
        function flipCard() {
            if (isAnimating) return;
            
            isAnimating = true;
            isFlipped = !isFlipped;
            
            // Cancel any pending animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            
            // Add glow effect
            const glow = addGlowEffect();
            glow.style.opacity = '0.7';
            
            // Add sound effect (optional - could be disabled for accessibility)
            playFlipSound();
            
            // Remove hover particles if they exist
            const particles = card.querySelector('.floating-particles');
            if (particles) {
                particles.style.opacity = '0';
                setTimeout(() => particles.remove(), 500);
            }
            
            // Use requestAnimationFrame for smooth animation
            let startTime = null;
            const duration = 800; // ms
            const startRotation = isFlipped ? 0 : 180;
            const endRotation = isFlipped ? 180 : 0;
            
            function animate(time) {
                if (!startTime) startTime = time;
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeInOutCubic = progress < 0.5 
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                const currentRotation = startRotation + (endRotation - startRotation) * easeInOutCubic;
                inner.style.transform = `rotateY(${currentRotation}deg)`;
                
                // Add scale effect during animation
                if (progress < 0.5) {
                    const scale = 1 + 0.05 * Math.sin(progress * Math.PI);
                    inner.style.transform += ` scale(${scale})`;
                }
                
                // Add slight perspective change for 3D effect
                card.style.perspective = `${1500 + Math.sin(progress * Math.PI) * 500}px`;
                
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                } else {
                    // Animation complete
                    card.style.perspective = '1500px';
                    inner.style.transform = `rotateY(${endRotation}deg)`;
                    glow.style.opacity = '0';
                    
                    // Add particles to back side when flipped
                    if (isFlipped) {
                        setTimeout(() => {
                            createFloatingParticles();
                        }, 300);
                    }
                    
                    // Update ARIA label for screen readers
                    const frontText = inner.querySelector('.flip-card-front')?.textContent || 'Front of card';
                    const backTitle = inner.querySelector('.birthday-text')?.textContent || 'Back of card';
                    
                    card.setAttribute('aria-label', 
                        isFlipped 
                            ? `Card flipped to back: ${backTitle}`
                            : `Card flipped to front: ${frontText}`
                    );
                    
                    // Dispatch custom event
                    card.dispatchEvent(new CustomEvent('cardFlipped', {
                        detail: { isFlipped: isFlipped }
                    }));
                    
                    isAnimating = false;
                    animationFrameId = null;
                }
            }
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        // Sound effect for flip (optional, can be muted)
        function playFlipSound() {
            try {
                // Check if sound is enabled
                if (localStorage.getItem('cardSoundEnabled') !== 'false') {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
                    
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.4);
                    
                    // Auto cleanup
                    setTimeout(() => {
                        oscillator.disconnect();
                        gainNode.disconnect();
                    }, 500);
                }
            } catch (error) {
                // Audio not supported or blocked - silent fail
            }
        }
        
        // Add hover effect with slight tilt
        function setupHoverEffect() {
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;
            let rafId = null;
            
            function handleMouseMove(e) {
                const rect = card.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 40; // -20 to 20
                mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 40;
            }
            
            function animateTilt() {
                // Smooth interpolation
                targetX += (mouseX - targetX) * 0.1;
                targetY += (mouseY - targetY) * 0.1;
                
                if (!isFlipped) {
                    inner.style.transform = `rotateY(${isFlipped ? 180 : 0}deg) rotateX(${targetY * 0.5}deg) rotateY(${targetX * -0.5}deg)`;
                }
                
                // Add shadow movement
                card.style.boxShadow = `
                    ${targetX * 0.5}px ${targetY * 0.5}px 60px rgba(0,0,0,0.3),
                    0 0 0 1px rgba(255,255,255,0.1) inset
                `;
                
                rafId = requestAnimationFrame(animateTilt);
            }
            
            function handleMouseEnter() {
                card.addEventListener('mousemove', handleMouseMove);
                rafId = requestAnimationFrame(animateTilt);
                
                // Create floating particles on hover
                if (!isFlipped && !card.querySelector('.floating-particles')) {
                    createFloatingParticles();
                }
            }
            
            function handleMouseLeave() {
                card.removeEventListener('mousemove', handleMouseMove);
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                
                // Reset transform
                setTimeout(() => {
                    if (!isAnimating) {
                        inner.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
                        card.style.boxShadow = `
                            0 20px 60px rgba(0,0,0,0.3),
                            0 0 0 1px rgba(255,255,255,0.1) inset
                        `;
                    }
                }, 100);
                
                // Fade out particles
                const particles = card.querySelector('.floating-particles');
                if (particles) {
                    particles.style.opacity = '0';
                    setTimeout(() => {
                        if (particles.parentNode) particles.remove();
                    }, 300);
                }
            }
            
            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
            
            // Cleanup function
            return () => {
                card.removeEventListener('mouseenter', handleMouseEnter);
                card.removeEventListener('mouseleave', handleMouseLeave);
                card.removeEventListener('mousemove', handleMouseMove);
                if (rafId) cancelAnimationFrame(rafId);
            };
        }
        
        // Add keyboard accessibility
        function setupKeyboardAccessibility() {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Interactive birthday card. Click or press Enter to flip');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    flipCard();
                }
            });
            
            // Touch device support
            let touchStartX = 0;
            let touchStartTime = 0;
            
            card.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartTime = Date.now();
                e.preventDefault();
            }, { passive: false });
            
            card.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndTime = Date.now();
                const swipeDistance = Math.abs(touchEndX - touchStartX);
                const swipeTime = touchEndTime - touchStartTime;
                
                // Swipe detection
                if (swipeDistance > 50 && swipeTime < 300) {
                    flipCard();
                }
                e.preventDefault();
            }, { passive: false });
        }
        
        // Initialize everything
        function init() {
            // Add hover effect
            const cleanupHover = setupHoverEffect();
            
            // Add accessibility
            setupKeyboardAccessibility();
            
            // Click to flip
            card.addEventListener('click', (e) => {
                // Don't flip if clicking on interactive elements inside
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }
                flipCard();
            });
            
            // Add CSS for 3D effect
            if (!document.querySelector('#card-3d-styles')) {
                const style = document.createElement('style');
                style.id = 'card-3d-styles';
                style.textContent = `
                    .flip-card {
                        transition: perspective 0.5s ease-out;
                    }
                    .flip-card:focus {
                        outline: 2px solid rgba(255,255,255,0.5);
                        outline-offset: 4px;
                        border-radius: 24px;
                    }
                    .flip-card:focus:not(:focus-visible) {
                        outline: none;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                cleanupHover?.();
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            });
        }
        
        // Start when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
</script>
</body>
</html>`,c=new Blob([d],{type:"text/html"}),m=document.createElement("a");m.href=URL.createObjectURL(c),m.download="birthday_card.html",document.body.appendChild(m),m.click(),document.body.removeChild(m),URL.revokeObjectURL(m.href),showTemporaryMessage("Card downloaded successfully!","success")}catch(g){console.error("Error downloading card:",g),showTemporaryMessage("Error downloading card","error")}}function escapeHtml(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function addConfetti(){let e=["#FF5252","#FF4081","#E040FB","#7C4DFF","#536DFE","#448AFF","#40C4FF","#18FFFF","#64FFDA","#69F0AE"];document.querySelectorAll(".confetti").forEach(e=>e.remove());for(let t=0;t<150;t++)setTimeout(()=>{let t=document.createElement("div");t.className="confetti",t.style.left=100*Math.random()+"vw",t.style.backgroundColor=e[Math.floor(Math.random()*e.length)],t.style.width=15*Math.random()+5+"px",t.style.height=15*Math.random()+5+"px",t.style.borderRadius=Math.random()>.5?"50%":"0",t.style.animationDuration=3*Math.random()+2+"s",t.style.animationDelay=1*Math.random()+"s",document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},6e3)},10*t);showTemporaryMessage("Confetti added! \uD83C\uDF89","success")}function showTemporaryMessage(e,t="info"){document.querySelectorAll(".success-message").forEach(e=>e.remove());let a=document.createElement("div");a.className="success-message",a.style.backgroundColor="success"===t?"#4CAF50":"error"===t?"#F44336":"#2196F3",a.innerHTML=`
    <i class="${"success"===t?"fas fa-check-circle":"error"===t?"fas fa-exclamation-circle":"fas fa-info-circle"}"></i>
    <span>${e}</span>
  `,document.body.appendChild(a),setTimeout(()=>{a.parentNode&&a.remove()},3e3)}function saveToLocalStorage(){try{let e={frontMessage:document.getElementById("frontInput").value,imageUrl:document.getElementById("imageUrl").value,backTitle:document.getElementById("backTitle").value,backMessage:document.getElementById("backInput").value,instagram:document.getElementById("instagram").value,facebook:document.getElementById("facebook").value,twitter:document.getElementById("twitter").value,youtube:document.getElementById("youtube").value,selectedEmojis:selectedEmojis,timestamp:new Date().toISOString()};localStorage.setItem("birthdayCardData",JSON.stringify(e))}catch(t){console.error("Local storage error:",t)}}function loadFromLocalStorage(){try{let e=localStorage.getItem("birthdayCardData");if(e){let t=JSON.parse(e);t.frontMessage&&(document.getElementById("frontInput").value=t.frontMessage),t.imageUrl&&(document.getElementById("imageUrl").value=t.imageUrl),t.backTitle&&(document.getElementById("backTitle").value=t.backTitle),t.backMessage&&(document.getElementById("backInput").value=t.backMessage),t.instagram&&(document.getElementById("instagram").value=t.instagram),t.facebook&&(document.getElementById("facebook").value=t.facebook),t.twitter&&(document.getElementById("twitter").value=t.twitter),t.youtube&&(document.getElementById("youtube").value=t.youtube),t.selectedEmojis&&Array.isArray(t.selectedEmojis)&&(selectedEmojis=t.selectedEmojis,updateSelectedEmojisDisplay(),document.querySelectorAll(".emoji-option").forEach(e=>{let t=e.dataset.emoji;selectedEmojis.includes(t)?e.classList.add("selected"):e.classList.remove("selected")}))}}catch(a){console.error("Error loading saved data:",a)}}function setupAutoSave(){["frontInput","imageUrl","backTitle","backInput","instagram","facebook","twitter","youtube"].forEach(e=>{let t=document.getElementById(e);t&&t.addEventListener("input",()=>{saveToLocalStorage()})})}async function uploadImage(){let e=document.createElement("input");e.type="file",e.accept="image/*,.jpg,.jpeg,.png,.gif,.webp",e.onchange=async e=>{let t=e.target.files[0];if(!t)return;if(t.size>10485760){showTemporaryMessage("File size must be less than 10MB","error");return}if(!["image/jpeg","image/png","image/gif","image/webp"].includes(t.type)){showTemporaryMessage("Please select a valid image file (JPEG, PNG, GIF, WebP)","error");return}let a=document.getElementById("uploadProgress"),r=document.getElementById("progressFill"),l=document.getElementById("progressText");a.style.display="block";let o=new FormData;o.append("file",t),o.append("upload_preset",CLOUDINARY_CONFIG.uploadPreset),o.append("api_key",CLOUDINARY_CONFIG.apiKey);try{showTemporaryMessage("Uploading image...","info");let i=await fetch(CLOUDINARY_CONFIG.apiUrl,{method:"POST",body:o});if(!i.ok)throw Error(`Upload failed: ${i.status}`);let s=await i.json();if(s.secure_url)document.getElementById("imageUrl").value=s.secure_url,updateCard(),showTemporaryMessage("Image uploaded successfully!","success");else throw Error("Upload failed: No URL returned")}catch(n){console.error("Upload error:",n),showTemporaryMessage("Upload failed. Please try again.","error")}finally{setTimeout(()=>{a.style.display="none",r.style.width="0%",l.textContent="0%"},2e3)}},e.click()}function generateShareableURL(){if(!validateInputs()){showTemporaryMessage("Please fix errors before generating URL","error");return}try{let e={frontMessage:document.getElementById("frontInput").value,imageUrl:document.getElementById("imageUrl").value.trim()||"https://i.imgur.com/JqYeYn7.jpg",backTitle:document.getElementById("backTitle").value,backMessage:document.getElementById("backInput").value,instagram:document.getElementById("instagram").value.trim(),facebook:document.getElementById("facebook").value.trim(),twitter:document.getElementById("twitter").value.trim(),youtube:document.getElementById("youtube").value.trim(),selectedEmojis:selectedEmojis,timestamp:Date.now(),version:"1.0"},t=JSON.stringify(e),a,r=`${window.location.origin+window.location.pathname}?card=${btoa(encodeURIComponent(t))}`,l=document.getElementById("shareableUrl"),o=document.getElementById("generatedUrlContainer");l.value=r,o.style.display="block",o.scrollIntoView({behavior:"smooth",block:"center"}),showTemporaryMessage("Shareable URL generated!","success")}catch(i){console.error("Error generating URL:",i),showTemporaryMessage("Error generating URL","error")}}function copyShareUrl(){let e=document.getElementById("shareableUrl");if(!e.value){showTemporaryMessage("No URL to copy","error");return}e.select(),e.setSelectionRange(0,99999),navigator.clipboard.writeText(e.value).then(()=>{showTemporaryMessage("URL copied to clipboard!","success")}).catch(e=>{console.error("Copy failed:",e);try{document.execCommand("copy"),showTemporaryMessage("URL copied to clipboard!","success")}catch(t){showTemporaryMessage("Failed to copy URL","error")}})}function testShareUrl(){let e=document.getElementById("shareableUrl").value;e&&window.open(e,"_blank","noopener,noreferrer")}function loadCardFromURL(){let e=new URLSearchParams(window.location.search).get("card");if(e)try{let t=decodeURIComponent(atob(e)),a=JSON.parse(t);if(a.frontMessage&&(document.getElementById("frontInput").value=a.frontMessage),a.imageUrl&&(document.getElementById("imageUrl").value=a.imageUrl),a.backTitle&&(document.getElementById("backTitle").value=a.backTitle),a.backMessage&&(document.getElementById("backInput").value=a.backMessage),a.instagram&&(document.getElementById("instagram").value=a.instagram),a.facebook&&(document.getElementById("facebook").value=a.facebook),a.twitter&&(document.getElementById("twitter").value=a.twitter),a.youtube&&(document.getElementById("youtube").value=a.youtube),a.selectedEmojis&&Array.isArray(a.selectedEmojis)&&(selectedEmojis=a.selectedEmojis,updateSelectedEmojisDisplay(),document.querySelectorAll(".emoji-option").forEach(e=>{let t=e.dataset.emoji;selectedEmojis.includes(t)?e.classList.add("selected"):e.classList.remove("selected")})),updateCard(),history.replaceState){let r=window.location.pathname;history.replaceState(null,"",r)}showTemporaryMessage("Card loaded from URL!","success")}catch(l){console.error("Error loading card from URL:",l),showTemporaryMessage("Error loading card from URL","error")}}document.addEventListener("DOMContentLoaded",function(){initializeApp()});