    // Set active expiry option
    document.querySelectorAll('.expiry-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelectorAll('.expiry-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('expiryDays').value = this.getAttribute('data-days');
      });
    });

    // Worker API URL - Update this to your Worker URL
    const WORKER_API = 'https://url.aarif753alam.workers.dev';

    async function createShortURL() {
      const longURL = document.getElementById('longURL').value.trim();
      const customKey = document.getElementById('customKey').value.trim();
      const expiryDays = document.getElementById('expiryDays').value;

      // Clear previous results and errors
      document.getElementById('error').style.display = 'none';
      document.getElementById('resultContainer').style.display = 'none';
      document.getElementById('qrContainer').style.display = 'none';
      document.getElementById('loading').style.display = 'block';

      // Validation
      if (!longURL) {
        showError('Please enter a destination URL.');
        return;
      }

      // Basic URL validation
      try {
        // Try to create URL object, will fail if invalid
        const url = new URL(longURL);
        if (!url.protocol || !url.hostname) {
          throw new Error('Invalid URL');
        }
      } catch (e) {
        showError('Please enter a valid URL (include http:// or https://)');
        return;
      }

      try {
        const response = await fetch(WORKER_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            longURL, 
            customKey: customKey || undefined,
            expiryDays 
          })
        });

        const data = await response.json();
        
        document.getElementById('loading').style.display = 'none';

        if (!response.ok || !data.success) {
          showError(data.error || 'Failed to create short URL. Please try again.');
          return;
        }

        // Display result
        displayResult(data);
        
      } catch (error) {
        document.getElementById('loading').style.display = 'none';
        console.error('Error:', error);
        showError('Network error. Please check your connection and try again.');
      }
    }

    function displayResult(data) {
      const resultContainer = document.getElementById('resultContainer');
      const shortURLDisplay = document.getElementById('shortURLDisplay');
      const createdDate = document.getElementById('createdDate');
      const expiryDate = document.getElementById('expiryDate');
      const clickCount = document.getElementById('clickCount');
      
      // Set data
      shortURLDisplay.innerHTML = `<a href="${data.shortURL}" target="_blank">${data.shortURL}</a>`;
      clickCount.textContent = data.clicks;
      
      // Format dates
      const created = new Date(data.created);
      createdDate.textContent = created.toLocaleDateString();
      
      // Calculate expiry date
      if (data.expiry) {
        const expiry = new Date(data.expiry);
        expiryDate.textContent = expiry.toLocaleDateString();
      } else {
        expiryDate.textContent = 'Never';
      }
      
      // Store data for analytics
      window.shortURLData = data;
      
      // Show result container
      resultContainer.style.display = 'block';
      
      // Smooth scroll to results
      setTimeout(() => {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }

    function showError(message) {
      const errorElement = document.getElementById('error');
      errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
      errorElement.style.display = 'block';
      document.getElementById('loading').style.display = 'none';
      
      // Hide error after 5 seconds
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 5000);
    }

    function clearForm() {
      document.getElementById('longURL').value = '';
      document.getElementById('customKey').value = '';
      document.getElementById('error').style.display = 'none';
      document.getElementById('resultContainer').style.display = 'none';
      document.getElementById('qrContainer').style.display = 'none';
      
      // Reset expiry to default
      document.querySelectorAll('.expiry-option').forEach(opt => opt.classList.remove('active'));
      document.querySelector('.expiry-option[data-days="30"]').classList.add('active');
      document.getElementById('expiryDays').value = '30';
    }

    function copyShortURL() {
      if (!window.shortURLData) return;
      
      navigator.clipboard.writeText(window.shortURLData.shortURL)
        .then(() => {
          // Visual feedback
          const copyBtn = document.querySelector('.action-btn.copy');
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          copyBtn.style.background = '#00b09b';
          
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
          }, 2000);
        })
        .catch(err => {
          showError('Failed to copy to clipboard');
        });
    }

    function generateQRCode() {
      if (!window.shortURLData) return;
      
      const qrContainer = document.getElementById('qrContainer');
      const qrcodeElement = document.getElementById('qrcode');
      
      // Clear previous QR code
      qrcodeElement.innerHTML = '';
      
      // Generate new QR code
      QRCode.toCanvas(qrcodeElement, window.shortURLData.shortURL, {
        width: 200,
        height: 200,
        color: {
          dark: '#6a11cb',
          light: '#ffffff'
        }
      }, function(error) {
        if (error) {
          showError('Failed to generate QR code');
        } else {
          qrContainer.style.display = 'block';
          qrContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    function downloadQRCode() {
      const canvas = document.querySelector('#qrcode canvas');
      if (!canvas) return;
      
      const link = document.createElement('a');
      link.download = `qr-${window.shortURLData.key}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    async function viewAnalytics() {
      if (!window.shortURLData) return;
      
      try {
        const response = await fetch(`${WORKER_API}/analytics/${window.shortURLData.key}`);
        const data = await response.json();
        
        if (data.success) {
          const analytics = data.analytics;
          alert(`📊 Analytics for: ${window.shortURLData.shortURL}\n\n` +
                `📅 Created: ${new Date(analytics.created).toLocaleString()}\n` +
                `👆 Clicks: ${analytics.clicks}\n` +
                `⏰ Last Accessed: ${analytics.lastAccessed ? new Date(analytics.lastAccessed).toLocaleString() : 'Never'}\n` +
                `⏳ Expires: ${analytics.expiry ? new Date(analytics.expiry).toLocaleDateString() : 'Never'}\n\n` +
                `🔗 Original URL: ${analytics.longURL.substring(0, 50)}${analytics.longURL.length > 50 ? '...' : ''}`);
        } else {
          showError('Failed to fetch analytics');
        }
      } catch (error) {
        console.error('Analytics error:', error);
        showError('Error fetching analytics data');
      }
    }

    // Add Enter key support
    document.getElementById('longURL').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        createShortURL();
      }
    });

    // Add input validation
    document.getElementById('customKey').addEventListener('input', function(e) {
      this.value = this.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    });

    // Initialize with example URL (optional)
    // document.getElementById('longURL').value = 'https://example.com';