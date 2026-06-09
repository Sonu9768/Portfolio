document.addEventListener('DOMContentLoaded', () => {
  // Custom Cursor with Smoke Effect
  const cursorDot = document.getElementById('custom-cursor');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Smoke Canvas Setup
  const smokeCanvas = document.createElement('canvas');
  smokeCanvas.id = 'smoke-canvas';
  smokeCanvas.style.position = 'fixed';
  smokeCanvas.style.top = '0';
  smokeCanvas.style.left = '0';
  smokeCanvas.style.width = '100vw';
  smokeCanvas.style.height = '100vh';
  smokeCanvas.style.pointerEvents = 'none';
  smokeCanvas.style.zIndex = '9998';
  document.body.appendChild(smokeCanvas);

  const smokeCtx = smokeCanvas.getContext('2d');
  let width, height;

  function resizeSmoke() {
    width = window.innerWidth;
    height = window.innerHeight;
    smokeCanvas.width = width;
    smokeCanvas.height = height;
  }
  window.addEventListener('resize', resizeSmoke);
  resizeSmoke();

  function createSmokeParticleTexture(colorRGB) {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, `rgba(${colorRGB}, 0.2)`);
    gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return c;
  }

  const textureOrange = createSmokeParticleTexture('255, 74, 0');
  let smokeParticles = [];

  class SmokeParticle {
    constructor(x, y, texture) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 20 + 20;
      this.texture = texture;
      this.alpha = 0.6;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5 - 0.5;
      this.growth = Math.random() * 0.8 + 0.2;
      this.decay = Math.random() * 0.015 + 0.005;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.size += this.growth;
      this.alpha -= this.decay;
    }
    draw(ctx) {
      ctx.globalAlpha = this.alpha;
      const half = this.size / 2;
      ctx.drawImage(this.texture, this.x - half, this.y - half, this.size, this.size);
    }
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    
    // Spawn smoke particles
    for (let i = 0; i < 2; i++) {
      smokeParticles.push(new SmokeParticle(mouseX, mouseY, textureOrange));
    }
  });

  function animateCursor() {
    smokeCtx.clearRect(0, 0, width, height);
    for (let i = 0; i < smokeParticles.length; i++) {
      smokeParticles[i].update();
      smokeParticles[i].draw(smokeCtx);
      if (smokeParticles[i].alpha <= 0) {
        smokeParticles.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactiveElements = document.querySelectorAll('a, .poster-item, .close-btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hover-link');
      for(let i=0; i<5; i++) {
        smokeParticles.push(new SmokeParticle(mouseX, mouseY, textureOrange));
      }
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hover-link');
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

  // We check up to 150 numerical filenames to make it easy for you to just drag and drop
  const maxPostersToCheck = 150; 
  let loadedCount = 0;

  // USER: If you have specific names, add them to this array:
  // We have pre-populated this with your non-numeric image names.
  const customPosters = [
    // Named posters
    '3moj.jpg', 'Untitled design.jpg', 'e.jpg', 'ij.jpg', 'jn.jpg', 'km.jpg',
    'mk.jpg', 'mki.jpg', 'ms.jpg', 'ni.jpg', 'nij.jpg', 'nj.jpg', 'nje.jpg',
    'njk.jpg', 'njkc.jpg', 'o.jpg', 'p.jpg', 'w.jpg',
    // WhatsApp / dated exports
    'IMG-20241123-WA0004.jpg', 'IMG-20241123-WA0008.jpg', 'IMG-20241123-WA0010.jpg',
    'IMG-20250211-WA0004.jpg', 'IMG-20250211-WA0005.jpg',
    'IMG-20251127-WA0002.jpg',
    'IMG-20260525-WA0013.jpg', 'IMG-20260526-WA0005.jpg',
    // Sonu Kumar / Sonu Zaiswal named
    'sonu kumar.jpg', 'sonu kumar 9.jpg',
    'sonu zaiswal.jpeg', 'sonu zaiswal 1.jpeg', 'sonu zaiswal 2.jpeg',
    'sonu zaiswal 3.jpeg', 'sonu zaiswal 5.jpeg', 'sonu zaiswal 6.jpeg',
    'sonu zaiswal 7.jpeg', 'sonu zaiswal 9.jpeg', 'sonu zaiswal  8.jpeg'
  ]; 

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
        cursorDot.classList.add('hover-link');
        for(let i=0; i<5; i++) {
          smokeParticles.push(new SmokeParticle(mouseX, mouseY, textureOrange));
        }
      });
      item.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover-link');
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
    // Display the loading GIF inside the grid while checking for images
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 0;">
        <img src="../loading.gif" alt="Loading Designs..." style="max-width: 80px; height: auto; margin-bottom: 1rem;">
        <p style="color: var(--text-secondary); font-family: var(--font-body); font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase;">Loading designs...</p>
      </div>
    `;

    let htmlContent = '';
    
    // First, load from custom array if user added any
    for(const filename of customPosters) {
      htmlContent += createPosterElement(`posters/${filename}`);
      loadedCount++;
    }

    // Then, sequentially check 1.jpg, 2.jpg... but using Promise.all for speed
    const checks = [];
    for (let i = 1; i <= maxPostersToCheck; i++) {
      checks.push((async () => {
        const exts = ['.jpg', '.png', '.webp', '.jpeg'];
        for (const ext of exts) {
          const url = `posters/${i}${ext}`;
          const exists = await checkImageExists(url);
          if (exists) return { url, i };
        }
        return null;
      })());
    }

    const results = await Promise.all(checks);
    const validResults = results.filter(r => r !== null).sort((a, b) => a.i - b.i);

    for (const res of validResults) {
      // Avoid duplicate if someone added a numeric file to customPosters
      if (!htmlContent.includes(res.url)) {
        htmlContent += createPosterElement(res.url);
        loadedCount++;
      }
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
