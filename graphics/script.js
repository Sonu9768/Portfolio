gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", (event) => {
  // Hero Animations
  gsap.fromTo(".hero-content", 
    { y: 50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
  );
  
  gsap.fromTo(".hero-image", 
    { x: 50, opacity: 0 }, 
    { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 }
  );

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  
  revealElements.forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    });
  });

  // Staggered Skills Reveal
  gsap.fromTo(".skill-card", 
    { y: 30, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".skills-grid",
        start: "top 80%"
      },
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }
  );

  // Staggered Work Reveal
  gsap.fromTo(".work-item", 
    { y: 50, opacity: 0 },
    {
      scrollTrigger: {
        trigger: ".work-grid",
        start: "top 80%"
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }
  );
  
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
