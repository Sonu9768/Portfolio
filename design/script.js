document.addEventListener('DOMContentLoaded', () => {
  // Custom Cursor
  const cursor = document.getElementById('custom-cursor');
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const interactiveElements = document.querySelectorAll('a, .poster-item, .close-btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // Hero Animation
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(".hero-content", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }

  // Load Posters dynamically
  const grid = document.getElementById('poster-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('close-lightbox');

  // We check up to 50 numerical filenames to make it easy for you to just drag and drop
  const maxPostersToCheck = 50; 
  let loadedCount = 0;

  // USER: If you have specific names, add them to this array:
  // Example: const customPosters = ['my-poster.jpg', 'event-flyer.png'];
  const customPosters = []; 

  async function checkImageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  function getPosterId(src) {
    return src.replace('posters/', '').replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  }

  function getBaseLikes(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    const x = Math.sin(hash + 1.2345) * 10000;
    const fraction = x - Math.floor(x);
    return 100 + Math.floor(fraction * 401); 
  }

  function createPosterElement(src) {
    const posterId = getPosterId(src);
    const baseLikes = getBaseLikes(posterId);
    return `
      <div class="poster-item" data-src="${src}">
        <img src="${src}" alt="Design Poster" loading="lazy">
        <div class="poster-overlay">
          <div class="overlay-content">
            <span class="view-text">View Full</span>
            <button class="like-btn" data-id="${posterId}" data-base="${baseLikes}">
              <i class="fas fa-heart"></i> <span class="like-count">${baseLikes}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function attachLightboxEvents() {
    const items = document.querySelectorAll('.poster-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.like-btn')) return; // Don't open lightbox if clicking like
        const src = item.getAttribute('data-src');
        lightboxImg.src = src;
        lightbox.classList.add('active');
      });
      // Add cursor interaction to dynamically added items
      item.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      });
      item.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });

    // Attach Like Button Events
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
      const posterId = btn.getAttribute('data-id');
      const baseLikes = parseInt(btn.getAttribute('data-base'), 10);
      const countSpan = btn.querySelector('.like-count');
      
      // Fetch actual upvotes
      fetch(`https://api.counterapi.dev/v1/sonu-portfolio-designs/${posterId}`)
        .then(res => {
          if (!res.ok) return null;
          return res.json();
        })
        .then(data => {
          let realCount = 0;
          if(data && data.count) realCount = data.count;
          countSpan.textContent = baseLikes + realCount;
        })
        .catch(err => console.error('Failed to fetch likes:', err));

      // Check if already liked in local storage
      if (localStorage.getItem(`liked_poster_${posterId}`)) {
        btn.classList.add('liked');
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btn.classList.contains('liked')) return; // already liked
        
        // Optimistic update
        btn.classList.add('liked');
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
        localStorage.setItem(`liked_poster_${posterId}`, 'true');

        // Increment on API
        fetch(`https://api.counterapi.dev/v1/sonu-portfolio-designs/${posterId}/up`)
          .then(res => {
            if (!res.ok) return null;
            return res.json();
          })
          .then(data => {
            if(data && data.count) countSpan.textContent = baseLikes + data.count;
          })
          .catch(err => console.error('Failed to increment likes:', err));
      });
    });
  }

  async function loadPosters() {
    let htmlContent = '';
    
    // First, load from custom array if user added any
    for(const filename of customPosters) {
      htmlContent += createPosterElement(`posters/${filename}`);
      loadedCount++;
    }

    // Then, sequentially check 1.jpg, 2.jpg...
    for (let i = 1; i <= maxPostersToCheck; i++) {
      const exts = ['.jpg', '.png', '.webp', '.jpeg'];
      let found = false;
      
      for (const ext of exts) {
        const url = `posters/${i}${ext}`;
        const exists = await checkImageExists(url);
        if (exists) {
          htmlContent += createPosterElement(url);
          loadedCount++;
          found = true;
          break; // move to next number once found
        }
      }
      // If we didn't find the image, we just keep going just in case they skipped a number.
    }

    if (loadedCount === 0) {
      grid.innerHTML = '<p style="color: #a0a0a0; text-align: center; grid-column: 1/-1;">No posters found yet. Add your designs to the "posters" folder and name them 1.jpg, 2.jpg, etc.</p>';
    } else {
      grid.innerHTML = htmlContent;
      attachLightboxEvents();
      
      // Animate posters in
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(".poster-item", 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.5 }
        );
      }
    }
  }

  // Close Lightbox
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
      setTimeout(() => { lightboxImg.src = ''; }, 400); // clear after transition
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => { lightboxImg.src = ''; }, 400);
      }
    });
  }

  // Init
  loadPosters();
});
