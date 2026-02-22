// DOM Elements
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const uploadBtn = document.getElementById('uploadBtn');
const imagePreviews = document.getElementById('imagePreviews');
const resultContainer = document.getElementById('resultContainer');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeModal = document.getElementById('closeModal');
const urlHistory = document.getElementById('urlHistory');
const progressBar = document.getElementById('progressBar');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// API Configuration
const WORKER_URL = 'https://cloud-config.kumar8948rahul.workers.dev/';
let CLOUD_NAME, UPLOAD_PRESET, API_KEY;
let userLimits = {
    dailyRemaining: 20,
    monthlyRemaining: 50,
    dailyMax: 20,
    monthlyMax: 50,
    autoDeleteDays: 30
};

// Security check - allowed domains
const ALLOWED_DOMAINS = [
    'aarifalam.life',
    'aarifalam.pages.dev',
    'localhost',
    '127.0.0.1',
    'aa0105-lib.pages.dev'
];

// Store selected files
let selectedFiles = [];

// Check if current domain is allowed
function isDomainAllowed() {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    if (ALLOWED_DOMAINS.includes(hostname)) {
        return true;
    }
    
    if (hostname === 'localhost' && port === '7530') {
        return true;
    }
    
    if (hostname.endsWith('.aarifalam.life') || hostname.endsWith('.aarifalam.pages.dev')) {
        return true;
    }
    
    return false;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (!isDomainAllowed()) {
        showToast('Access denied: Unauthorized domain', 'error');
        disableUpload();
        return;
    }
    
    await loadWorkerConfig();
    await checkUserLimits();
    
    // Show limits for 5 seconds on refresh
    showLimitsToast();
    
    loadHistory();
    checkScheduledDeletions();
    addPulseAnimation();
    addScrollToTopButton();
});

// Show limits toast for 5 seconds
function showLimitsToast() {
    const limitsMessage = `
        <div style="display: flex; flex-direction: column; gap: 5px;">
            <div style="display: flex; justify-content: space-between;">
                <span>📸 Daily:</span>
                <span style="color: ${userLimits.dailyRemaining < 5 ? '#ff6b6b' : '#4ade80'}; font-weight: bold;">
                    ${userLimits.dailyRemaining}/${userLimits.dailyMax}
                </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>📅 Monthly:</span>
                <span style="color: ${userLimits.monthlyRemaining < 10 ? '#ff6b6b' : '#4ade80'}; font-weight: bold;">
                    ${userLimits.monthlyRemaining}/${userLimits.monthlyMax}
                </span>
            </div>
            <div style="font-size: 12px; color: #aaa; margin-top: 5px; text-align: center;">
                ⏱️ Auto-delete after ${userLimits.autoDeleteDays} days
            </div>
        </div>
    `;
    
    // Create temporary toast
    const limitsToast = document.createElement('div');
    limitsToast.className = 'toast limits-toast';
    limitsToast.innerHTML = limitsMessage;
    limitsToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--dark);
        color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        border-left: 4px solid var(--primary);
        min-width: 200px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(limitsToast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        limitsToast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            limitsToast.remove();
        }, 300);
    }, 5000);
}

// Load configuration from worker
async function loadWorkerConfig() {
    try {
        const response = await fetch(`${WORKER_URL}`, {
            method: 'GET',
            headers: { 'Origin': window.location.origin }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load configuration');
        }
        
        const config = await response.json();
        
        CLOUD_NAME = config.cloudName;
        UPLOAD_PRESET = config.uploadPreset;
        API_KEY = config.apiKey;
        
        if (config.limits) {
            userLimits = { ...userLimits, ...config.limits };
        }
        
    } catch (error) {
        console.error('Failed to load config:', error);
        showToast('Failed to initialize', 'error');
        disableUpload();
    }
}

// Check user limits
async function checkUserLimits() {
    try {
        const response = await fetch(`${WORKER_URL}/check-limits`, {
            method: 'GET',
            headers: { 'Origin': window.location.origin }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                userLimits = { ...userLimits, ...data.limits };
            }
        }
    } catch (error) {
        console.error('Failed to check limits:', error);
    }
}

// Track uploads with worker
async function trackUploads(images) {
    try {
        const response = await fetch(`${WORKER_URL}/track-upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': window.location.origin
            },
            body: JSON.stringify({ images })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.limits) {
                userLimits = { ...userLimits, ...data.limits };
                showToast(`${images.length} image(s) uploaded. Auto-deletes after ${userLimits.autoDeleteDays} days`, 'success');
            }
        }
    } catch (error) {
        console.error('Failed to track uploads:', error);
    }
}

// Disable upload
function disableUpload() {
    uploadBtn.disabled = true;
    uploadBtn.style.opacity = '0.5';
    uploadBtn.style.cursor = 'not-allowed';
    uploadBtn.title = 'Access denied';
    if (fileInput) fileInput.disabled = true;
    dropArea.style.opacity = '0.5';
    dropArea.style.pointerEvents = 'none';
}

// File selection handler
fileInput.addEventListener('change', handleFileSelect);

// Drag and drop handlers
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#4361ee';
    dropArea.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.borderColor = '#4361ee';
    dropArea.style.backgroundColor = 'transparent';
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#4361ee';
    dropArea.style.backgroundColor = 'transparent';
    
    if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
    }
});

// Upload button handler
uploadBtn.addEventListener('click', uploadImagesWithAnimation);

// History modal handlers
historyBtn.addEventListener('click', () => {
    historyModal.style.display = 'flex';
    loadHistory();
});

closeModal.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

// Handle file selection
function handleFileSelect(e) {
    handleFiles(e.target.files);
}

// Process files
function handleFiles(files) {
    if (files.length > userLimits.dailyRemaining) {
        showToast(`Only ${userLimits.dailyRemaining} uploads left today`, 'error');
        return;
    }
    
    if (files.length > userLimits.monthlyRemaining) {
        showToast(`Only ${userLimits.monthlyRemaining} uploads left this month`, 'error');
        return;
    }
    
    selectedFiles = Array.from(files);
    imagePreviews.innerHTML = '';
    
    if (selectedFiles.length === 0) return;
    
    selectedFiles.forEach((file, index) => {
        if (!file.type.match('image.*')) {
            showToast('Please select only images', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <span class="preview-index">${index + 1}</span>
            `;
            imagePreviews.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
    
    showToast(`${selectedFiles.length} image(s) selected`, 'success');
}

// Upload function
async function uploadImagesWithAnimation() {
    if (selectedFiles.length === 0) {
        showToast('Select at least one image', 'error');
        return;
    }
    
    if (selectedFiles.length > userLimits.dailyRemaining) {
        showToast(`Only ${userLimits.dailyRemaining} uploads left today`, 'error');
        return;
    }
    
    if (selectedFiles.length > userLimits.monthlyRemaining) {
        showToast(`Only ${userLimits.monthlyRemaining} uploads left this month`, 'error');
        return;
    }
    
    uploadBtn.classList.add('processing');
    uploadBtn.disabled = true;
    
    resultContainer.innerHTML = '';
    progressBar.style.width = '0%';
    
    const results = [];
    const imageData = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.error) throw new Error(data.error.message);
            
            imageData.push({
                publicId: data.public_id,
                url: data.secure_url,
                fileName: file.name
            });
            
            results.push({ 
                file: file.name, 
                url: data.secure_url, 
                publicId: data.public_id 
            });
            
            progressBar.style.width = `${((i + 1) / selectedFiles.length) * 100}%`;
            
        } catch (error) {
            results.push({ file: file.name, error: error.message });
        }
    }
    
    if (imageData.length > 0) {
        await trackUploads(imageData);
    }
    
    displayResults(results);
    saveToHistory(results.filter(r => !r.error));
    
    selectedFiles = [];
    imagePreviews.innerHTML = '';
    
    uploadBtn.classList.remove('processing');
    uploadBtn.disabled = false;
    
    setTimeout(() => {
        scrollToResults();
        highlightCopyButtons();
    }, 500);
}

// Display results
function displayResults(results) {
    if (results.length === 0) return;
    
    resultContainer.innerHTML = '';
    
    results.forEach(result => {
        if (result.error) {
            resultContainer.innerHTML += `
                <div class="url-item">
                    <i class="fas fa-exclamation-triangle" style="color: #e63946; font-size: 1.5rem;"></i>
                    <div class="url-details">
                        <strong>${result.file}</strong>
                        <p style="color: #e63946;">Error: ${result.error}</p>
                    </div>
                </div>
            `;
        } else {
            const deleteDate = new Date();
            deleteDate.setDate(deleteDate.getDate() + userLimits.autoDeleteDays);
            
            resultContainer.innerHTML += `
                <div class="url-item">
                    <img src="${result.url}" alt="Uploaded image" loading="lazy">
                    <div class="url-details">
                        <strong>${result.file}</strong>
                        <p class="url-text">${result.url}</p>
                        <small style="color: #888;">
                            <i class="fas fa-clock"></i> Auto-deletes: ${deleteDate.toLocaleDateString()}
                        </small>
                    </div>
                    <div class="url-actions">
                        <button class="action-btn" onclick="enhancedCopyToClipboard('${result.url}', this)">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="removeFromUI('${result.publicId}', '${result.url}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    });
}

// Remove from UI only (not from Cloudinary)
async function removeFromUI(publicId, url) {
    if (confirm('This will remove the image from your history only. It will still be auto-deleted from Cloudinary after ' + userLimits.autoDeleteDays + ' days. Continue?')) {
        
        // Remove from local storage
        let history = JSON.parse(localStorage.getItem('imageUrls')) || [];
        history = history.filter(item => item.url !== url);
        localStorage.setItem('imageUrls', JSON.stringify(history));
        
        // Remove from UI
        removeImageFromUI(url);
        
        // Optionally notify worker (but don't delete from Cloudinary)
        try {
            await fetch(`${WORKER_URL}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin
                },
                body: JSON.stringify({ publicId })
            });
        } catch (error) {
            console.error('Failed to notify worker:', error);
        }
        
        showToast('Removed from your history. Auto-delete in ' + userLimits.autoDeleteDays + ' days', 'success');
    }
}

// Remove image from UI
function removeImageFromUI(url) {
    document.querySelectorAll('.url-item').forEach(item => {
        const urlText = item.querySelector('.url-text');
        if (urlText && urlText.textContent === url) {
            item.remove();
        }
    });
    
    document.querySelectorAll('#urlHistory .url-item').forEach(item => {
        const urlText = item.querySelector('.url-text');
        if (urlText && urlText.textContent === url) {
            item.remove();
        }
    });
    
    if (document.querySelectorAll('.url-item').length === 0) {
        resultContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-link"></i>
                <p>No URLs generated yet</p>
            </div>
        `;
    }
}

// Copy to clipboard
function enhancedCopyToClipboard(text, button = null) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('URL copied!', 'success');
        
        if (button) {
            const originalHtml = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = 'var(--success)';
            
            setTimeout(() => {
                button.innerHTML = originalHtml;
                button.style.background = '';
            }, 2000);
        }
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// Save to history
function saveToHistory(results) {
    if (results.length === 0) return;
    
    let history = JSON.parse(localStorage.getItem('imageUrls')) || [];
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() + userLimits.autoDeleteDays);
    
    results.forEach(result => {
        if (!history.some(item => item.url === result.url)) {
            history.unshift({
                url: result.url,
                name: result.file,
                publicId: result.publicId,
                timestamp: new Date().toISOString(),
                deleteDate: deleteDate.toISOString()
            });
        }
    });
    
    history = history.slice(0, 50);
    localStorage.setItem('imageUrls', JSON.stringify(history));
}

// Load history
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('imageUrls')) || [];
    urlHistory.innerHTML = '';
    
    if (history.length === 0) {
        urlHistory.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <p>No history yet</p>
            </div>
        `;
        return;
    }
    
    history.forEach(item => {
        const date = new Date(item.timestamp);
        const deleteDate = item.deleteDate ? new Date(item.deleteDate) : null;
        
        urlHistory.innerHTML += `
            <div class="url-item">
                <img src="${item.url}" alt="History image" loading="lazy">
                <div class="url-details">
                    <strong>${item.name}</strong>
                    <p>${date.toLocaleString()}</p>
                    ${deleteDate ? 
                        `<p style="color: #888; font-size: 0.85rem;">
                            <i class="fas fa-clock"></i> Auto-deletes: ${deleteDate.toLocaleDateString()}
                        </p>` : 
                        ''}
                </div>
                <div class="url-actions">
                    <button class="action-btn" onclick="enhancedCopyToClipboard('${item.url}', this)">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="removeFromUI('${item.publicId}', '${item.url}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

// Check scheduled deletions (local only)
function checkScheduledDeletions() {
    // This now only checks for local cleanup
    // Cloudinary auto-deletion handled by worker
}

// Scroll to results
function scrollToResults() {
    const resultsSection = document.querySelector('.main-content .card:nth-child(2)');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Highlight copy buttons
function highlightCopyButtons() {
    const copyButtons = document.querySelectorAll('.action-btn');
    copyButtons.forEach(button => {
        button.style.animation = 'pulse 2s infinite';
    });
    
    setTimeout(() => {
        copyButtons.forEach(button => {
            button.style.animation = '';
        });
    }, 5000);
}

// Add pulse animation
function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(67, 97, 238, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .processing {
            position: relative;
            overflow: hidden;
        }
        
        .processing::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: processing 1.5s infinite;
        }
        
        @keyframes processing {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .preview-index {
            position: absolute;
            top: 5px;
            right: 5px;
            background: var(--primary);
            color: white;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

// Add scroll to top button
function addScrollToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        border: none;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        cursor: pointer;
        z-index: 99;
        display: none;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    `;
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        btn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    });
}

// Show toast
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}