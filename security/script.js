gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  
  // Matrix Background
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const chars = "010101";
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function drawM() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff9d';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(drawM, 50);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Typewriter effect for terminal
  const terminalBody = document.getElementById('typewriter');
  const text = terminalBody.innerHTML;
  terminalBody.innerHTML = '';
  
  let i = 0;
  let isTag = false;
  let currentHTML = "";

  function typeWriter() {
    if (i < text.length) {
      if (text.charAt(i) === '<') isTag = true;
      currentHTML += text.charAt(i);
      if (text.charAt(i) === '>') isTag = false;

      terminalBody.innerHTML = currentHTML + (i % 2 === 0 ? '_' : '');
      
      i++;
      let speed = isTag ? 0 : Math.random() * 20 + 10;
      setTimeout(typeWriter, speed);
    } else {
      terminalBody.innerHTML = currentHTML;
      // Add blinking cursor
      setInterval(() => {
        if (terminalBody.innerHTML.endsWith('_')) {
          terminalBody.innerHTML = terminalBody.innerHTML.slice(0, -1);
        } else {
          terminalBody.innerHTML += '_';
        }
      }, 500);
      
      // Initialize scroll animations NOW that the DOM height is finalized!
      initScrollAnimations();
    }
  }
  
  // Start typewriter after a short delay
  setTimeout(typeWriter, 500);

  function initScrollAnimations() {
    // Skill Bars Fill on Scroll
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
      ScrollTrigger.create({
        trigger: fill,
        start: "top 85%",
        onEnter: () => {
          fill.style.width = fill.getAttribute('data-width');
        }
      });
    });

    // Project Cards Stagger
    gsap.fromTo(".proj-card", 
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".project-grid",
          start: "top 85%"
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      }
    );

    // Log Entries Reveal
    gsap.fromTo(".log-entry", 
      { x: -50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: "#experience",
          start: "top 80%"
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }
    );

    // Certs Reveal
    gsap.fromTo(".cert-list li", 
      { x: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: ".certs",
          start: "top 85%"
        },
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      }
    );
    
    // Final refresh just in case
    ScrollTrigger.refresh();
  }

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('nav-links');
  
  if(menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close menu when clicking a link
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

});
