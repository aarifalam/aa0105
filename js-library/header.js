document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var navLinks = document.getElementById('navLinks');
  
  mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ?
      '<i class="fas fa-times"></i>' : 
      '<i class="fas fa-bars"></i>';
  });
  
  // Close mobile menu when clicking on a link
  var navLinksAll = document.querySelectorAll('.entireai-nav-links a');
  var closeMenuHandler = function() {
    if (window.innerWidth <= 992) {
      navLinks.classList.remove('active');
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  };
  
  for (var i = 0; i < navLinksAll.length; i++) {
    navLinksAll[i].addEventListener('click', closeMenuHandler);
  }
  
  // Scroll Progress Indicator
  var scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', function() {
      var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (window.pageYOffset / windowHeight) * 100;
      scrollProgress.style.width = scrolled + '%';
    });
  }
  
  // Header hide/show on scroll with shrink effect
  var header = document.querySelector('.entireai-main-header');
  var lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    var currentScroll = window.pageYOffset;
    
    // Add scrolled class for shrink effect
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show on scroll
    if (currentScroll <= 0) {
      header.style.transform = 'translateY(0)';
    }
    
    if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
      header.style.transform = 'translateY(-100%)';
    } else if (currentScroll < lastScroll) {
      header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
  
  // Enhanced Search Functionality
  var searchInput = document.getElementById('searchInput');
  var searchButton = document.getElementById('searchButton');
  var searchResults = document.getElementById('searchResults');
  var mobileSearchBtn = document.getElementById('mobileSearchBtn');
  var headerSearch = document.querySelector('.entireai-header-search');
  
  // Updated search data with full PDF tools paths
  var searchData = [
    // Blog & Contact
  {
    title: "Home",
    url: "/index.html",
    description: "EntireAI homepage",
    keywords: "home, entireai"
  },

  // Image Tools
  {
    title: "Image to URL",
    url: "/tools/image-to-url.html",
    description: "Image to direct link",
    keywords: "image url, link"
  },
  {
    title: "Compress Image",
    url: "/tools/compress-image.html",
    description: "Reduce image size",
    keywords: "compress image"
  },
  {
    title: "Image Converter",
    url: "/tools/image-converter.html",
    description: "Convert image formats",
    keywords: "image converter"
  },
  {
    title: "Drawing Pad",
    url: "/tools/drawing.html",
    description: "Online drawing tool",
    keywords: "drawing, sketch"
  },
  {
    title: "Sequence Rename",
    url: "/tools/image-rename.html",
    description: "Rename images in order",
    keywords: "image rename"
  },

  // URL & Card
  {
    title: "URL Shortener",
    url: "/card/url-shortener.html",
    description: "Shorten long links",
    keywords: "short url"
  },
  {
    title: "Greeting Card",
    url: "/card/index.html",
    description: "Create greeting cards",
    keywords: "greeting card"
  },

  // PDF Main
  {
    title: "PDF Tools",
    url: "/pdf/index.html",
    description: "All PDF tools",
    keywords: "pdf tools"
  },

  // PDF – Popular
  {
    title: "Image to PDF",
    url: "/pdf/image-to-pdf.html",
    description: "JPG/PNG to PDF",
    keywords: "image to pdf"
  },
  {
    title: "PDF to Image",
    url: "/pdf/pdf-to-image.html",
    description: "PDF to JPG/PNG",
    keywords: "pdf to image"
  },
  {
    title: "Merge PDF",
    url: "/pdf/merge-pdf.html",
    description: "Combine PDFs",
    keywords: "merge pdf"
  },
  {
    title: "Split PDF",
    url: "/pdf/split-pdf.html",
    description: "Split PDF pages",
    keywords: "split pdf"
  },
  {
    title: "Remove PDF Page",
    url: "/pdf/remove-pdf-page.html",
    description: "Delete PDF pages",
    keywords: "remove pdf page"
  },

  // PDF – Conversion / Edit
  {
    title: "PDF Reorder Pages",
    url: "/pdf/pdf-reorder.html",
    description: "Rearrange pages",
    keywords: "pdf reorder"
  },
  {
    title: "Text to PDF",
    url: "/pdf/text-to-pdf.html",
    description: "Text to PDF",
    keywords: "text to pdf"
  },
  {
    title: "PDF Image Watermark",
    url: "/pdf/pdf-image-watermark.html",
    description: "Image watermark",
    keywords: "pdf watermark image"
  },
  {
    title: "PDF Text Watermark",
    url: "/pdf/pdf-text-watermark.html",
    description: "Text watermark",
    keywords: "pdf watermark text"
  },
  {
    title: "Contact us",
    url: "/footer/contact-us/contact.html",
    description: "contact details",
    keywords: "contact"
  }


];

  
  // Mobile search toggle
  mobileSearchBtn.addEventListener('click', function() {
    headerSearch.classList.toggle('active');
    if (headerSearch.classList.contains('active')) {
      searchInput.focus();
    }
  });
  
  // Function to perform search with debounce
  var searchTimeout;
  function performSearch(query) {
    clearTimeout(searchTimeout);
    
    if (!query.trim()) {
      searchResults.style.display = 'none';
      return;
    }
    
    // Add loading state
    searchButton.classList.add('entireai-search-loading');
    
    searchTimeout = setTimeout(function() {
      var lowerQuery = query.toLowerCase();
      var results = searchData.filter(function(item) {
        return item.title.toLowerCase().indexOf(lowerQuery) !== -1 || 
               item.description.toLowerCase().indexOf(lowerQuery) !== -1 ||
               item.keywords.toLowerCase().indexOf(lowerQuery) !== -1;
      });
      
      // Remove loading state
      searchButton.classList.remove('entireai-search-loading');
      
      displayResults(results);
    }, 300);
  }
  
  // Function to display results
  function displayResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="entireai-no-results">No results found. Try different keywords.</div>';
    } else {
      for (var j = 0; j < results.length; j++) {
        var result = results[j];
        var link = document.createElement('a');
        link.href = result.url;
        link.className = 'entireai-search-result-item';
        link.innerHTML = 
          '<h4>' + result.title + '</h4>' +
          '<p>' + result.description + '</p>' +
          '<small>' + result.url + '</small>';
        searchResults.appendChild(link);
      }
    }
    
    searchResults.style.display = 'block';
  }
  
  // Event listeners
  searchInput.addEventListener('input', function() {
    performSearch(searchInput.value);
  });
  
  searchButton.addEventListener('click', function(e) {
    e.preventDefault();
    performSearch(searchInput.value);
  });
  
  // Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var results = Array.prototype.slice.call(searchResults.querySelectorAll('.entireai-search-result-item'));
      if (results.length > 0) {
        window.location.href = results[0].href;
      }
    }
    
    if (e.key === 'Escape') {
      searchResults.style.display = 'none';
      searchInput.blur();
    }
    
    // Arrow key navigation through results
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var items = searchResults.querySelectorAll('.entireai-search-result-item');
      if (items.length === 0) return;
      
      var currentIndex = -1;
      for (var k = 0; k < items.length; k++) {
        if (items[k] === document.activeElement) {
          currentIndex = k;
          break;
        }
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          items[currentIndex + 1].focus();
        } else {
          items[0].focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          items[currentIndex - 1].focus();
        } else {
          items[items.length - 1].focus();
        }
      }
    }
  });
  
  // Close results when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.entireai-header-search') && !e.target.closest('#mobileSearchBtn')) {
      searchResults.style.display = 'none';
      if (window.innerWidth <= 992) {
        headerSearch.classList.remove('active');
      }
    }
  });

  // Add active state to current page in navigation
  function setActiveNavLink() {
    var currentPage = window.location.pathname;
    var navLinks = document.querySelectorAll('.entireai-nav-links a');
    
    for (var i = 0; i < navLinks.length; i++) {
      var link = navLinks[i];
      var linkPath = link.getAttribute('href');
      
      // Remove active class from all links
      link.classList.remove('active');
      
      // Add active class to current page link
      if (currentPage.endsWith(linkPath) || 
          (linkPath === 'index.html' && (currentPage.endsWith('/') || currentPage.endsWith('/index.html')))) {
        link.classList.add('active');
      }
    }
  }
  
  // Set active nav link on page load
  setActiveNavLink();
});
