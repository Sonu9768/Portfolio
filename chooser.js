// Custom Cursor & Smoke Effect
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
  gradient.addColorStop(0, `rgba(${colorRGB}, 0.15)`);
  gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return c;
}

const textures = {
  white: createSmokeParticleTexture('255, 255, 255'),
  orange: createSmokeParticleTexture('201, 93, 60'),
  green: createSmokeParticleTexture('0, 255, 157')
};

let currentTexture = textures.white;
let smokeParticles = [];

class SmokeParticle {
  constructor(x, y, texture) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 20 + 20;
    this.texture = texture;
    this.alpha = 0.6;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5 - 0.5; // slight upward drift
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

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
  
  // Spawn smoke particles on move
  for (let i = 0; i < 2; i++) {
    smokeParticles.push(new SmokeParticle(mouseX, mouseY, currentTexture));
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

function changeCursor(type) {
  if (type === 'design') {
    cursorDot.classList.add('hover-design');
    currentTexture = textures.orange;
  } else if (type === 'security') {
    cursorDot.classList.add('hover-security');
    currentTexture = textures.green;
    document.getElementById('matrix-canvas').style.opacity = '0.3';
  }
}

function resetCursor() {
  cursorDot.className = '';
  currentTexture = textures.white;
  document.getElementById('matrix-canvas').style.opacity = '0';
}

document.querySelectorAll('a, button, .cta-btn, .social-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (!el.classList.contains('split-panel')) {
      cursorDot.classList.add('hover-link');
      // When hovering over a link, spawn a small burst of smoke
      for(let i=0; i<5; i++) {
        smokeParticles.push(new SmokeParticle(mouseX, mouseY, currentTexture));
      }
    }
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hover-link');
  });
});

// Matrix Background
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chars = "010101";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawM() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
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
