    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    
    // Check for saved theme or prefer-color-scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
      if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
      } else {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
      }
    }
    
    // Set active expiry option
    document.querySelectorAll('.expiry-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelectorAll('.expiry-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('expiryDays').value = this.getAttribute('data-days');
      });
    });

    // Worker API URL
    const WORKER_API = 'https://url.aarif753alam.workers.dev';

    async function createShortURL() {
      const longURL = document.getElementById('longURL').value.trim();
      const customKey = document.getElementById('customKey').value.trim();
      const expiryDays = document.getElementById('expiryDays').value;
      const createBtn = document.getElementById('createBtn');
      
      // Clear previous results and errors
      document.getElementById('error').style.display = 'none';
      document.getElementById('resultContainer').style.display = 'none';
      
      // Show enhanced loading animation
      document.getElementById('loadingContainer').style.display = 'block';
      document.getElementById('loadingText').textContent = 'Processing your URL...';
      document.getElementById('loadingSubtext').textContent = 'This may take a few seconds';
      
      // Disable create button
      createBtn.disabled = true;
      createBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

      // Validation
      if (!longURL) {
        showError('Please enter a destination URL.');
        resetButton();
        return;
      }

      // Basic URL validation
      try {
        const url = new URL(longURL);
        if (!url.protocol || !url.hostname) {
          throw new Error('Invalid URL');
        }
      } catch (e) {
        showError('Please enter a valid URL (include http:// or https://)');
        resetButton();
        return;
      }

      try {
        // Show processing steps with delay for better UX
        let step = 1;
        const steps = [
          'Validating URL...',
          'Checking availability...',
          'Generating short link...',
          'Finalizing...'
        ];
        
        const interval = setInterval(() => {
          if (step < steps.length) {
            document.getElementById('loadingText').textContent = steps[step];
            step++;
          }
        }, 800);

        const response = await fetch(WORKER_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            longURL, 
            customKey: customKey || undefined,
            expiryDays 
          })
        });

        clearInterval(interval);
        
        const data = await response.json();
        
        // Hide loading container
        document.getElementById('loadingContainer').style.display = 'none';
        createBtn.disabled = false;
        createBtn.innerHTML = '<i class="fas fa-bolt"></i> Create Short URL';

        if (!response.ok || !data.success) {
          showError(data.error || 'Failed to create short URL. Please try again.');
          return;
        }

        // Display result
        displayResult(data);
        
      } catch (error) {
        document.getElementById('loadingContainer').style.display = 'none';
        createBtn.disabled = false;
        createBtn.innerHTML = '<i class="fas fa-bolt"></i> Create Short URL';
        console.error('Error:', error);
        showError('Network error. Please check your connection and try again.');
      }
    }
    
    function resetButton() {
      const createBtn = document.getElementById('createBtn');
      document.getElementById('loadingContainer').style.display = 'none';
      createBtn.disabled = false;
      createBtn.innerHTML = '<i class="fas fa-bolt"></i> Create Short URL';
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
      document.getElementById('loadingContainer').style.display = 'none';
      
      // Reset expiry to default
      document.querySelectorAll('.expiry-option').forEach(opt => opt.classList.remove('active'));
      document.querySelector('.expiry-option[data-days="30"]').classList.add('active');
      document.getElementById('expiryDays').value = '30';
      
      // Reset button
      const createBtn = document.getElementById('createBtn');
      createBtn.disabled = false;
      createBtn.innerHTML = '<i class="fas fa-bolt"></i> Create Short URL';
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

    async function viewAnalytics() {
      if (!window.shortURLData) return;
      
      try {
        const response = await fetch(`${WORKER_API}/analytics/${window.shortURLData.key}`);
        const data = await response.json();
        
        if (data.success) {
          const analytics = data.analytics;
          alert(`ðŸ“Š Analytics for: ${window.shortURLData.shortURL}\n\n` +
                `ðŸ“… Created: ${new Date(analytics.created).toLocaleString()}\n` +
                `ðŸ‘† Clicks: ${analytics.clicks}\n` +
                `â° Last Accessed: ${analytics.lastAccessed ? new Date(analytics.lastAccessed).toLocaleString() : 'Never'}\n` +
                `â³ Expires: ${analytics.expiry ? new Date(analytics.expiry).toLocaleDateString() : 'Never'}\n\n` +
                `ðŸ”— Original URL: ${analytics.longURL.substring(0, 50)}${analytics.longURL.length > 50 ? '...' : ''}`);
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

    // Initialize theme on load
    document.addEventListener('DOMContentLoaded', function() {
      // Optional: Add example URL placeholder
      // document.getElementById('longURL').placeholder = 'https://example.com/very-long-url-that-needs-shortening';
    });