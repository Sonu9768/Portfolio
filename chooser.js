// Custom Cursor
const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

function changeCursor(type) {
  if (type === 'design') {
    cursor.style.backgroundColor = '#c95d3c';
    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
  } else if (type === 'security') {
    cursor.style.backgroundColor = '#00ff9d';
    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    document.getElementById('matrix-canvas').style.opacity = '0.3';
  }
}

function resetCursor() {
  cursor.style.backgroundColor = 'white';
  cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  document.getElementById('matrix-canvas').style.opacity = '0';
}

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
