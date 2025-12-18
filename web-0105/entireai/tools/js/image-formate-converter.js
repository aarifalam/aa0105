        document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const fileCount = document.getElementById('file-count');
    const clearFilesBtn = document.getElementById('clear-files');
    const previewSection = document.getElementById('preview-section');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const formatSelect = document.getElementById('format');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const convertBtn = document.getElementById('convert-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const statusMessage = document.getElementById('status-message');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const outputSection = document.getElementById('output-section');
    const downloadZipBtn = document.getElementById('download-zip');

    // State variables
    let uploadedFiles = [];
    let convertedFiles = [];

    // Event Listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    clearFilesBtn.addEventListener('click', clearFiles);
    resetBtn.addEventListener('click', resetApp);
    convertBtn.addEventListener('click', convertImages);
    downloadBtn.addEventListener('click', downloadAllImages);
    downloadZipBtn.addEventListener('click', downloadZip);
    qualitySlider.addEventListener('input', updateQualityValue);
    formatSelect.addEventListener('change', toggleQualityOption);

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('highlight');
    }

    function unhighlight() {
        uploadArea.classList.remove('highlight');
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Initialize quality display
    toggleQualityOption();

    // Functions
    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length === 0) return;
        
        // Filter only image files
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            showError('Please select valid image files (JPG, PNG, WebP, BMP, etc.)');
            return;
        }
        
        uploadedFiles = [...uploadedFiles, ...imageFiles];
        updateFileInfo();
        generateThumbnails();
        convertBtn.disabled = false;
        uploadArea.classList.add('pulse');
        setTimeout(() => uploadArea.classList.remove('pulse'), 500);
    }

    function updateFileInfo() {
        fileCount.textContent = `${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''}`;
        fileInfo.style.display = 'flex';
    }

    function generateThumbnails() {
        thumbnailContainer.innerHTML = '';
        
        if (uploadedFiles.length === 0) {
            previewSection.style.display = 'none';
            return;
        }
        
        previewSection.style.display = 'block';
        
        uploadedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const thumbnailItem = document.createElement('div');
                thumbnailItem.className = 'thumbnail-item';
                thumbnailItem.draggable = true;
                thumbnailItem.dataset.index = index;
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                
                const thumbnailInfo = document.createElement('div');
                thumbnailInfo.className = 'thumbnail-info';
                thumbnailInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
                
                const thumbnailActions = document.createElement('div');
                thumbnailActions.className = 'thumbnail-actions';
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'thumbnail-btn';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.title = 'Remove this image';
                removeBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    removeFile(index);
                });
                
                thumbnailActions.appendChild(removeBtn);
                thumbnailItem.appendChild(img);
                thumbnailItem.appendChild(thumbnailInfo);
                thumbnailItem.appendChild(thumbnailActions);
                
                // Drag and drop for reordering
                thumbnailItem.addEventListener('dragstart', handleDragStart);
                thumbnailItem.addEventListener('dragover', handleDragOver);
                thumbnailItem.addEventListener('drop', handleDropItem);
                thumbnailItem.addEventListener('dragend', handleDragEnd);
                
                thumbnailContainer.appendChild(thumbnailItem);
            };
            reader.readAsDataURL(file);
        });
    }

    function handleDragStart(e) {
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.dataset.index);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDropItem(e) {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(this.dataset.index);
        
        if (fromIndex !== toIndex) {
            // Reorder the files array
            const movedFile = uploadedFiles.splice(fromIndex, 1)[0];
            uploadedFiles.splice(toIndex, 0, movedFile);
            
            // Regenerate thumbnails
            generateThumbnails();
        }
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
    }

    function removeFile(index) {
        uploadedFiles.splice(index, 1);
        
        if (uploadedFiles.length === 0) {
            fileInfo.style.display = 'none';
            previewSection.style.display = 'none';
            convertBtn.disabled = true;
        } else {
            updateFileInfo();
            generateThumbnails();
        }
    }

    function clearFiles() {
        uploadedFiles = [];
        fileInfo.style.display = 'none';
        previewSection.style.display = 'none';
        convertBtn.disabled = true;
        hideOutput();
    }

    function resetApp() {
        clearFiles();
        convertedFiles = [];
        formatSelect.value = 'jpg';
        qualitySlider.value = 90;
        qualityValue.textContent = '90%';
        document.getElementById('preserve-exif').checked = true;
        document.getElementById('maintain-name').checked = false;
        hideMessages();
        hideOutput();
    }

    function convertImages() {
        if (uploadedFiles.length === 0) {
            showError('Please select at least one image to convert');
            return;
        }
        
        hideMessages();
        progressContainer.style.display = 'block';
        statusMessage.textContent = 'Converting images...';
        
        const outputFormat = formatSelect.value;
        const quality = parseInt(qualitySlider.value) / 100;
        const preserveExif = document.getElementById('preserve-exif').checked;
        const maintainName = document.getElementById('maintain-name').checked;
        
        convertedFiles = [];
        let processed = 0;
        
        uploadedFiles.forEach((file, index) => {
            convertImage(file, outputFormat, quality, preserveExif, maintainName)
                .then(convertedFile => {
                    convertedFiles.push(convertedFile);
                    processed++;
                    
                    // Update progress
                    const progress = (processed / uploadedFiles.length) * 100;
                    progressBar.style.width = `${progress}%`;
                    
                    if (processed === uploadedFiles.length) {
                        // All files processed
                        setTimeout(() => {
                            progressContainer.style.display = 'none';
                            statusMessage.textContent = '';
                            showSuccess(`Successfully converted ${uploadedFiles.length} image${uploadedFiles.length !== 1 ? 's' : ''}`);
                            outputSection.style.display = 'block';
                            downloadBtn.disabled = false;
                            
                            // NEW: Scroll to the download section after conversion
                            outputSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start'
                            });
                        }, 500);
                    }
                })
                .catch(error => {
                    processed++;
                    console.error('Conversion error:', error);
                    
                    if (processed === uploadedFiles.length) {
                        progressContainer.style.display = 'none';
                        statusMessage.textContent = '';
                    }
                    
                    showError(`Failed to convert ${file.name}: ${error.message}`);
                });
        });
    }

    function convertImage(file, outputFormat, quality, preserveExif, maintainName) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    // Convert to desired format
                    let mimeType;
                    switch(outputFormat) {
                        case 'jpg':
                            mimeType = 'image/jpeg';
                            break;
                        case 'png':
                            mimeType = 'image/png';
                            break;
                        case 'webp':
                            mimeType = 'image/webp';
                            break;
                        case 'bmp':
                            mimeType = 'image/bmp';
                            break;
                        default:
                            mimeType = 'image/jpeg';
                    }
                    
                    // Get the converted data URL
                    let dataURL;
                    try {
                        if (outputFormat === 'jpg' || outputFormat === 'webp') {
                            dataURL = canvas.toDataURL(mimeType, quality);
                        } else {
                            dataURL = canvas.toDataURL(mimeType);
                        }
                    } catch (error) {
                        reject(error);
                        return;
                    }
                    
                    // Convert data URL to Blob
                    const blob = dataURLToBlob(dataURL);
                    
                    // Create file name
                    let fileName;
                    if (maintainName) {
                        const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
                        fileName = `${originalName}.${outputFormat}`;
                    } else {
                        fileName = `converted-image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${outputFormat}`;
                    }
                    
                    // Create File object from Blob
                    const convertedFile = new File([blob], fileName, { type: mimeType });
                    
                    resolve(convertedFile);
                };
                img.onerror = function() {
                    reject(new Error('Failed to load image'));
                };
                img.src = e.target.result;
            };
            reader.onerror = function() {
                reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
        });
    }

    function dataURLToBlob(dataURL) {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const uInt8Array = new Uint8Array(raw.length);
        
        for (let i = 0; i < raw.length; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        
        return new Blob([uInt8Array], { type: contentType });
    }

    function downloadAllImages() {
        if (convertedFiles.length === 0) {
            showError('No converted files available. Please convert images first.');
            return;
        }
        
        convertedFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    function downloadZip() {
        if (convertedFiles.length === 0) {
            showError('No converted files available. Please convert images first.');
            return;
        }
        
        statusMessage.textContent = 'Creating ZIP file...';
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        
        const zip = new JSZip();
        const folder = zip.folder('converted-images');
        
        let added = 0;
        
        convertedFiles.forEach(file => {
            folder.file(file.name, file);
            added++;
            
            // Update progress
            const progress = (added / convertedFiles.length) * 100;
            progressBar.style.width = `${progress}%`;
            
            if (added === convertedFiles.length) {
                zip.generateAsync({ type: 'blob' })
                    .then(blob => {
                        progressBar.style.width = '100%';
                        setTimeout(() => {
                            progressContainer.style.display = 'none';
                            statusMessage.textContent = '';
                            
                            // Download the ZIP file
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'converted-images.zip';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            
                            showSuccess('ZIP file downloaded successfully!');
                        }, 500);
                    })
                    .catch(error => {
                        progressContainer.style.display = 'none';
                        statusMessage.textContent = '';
                        showError('Failed to create ZIP file: ' + error.message);
                    });
            }
        });
    }

    function updateQualityValue() {
        qualityValue.textContent = `${qualitySlider.value}%`;
    }

    function toggleQualityOption() {
        const format = formatSelect.value;
        const qualityRow = document.getElementById('quality-row');
        
        if (format === 'jpg' || format === 'webp') {
            qualityRow.style.display = 'flex';
        } else {
            qualityRow.style.display = 'none';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(hideMessages, 5000);
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        setTimeout(hideMessages, 5000);
    }

    function hideMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }

    function hideOutput() {
        outputSection.style.display = 'none';
        downloadBtn.disabled = true;
    }
});