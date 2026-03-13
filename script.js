/* ==============================================
   SONU ZAISWAL PORTFOLIO - JAVASCRIPT ENGINE
   ============================================== */

// ---- PARTICLE SYSTEM ----
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 120 };
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const numParticles = Math.floor((this.canvas.width * this.canvas.height) / 12000);
    for (let i = 0; i < numParticles; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => { this.resize(); this.init(); });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      p.update(this.mouse);
      p.draw(this.ctx);
    });
    this.connectParticles();
    requestAnimationFrame(() => this.animate());
  }

  connectParticles() {
    const maxDist = 120;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.25;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.baseX = this.x;
    this.baseY = this.y;
    this.speed = Math.random() * 0.4 + 0.1;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    const colors = ['0, 212, 255', '123, 47, 255', '0, 230, 118'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(mouse) {
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 3;
        this.y -= (dy / dist) * force * 3;
      }
    }
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  }
}

// ---- TYPEWRITER ----
class Typewriter {
  constructor(element, phrases, delay = 80) {
    this.element = element;
    this.phrases = phrases;
    this.delay = delay;
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const currentPhrase = this.phrases[this.phraseIndex];
    if (this.isDeleting) {
      this.element.textContent = currentPhrase.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentPhrase.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    let speed = this.isDeleting ? this.delay / 2 : this.delay;
    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      speed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      speed = 400;
    }
    setTimeout(() => this.type(), speed);
  }
}

// ---- INTERACTIVITY & UI ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scroll-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    if (scrollY > 400) scrollTop.classList.add('visible');
    else scrollTop.classList.remove('visible');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });
  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('nav-links').classList.remove('open');
      }
    });
  });
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => navLinksContainer.classList.toggle('open'));
}

function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${btn.getAttribute('data-tab')}`);
      activeContent.classList.add('active');
      const fills = activeContent.querySelectorAll('.skill-fill');
      fills.forEach((fill, i) => {
        fill.classList.remove('animated');
        setTimeout(() => fill.classList.add('animated'), i * 80 + 100);
      });
    });
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (filter === 'all' || (categories && categories.includes(filter))) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  elements.forEach(el => observer.observe(el));
  
  // Initial trigger for active security tab if in view
  const activeSecurityFills = document.querySelectorAll('#tab-security .skill-fill');
  activeSecurityFills.forEach((fill, i) => {
    setTimeout(() => fill.classList.add('animated'), 800 + (i * 100));
  });
}

// ---- GAME MODULES ----
const Games = {
  snake: {
    title: 'Snake Game',
    icon: 'ðŸ',
    init: (container) => {
      container.innerHTML = `
        <div class="game-ui">
          <div class="game-score-box">
            <div class="score-label">Score</div>
            <div class="score-value" id="snake-score">0</div>
          </div>
          <button class="game-btn" id="snake-reset">Restart</button>
        </div>
        <canvas id="snake-canvas" width="400" height="400"></canvas>
        <div class="snake-controls-hint">Use Arrow Keys to Move</div>
      `;
      const canvas = document.getElementById('snake-canvas');
      const ctx = canvas.getContext('2d');
      const scoreEl = document.getElementById('snake-score');
      const resetBtn = document.getElementById('snake-reset');
      
      let score = 0;
      let grid = 20;
      let count = 0;
      let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
      let apple = { x: 320, y: 320 };
      let gameActive = true;

      function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

      function loop() {
        if (!gameActive) return;
        requestAnimationFrame(loop);
        if (++count < 6) return; // Speed control
        count = 0;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        snake.x += snake.dx;
        snake.y += snake.dy;
        if (snake.x < 0) snake.x = canvas.width - grid;
        else if (snake.x >= canvas.width) snake.x = 0;
        if (snake.y < 0) snake.y = canvas.height - grid;
        else if (snake.y >= canvas.height) snake.y = 0;
        snake.cells.unshift({x: snake.x, y: snake.y});
        if (snake.cells.length > snake.maxCells) snake.cells.pop();
        
        ctx.fillStyle = '#ff4757'; // Apple
        ctx.fillRect(apple.x, apple.y, grid-1, grid-1);
        
        ctx.fillStyle = '#00d4ff'; // Snake head
        snake.cells.forEach((cell, index) => {
          if (index > 0) ctx.fillStyle = '#0099bb'; // Tail
          ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
          if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score += 10;
            scoreEl.textContent = score;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
          }
          for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
              gameActive = false;
              ctx.fillStyle = 'white';
              ctx.font = '30px Outfit';
              ctx.textAlign = 'center';
              ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            }
          }
        });
      }
      
      document.addEventListener('keydown', (e) => {
        if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
        else if (e.which === 38 && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
        else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
        else if (e.which === 40 && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
      });
      
      resetBtn.onclick = () => {
        score = 0; scoreEl.textContent = 0;
        snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
        apple = { x: 320, y: 320 };
        gameActive = true;
        loop();
      };
      requestAnimationFrame(loop);
    }
  },
  tictactoe: {
    title: 'Tic-Tac-Toe vs AI',
    icon: 'âœ•â—‹',
    init: (container) => {
      container.innerHTML = `
        <div class="ttt-wrapper">
          <div class="ttt-status" id="ttt-status">Your turn (X)</div>
          <div class="ttt-board" id="ttt-board">
            ${Array(9).fill().map((_, i) => `<div class="ttt-cell" data-index="${i}"></div>`).join('')}
          </div>
          <div class="ttt-scores">
            <div class="ttt-score-item player">
              <div class="s-label">You</div><div class="s-value" id="ttt-p-score">0</div>
            </div>
            <div class="ttt-score-item draws">
              <div class="s-label">Draws</div><div class="s-value" id="ttt-d-score">0</div>
            </div>
            <div class="ttt-score-item ai">
              <div class="s-label">AI</div><div class="s-value" id="ttt-ai-score">0</div>
            </div>
          </div>
          <button class="game-btn" id="ttt-reset">Reset Game</button>
        </div>
      `;
      const board = document.getElementById('ttt-board');
      const cells = board.querySelectorAll('.ttt-cell');
      const status = document.getElementById('ttt-status');
      const resetBtn = document.getElementById('ttt-reset');
      
      let state = Array(9).fill(null);
      let pScore = 0, aiScore = 0, draws = 0;
      let gameActive = true;

      function checkWinner(boardState) {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let [a,b,c] of wins) {
          if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) return {winner: boardState[a], lines: [a,b,c]};
        }
        return boardState.includes(null) ? null : {winner: 'draw'};
      }

      function minimax(newBoard, player) {
        const availSpots = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
        const win = checkWinner(newBoard);
        if (win && win.winner === 'X') return {score: -10};
        if (win && win.winner === 'O') return {score: 10};
        if (win && win.winner === 'draw') return {score: 0};

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
          let move = {index: availSpots[i]};
          newBoard[availSpots[i]] = player;
          move.score = minimax(newBoard, player === 'O' ? 'X' : 'O').score;
          newBoard[availSpots[i]] = null;
          moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
          let bestScore = -10000;
          for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) { bestScore = moves[i].score; bestMove = i; }
          }
        } else {
          let bestScore = 10000;
          for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) { bestScore = moves[i].score; bestMove = i; }
          }
        }
        return moves[bestMove];
      }

      function handleClick(e) {
        const i = e.target.dataset.index;
        if (!gameActive || state[i]) return;
        state[i] = 'X';
        e.target.textContent = 'X';
        e.target.classList.add('taken', 'x-mark', 'ttt-mark-appear');
        const win = checkWinner(state);
        if (win) endGame(win);
        else {
          gameActive = false;
          status.textContent = 'AI is thinking...';
          setTimeout(() => {
            const bestMove = minimax(state, 'O');
            state[bestMove.index] = 'O';
            cells[bestMove.index].textContent = 'O';
            cells[bestMove.index].classList.add('taken', 'o-mark', 'ttt-mark-appear');
            const winAi = checkWinner(state);
            if (winAi) endGame(winAi);
            else { gameActive = true; status.textContent = 'Your turn (X)'; }
          }, 600);
        }
      }

      function endGame(win) {
        gameActive = false;
        if (win.winner === 'draw') {
          status.textContent = "It's a draw!";
          draws++; document.getElementById('ttt-d-score').textContent = draws;
        } else {
          status.textContent = win.winner === 'X' ? 'You win!' : 'AI wins!';
          if (win.winner === 'X') pScore++; else aiScore++;
          document.getElementById('ttt-p-score').textContent = pScore;
          document.getElementById('ttt-ai-score').textContent = aiScore;
          win.lines.forEach(idx => cells[idx].classList.add('winner'));
        }
      }

      cells.forEach(c => c.onclick = handleClick);
      resetBtn.onclick = () => {
        state = Array(9).fill(null);
        cells.forEach(c => { c.textContent = ''; c.className = 'ttt-cell'; });
        status.textContent = 'Your turn (X)';
        gameActive = true;
      };
    }
  },
  memory: {
    title: 'Memory Card Game',
    icon: 'ðŸƒ',
    init: (container) => {
      const icons = ['ðŸ›¡ï¸', 'ðŸ’»', 'ðŸ”', 'ðŸš€', 'ðŸ§ ', 'ðŸŒ', 'ðŸ›¡ï¸', 'ðŸ’»', 'ðŸ”', 'ðŸš€', 'ðŸ§ ', 'ðŸŒ'];
      let shuffled = icons.sort(() => 0.5 - Math.random());
      container.innerHTML = `
        <div class="memory-wrapper">
          <div class="memory-ui">
            <div class="memory-stat"><div class="m-label">Moves</div><div class="m-value" id="mem-moves">0</div></div>
            <button class="game-btn" id="mem-reset">Restart</button>
          </div>
          <div class="memory-grid" id="mem-grid">
            ${shuffled.map(icon => `
              <div class="mem-card" data-icon="${icon}">
                <div class="mem-card-inner">
                  <div class="mem-back">?</div><div class="mem-face">${icon}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      const grid = document.getElementById('mem-grid');
      const cards = grid.querySelectorAll('.mem-card');
      const movesEl = document.getElementById('mem-moves');
      const resetBtn = document.getElementById('mem-reset');
      
      let flippedCards = [];
      let moves = 0;
      let matches = 0;

      cards.forEach(card => card.onclick = () => {
        if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        card.classList.add('flipped');
        flippedCards.push(card);
        if (flippedCards.length === 2) {
          moves++; movesEl.textContent = moves;
          if (flippedCards[0].dataset.icon === flippedCards[1].dataset.icon) {
            flippedCards.forEach(c => c.classList.add('matched'));
            flippedCards = [];
            matches++;
            if (matches === 6) setTimeout(() => grid.innerHTML = `<div class="memory-win-msg">Mastermind! All matched in ${moves} moves!</div>`, 600);
          } else {
            setTimeout(() => { flippedCards.forEach(c => c.classList.remove('flipped')); flippedCards = []; }, 1000);
          }
        }
      });
      resetBtn.onclick = () => Games.memory.init(container);
    }
  }
};

const Apps = {
  passguard: {
    title: 'PassGuard Pro',
    icon: 'ðŸ›¡ï¸',
    init: (container) => {
      container.innerHTML = `
        <div class="passguard-wrapper">
          <div class="pass-display">
            <span id="password-output">P@ssw0rd!2024</span>
            <button class="copy-btn" id="copy-pass"><i class="fas fa-copy"></i></button>
          </div>
          <div class="strength-meter"><div class="strength-fill" id="strength-fill"></div></div>
          <div class="pass-controls">
            <div class="control-group"><label>Length: <span id="len-val">16</span></label>
              <input type="range" id="pass-length" min="8" max="32" value="16">
            </div>
            <div class="control-group"><label>Include Symbols</label><input type="checkbox" id="inc-symbols" checked></div>
            <div class="control-group"><label>Include Numbers</label><input type="checkbox" id="inc-numbers" checked></div>
          </div>
          <button class="game-btn" id="gen-pass">Generate Secure Password</button>
        </div>
      `;
      const output = document.getElementById('password-output');
      const genBtn = document.getElementById('gen-pass');
      const copyBtn = document.getElementById('copy-pass');
      const lengthInput = document.getElementById('pass-length');
      const lenVal = document.getElementById('len-val');
      const strengthFill = document.getElementById('strength-fill');

      function generate() {
        const length = lengthInput.value;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + 
                        (document.getElementById('inc-numbers').checked ? "0123456789" : "") + 
                        (document.getElementById('inc-symbols').checked ? "!@#$%^&*()_+~`|}{[]:;?><,./-=" : "");
        let retVal = "";
        for (let i = 0; i < length; ++i) retVal += charset.charAt(Math.floor(Math.random() * charset.length));
        output.textContent = retVal;
        updateStrength(retVal);
      }

      function updateStrength(p) {
        let score = 0;
        if (p.length > 12) score += 25;
        if (/[A-Z]/.test(p)) score += 25;
        if (/[0-9]/.test(p)) score += 25;
        if (/[^A-Za-z0-9]/.test(p)) score += 25;
        strengthFill.style.width = score + "%";
        strengthFill.style.background = score < 50 ? "#ff4757" : score < 100 ? "#ffa502" : "#2ed573";
      }

      lengthInput.oninput = () => { lenVal.textContent = lengthInput.value; generate(); };
      genBtn.onclick = generate;
      copyBtn.onclick = () => { navigator.clipboard.writeText(output.textContent); copyBtn.innerHTML = '<i class="fas fa-check"></i>'; setTimeout(()=>copyBtn.innerHTML='<i class="fas fa-copy"></i>', 2000); };
      generate();
    }
  },
  weather: {
    title: 'WeatherPulse Dashboard',
    icon: 'ðŸŒ¤ï¸',
    init: (container) => {
      container.innerHTML = `
        <div class="weather-wrapper">
          <div class="task-input-section" style="margin-bottom: 20px; width:100%">
            <input type="text" class="task-input" id="weather-search" placeholder="Search city (e.g., Kathmandu, London)...">
            <button class="game-btn" id="weather-btn">Search</button>
          </div>
          <div id="weather-display" style="width:100%; display: flex; flex-direction: column; align-items: center;">
            <div class="weather-header">
              <h2 class="weather-city" id="w-city">Loading...</h2>
              <p class="weather-date" id="w-date"></p>
            </div>
            <div class="weather-temp-main"><span id="w-temp">--</span><span class="temp-unit">Â°C</span></div>
            <p class="weather-desc" id="w-desc">--</p>
            <div class="weather-details">
              <div class="weather-detail-card"><div class="detail-label">Humidity</div><div class="detail-value" id="w-hum">--</div></div>
              <div class="weather-detail-card"><div class="detail-label">Wind</div><div class="detail-value" id="w-wind">--</div></div>
              <div class="weather-detail-card"><div class="detail-label">UV Index</div><div class="detail-value" id="w-uv">--</div></div>
              <div class="weather-detail-card"><div class="detail-label">Clouds</div><div class="detail-value" id="w-cloud">--</div></div>
            </div>
          </div>
        </div>
      `;
      
      const apiKey = 'e3dd481359b44192b3b84939261303';
      const searchIn = document.getElementById('weather-search');
      const searchBtn = document.getElementById('weather-btn');
      
      async function fetchWeather(city = 'Kathmandu') {
        const cityName = city.trim() || 'Kathmandu';
        document.getElementById('w-city').textContent = 'Fetching...';
        
        try {
          const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(cityName)}&aqi=no`);
          
          if (!res.ok) {
            const errorText = await res.text();
            let errorMessage = 'City not found or API error';
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error.message;
            } catch(e) {}
            throw new Error(errorMessage);
          }
          
          const data = await res.json();
          if (!data || !data.location) throw new Error('Invalid data received');
          
          document.getElementById('w-city').textContent = `${data.location.name}, ${data.location.country}`;
          document.getElementById('w-date').textContent = new Date().toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});
          document.getElementById('w-temp').textContent = Math.round(data.current.temp_c);
          document.getElementById('w-desc').textContent = data.current.condition.text;
          document.getElementById('w-hum').textContent = `${data.current.humidity}%`;
          document.getElementById('w-wind').textContent = `${data.current.wind_kph} km/h`;
          document.getElementById('w-uv').textContent = data.current.uv;
          document.getElementById('w-cloud').textContent = `${data.current.cloud}%`;
        } catch (err) {
          document.getElementById('w-city').textContent = 'Error';
          console.error('Weather error:', err);
          alert('Weather Error: ' + err.message);
        }
      }

      searchBtn.onclick = () => {
        if (searchIn.value.trim()) fetchWeather(searchIn.value);
        else alert('Please enter a city name');
      };
      searchIn.onkeypress = (e) => { if(e.key === 'Enter') fetchWeather(searchIn.value); };
      fetchWeather();
    }
  },
  tasks: {
    title: 'TaskMatrix Board',
    icon: 'ðŸ“‹',
    init: (container) => {
      container.innerHTML = `
        <div class="tasks-wrapper">
          <div class="task-input-section">
            <input type="text" class="task-input" id="task-in" placeholder="Add a new task matrix entry...">
            <button class="game-btn" id="add-task">Add</button>
          </div>
          <div class="task-list" id="task-list"></div>
        </div>
      `;
      const input = document.getElementById('task-in');
      const addBtn = document.getElementById('add-task');
      const list = document.getElementById('task-list');
      let tasks = JSON.parse(localStorage.getItem('sonu_tasks') || '[]');

      function render() {
        list.innerHTML = tasks.map((t, i) => `
          <div class="task-item ${t.done ? 'completed' : ''}">
            <div class="task-content">
              <div class="task-check ${t.done ? 'checked' : ''}" onclick="toggleTask(${i})">
                ${t.done ? '<i class="fas fa-check"></i>' : ''}
              </div>
              <span class="task-text">${t.text}</span>
            </div>
            <i class="fas fa-trash task-delete" onclick="deleteTask(${i})"></i>
          </div>
        `).join('');
        localStorage.setItem('sonu_tasks', JSON.stringify(tasks));
      }

      window.toggleTask = (i) => { tasks[i].done = !tasks[i].done; render(); };
      window.deleteTask = (i) => { tasks.splice(i, 1); render(); };
      addBtn.onclick = () => { if(input.value.trim()){ tasks.push({text: input.value, done: false}); input.value = ''; render(); } };
      input.onkeypress = (e) => { if(e.key === 'Enter') addBtn.click(); };
      render();
    }
  }
};

// ---- INIT SYSTEM ----
document.addEventListener('DOMContentLoaded', () => {
  // Common UI
  const canvas = document.getElementById('particles-canvas');
  if (canvas) new ParticleSystem(canvas);
  initNavbar();
  initSkillTabs();
  initProjectFilters();
  initScrollReveal();
  
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) new Typewriter(typewriterEl, ['Penetration Testing','Ethical Hacking','Web Development','Graphic Design','AI &amp; Machine Learning','Network Engineering']);

  // Modal logic
  const modal = document.getElementById('game-modal');
  const closeBtn = document.getElementById('game-modal-close');
  document.querySelectorAll('.btn-try-it').forEach(btn => {
    btn.onclick = () => {
      const gameKey = btn.dataset.game;
      const appKey = btn.dataset.app;
      
      if (gameKey && Games[gameKey]) {
        document.getElementById('game-modal-title').textContent = Games[gameKey].title;
        document.getElementById('game-modal-icon').textContent = Games[gameKey].icon;
        Games[gameKey].init(document.getElementById('game-modal-body'));
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else if (appKey && Apps[appKey]) {
        document.getElementById('game-modal-title').textContent = Apps[appKey].title;
        document.getElementById('game-modal-icon').textContent = Apps[appKey].icon;
        Apps[appKey].init(document.getElementById('game-modal-body'));
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    };
  });
  closeBtn.onclick = () => {
    modal.classList.remove('open');
    document.getElementById('game-modal-body').innerHTML = '';
    document.body.style.overflow = '';
  };
});
