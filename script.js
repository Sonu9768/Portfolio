/**
 * SONU_OS v20.0 - THE FINAL SOFT-SKILL INTEGRATION
 * Comprehensive Soft-Skill Matrix | Professional Interests | Final Polish
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Matrix Background
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const chars = "010101"; const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);
  function drawM() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff9d'; ctx.font = fontSize + 'px monospace';
    for(let i=0; i<drops.length; i++) {
      ctx.fillText(chars.charAt(Math.floor(Math.random()*chars.length)), i*fontSize, drops[i]*fontSize);
      if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(drawM, 50);

  // 2. OS Setup
  setTimeout(() => gsap.to('#boot-screen', { opacity: 0, pointerEvents: 'none', duration: 1 }), 1000);
  function clock() { document.getElementById('os-clock').innerText = new Date().toLocaleTimeString([], {hour12:false}); setTimeout(clock, 1000); }
  clock();

  // 3. Custom OS Alert
  const alertContainer = document.createElement('div');
  alertContainer.id = 'os-alert-overlay';
  alertContainer.style = "display:none; position:fixed; inset:0; background:rgba(0,0,0,0.95); backdrop-filter:blur(20px); z-index:1000000; align-items:center; justify-content:center;";
  alertContainer.innerHTML = `
    <div style="background:#050505; border:1px solid #00ff9d; padding:40px; width:450px; border-radius:4px; text-align:center; box-shadow:0 0 100px rgba(0,255,157,0.2);">
      <div style="font-family:'JetBrains Mono'; font-size:10px; color:#00ff9d; letter-spacing:4px; margin-bottom:20px;">[SYSTEM_INTEGRITY_ALERT]</div>
      <div id="os-alert-msg" style="font-family:'JetBrains Mono'; font-size:22px; color:#fff; margin-bottom:30px; text-transform:uppercase; font-weight:900;"></div>
      <button class="btn-sys" style="padding:10px 40px;" onclick="closeOSAlert()">ACKNOWLEDGE_COMMAND</button>
    </div>
  `;
  document.body.appendChild(alertContainer);
  window.showOSAlert = (msg) => { document.getElementById('os-alert-msg').innerText = msg; alertContainer.style.display = 'flex'; };
  window.closeOSAlert = () => { alertContainer.style.display = 'none'; };

  // 4. Desktop Logic (Strict Horizontal Row)
  function arrangeIcons() {
    const icons = document.querySelectorAll('.os-icon');
    icons.forEach((icon, i) => {
      icon.style.position = 'absolute';
      icon.style.left = (50 + (i * 125)) + 'px';
      icon.style.top = '30px';
      icon.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  }
  window.addEventListener('load', arrangeIcons);
  window.addEventListener('resize', arrangeIcons);
  setInterval(arrangeIcons, 3000);

  // 5. Window Manager
  let openWins = {}; let gInt = null;
  window.openWin = function(id) {
    if(openWins[id]) { focusWin(id); return; }
    const win = document.createElement('div'); win.className = 'os-window'; win.id = `win-${id}`;
    win.style.left = (120 + Object.keys(openWins).length * 40) + 'px';
    win.style.top = (100 + Object.keys(openWins).length * 40) + 'px';
    win.innerHTML = `
      <div class="window-header" onmousedown="dragWinStart(event, '${id}')">
        <span class="header-title">${id.toUpperCase()}.SYS</span>
        <div class="header-controls"><span class="min-btn" onclick="minWin('${id}')"></span><span class="max-btn" onclick="maxWin('${id}')"></span><span class="close-btn" onclick="closeWin('${id}')"></span></div>
      </div>
      <div class="window-body" onmousedown="focusWin('${id}')" style="${(id === 'games' || id === 'tools') ? 'padding:0; overflow:hidden; height:calc(100% - 35px); display:flex; flex-direction:column;' : 'padding:30px; overflow-y:auto; min-height:0; flex:1;'}">${getWinContent(id)}</div>
    `;
    document.getElementById('windows-container').appendChild(win);
    openWins[id] = { state: 'open' }; updateTaskbar(); focusWin(id);
  };

  window.closeWin = (id) => { if(gInt) clearInterval(gInt); document.getElementById(`win-${id}`).remove(); delete openWins[id]; updateTaskbar(); };
  window.minWin = (id) => { document.getElementById(`win-${id}`).classList.toggle('minimized'); updateTaskbar(); };
  window.maxWin = (id) => { document.getElementById(`win-${id}`).classList.toggle('maximized'); };
  window.focusWin = (id) => {
    document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 100);
    const win = document.getElementById(`win-${id}`); if(win) { win.style.zIndex = 1000; win.classList.remove('minimized'); }
    updateTaskbar();
  };

  window.updateTaskbar = function() {
    const bar = document.getElementById('active-apps'); bar.innerHTML = '';
    Object.keys(openWins).forEach(id => {
      const p = document.createElement('div'); p.className = 'app-pill';
      const win = document.getElementById(`win-${id}`); if(win && win.style.zIndex == 1000) p.classList.add('active');
      const icons = {device:'fa-laptop-code', performance:'fa-gauge-high', projects:'fa-folder-tree', experience:'fa-briefcase', creds:'fa-certificate', hobbies:'fa-palette', games:'fa-gamepad', tools:'fa-toolbox', terminal:'fa-terminal'};
      p.innerHTML = `<i class="fas ${icons[id] || 'fa-window-maximize'}"></i>`;
      p.onclick = () => focusWin(id); bar.appendChild(p);
    });
  };

  window.dragWinStart = (e, id) => {
    if(e.target.className !== 'window-header') return;
    const w = document.getElementById(`win-${id}`);
    const off = { x: e.clientX-w.offsetLeft, y: e.clientY-w.offsetTop };
    document.onmousemove = (me) => { w.style.left = (me.clientX-off.x)+'px'; w.style.top = (me.clientY-off.y)+'px'; };
    document.onmouseup = () => { document.onmousemove = null; };
    focusWin(id);
  };

  // 6. ULTIMATE MASTER DATA (FULL CV MIRROR)
  function getWinContent(id) {
    const data = {
      device: `
        <div style="display:flex; gap:40px; align-items:flex-start;">
          <img src="profile.png" style="width:150px; border-radius:15px; border:2px solid var(--accent); box-shadow:0 0 20px rgba(0,255,157,0.2);">
          <div>
            <h2 style="font-size:2.5rem; margin-bottom:5px; font-weight:900;">Sonu Kumar</h2>
            <p style="color:var(--accent); font-family:monospace; margin-bottom:20px; font-size:12px;">OFFENSIVE_SECURITY_SPECIALIST // RED_TEAM_OPS</p>
            <div style="font-size:13px; line-height:1.8; color:#ccc;">
              <p><i class="fas fa-map-marker-alt" style="color:var(--accent); width:20px;"></i> Koteshwor-32, Kathmandu, Nepal</p>
              <p><i class="fas fa-envelope" style="color:var(--accent); width:20px;"></i> sonuzaiswal@gmail.com</p>
              <p><i class="fas fa-phone" style="color:var(--accent); width:20px;"></i> 9824288958</p>
            </div>
            <p style="margin-top:20px; font-size:14px; line-height:1.6;">highly motivated and technically skilled cybersecurity professional specializing in Offensive Security and Red Team operations. Equipped with hands-on experience in identifying vulnerabilities and securing digital infrastructure.</p>
          </div>
        </div>
        <hr style="margin:30px 0; border:0; border-top:1px solid var(--border);">
        <h3>Career Objective</h3>
        <p style="font-size:14px; color:#ccc; line-height:1.8; margin-top:10px;">To leverage my deep-seated passion for offensive security and network defense within a high-stakes professional environment. My goal is to become a leading Security Architect, contributing to the development of resilient, breach-proof infrastructures and ensuring data protection against global threats.</p>
        
        <hr style="margin:30px 0; border:0; border-top:1px solid var(--border);">
        <h3>Education</h3>
        <div style="margin-top:20px;">
          <div class="proj-card" style="margin-bottom:15px;">
             <span style="color:var(--accent); font-family:monospace; font-size:10px;">2023 - PRESENT</span>
             <h4 style="font-size:15px;">BSc (Hons) Computer Networking & IT Security</h4>
             <p style="font-size:12px;">Islington College / London Metropolitan University</p>
          </div>
          <div class="proj-card">
             <span style="color:var(--accent); font-family:monospace; font-size:10px;">2020 - 2022</span>
             <h4 style="font-size:15px;">School Leaving Certificate (3.54 GPA)</h4>
             <p style="font-size:12px;">National Infotech School</p>
          </div>
        </div>
      `,
      performance: `
        <h3>Technical Performance Metrics</h3>
        <div style="margin-top:30px;">
          <div class="skill-bar-wrap">
            <div class="skill-label"><span>VULNERABILITY_ASSESSMENT (Nmap, Burp, Nessus)</span><span>95%</span></div>
            <div class="skill-bar"><div class="skill-fill" style="width:95%"></div></div>
          </div>
          <div class="skill-bar-wrap">
            <div class="skill-label"><span>NETWORKING (VLAN, OSPF, NAT, ACL)</span><span>92%</span></div>
            <div class="skill-bar"><div class="skill-fill" style="width:92%"></div></div>
          </div>
          <div class="skill-bar-wrap">
            <div class="skill-label"><span>AI_&_COMPUTER_VISION (YOLO, OpenCV)</span><span>90%</span></div>
            <div class="skill-bar"><div class="skill-fill" style="width:90%"></div></div>
          </div>
          <div class="skill-bar-wrap">
            <div class="skill-label"><span>PROGRAMMING (Python, Java, HTML/CSS)</span><span>88%</span></div>
            <div class="skill-bar"><div class="skill-fill" style="width:88%"></div></div>
          </div>
          <div class="skill-bar-wrap">
            <div class="skill-label"><span>MULTIMEDIA_TOOLS (Ps, Ai, Pr)</span><span>94%</span></div>
            <div class="skill-bar"><div class="skill-fill" style="width:94%"></div></div>
          </div>
        </div>
        <div style="margin-top:30px; display:grid; grid-template-columns:repeat(2,1fr); gap:10px;">
           <div class="proj-card" style="padding:15px;"><h5>SOFT_SKILLS</h5><p>Fast Learner, Team Collaboration, Problem Solving</p></div>
           <div class="proj-card" style="padding:15px;"><h5>OS_FAMILIARITY</h5><p>Linux (Kali, Ubuntu), Windows Server</p></div>
        </div>
      `,
      projects: `
        <h3>Active_Engineering_Portfolio</h3>
        <div class="project-grid" style="margin-top:20px;">
          <div class="proj-card" onclick="runLive('traffic')">
             <h4>AI Traffic Monitoring</h4>
             <p>YOLO & OpenCV based violation detection system (Real-time).</p>
          </div>
          <div class="proj-card" onclick="runLive('whois')">
             <h4>WHOIS Threat Analyzer</h4>
             <p>Cybersecurity OSINT tool for domain risk scoring.</p>
          </div>
          <div class="proj-card" onclick="runLive('fire')">
             <h4>Fire Fighting Robot</h4>
             <p>Embedded Arduino system with infrared thermal response.</p>
          </div>
          <div class="proj-card" onclick="runLive('rental')">
             <h4>Land Rental System</h4>
             <p>Python-based transaction automation & record manager.</p>
          </div>
          <div class="proj-card" onclick="runLive('ecommerce')">
             <h4>Printer E-Commerce</h4>
             <p>High-end frontend architecture for digital retail.</p>
          </div>
          <div class="proj-card" onclick="runLive('autofill')">
             <h4>Form Auto-Filler</h4>
             <p>Bulk document automation (Python + Excel).</p>
          </div>
        </div>
        <div id="live-area" style="margin-top:30px;"></div>
      `,
      experience: `
        <h3>Professional_Experience_Log</h3>
        <div style="margin-top:20px;">
          <div class="proj-card" style="margin-bottom:15px; border-left:3px solid var(--accent);">
             <span style="color:var(--accent); font-family:monospace; font-size:10px;">SEP 2025 - DEC 2025</span>
             <h4>Network Support (L2)</h4>
             <p>WebSurfer</p>
             <p style="font-size:12px; color:#666; margin-top:5px;">Resolved connectivity issues & assisted users with technical guidance.</p>
          </div>
          <div class="proj-card" style="margin-bottom:15px;">
             <span style="color:var(--accent); font-family:monospace; font-size:10px;">MAY 2025 - AUG 2025</span>
             <h4>Senior Graphic Designer & Web Developer</h4>
             <p>UHS Holdings</p>
          </div>
          <div class="proj-card" style="margin-bottom:15px;">
             <span style="color:var(--accent); font-family:monospace; font-size:10px;">NOV 2024 - MAR 2025</span>
             <h4>Senior Graphic Designer & Web Developer</h4>
             <p>Sama Publications</p>
          </div>
          <div class="proj-card">
             <span style="color:var(--accent); font-family:monospace; font-size:10px;">2021 - 2024</span>
             <h4>Senior Graphic Designer (Multiple Roles)</h4>
             <p>Skyline Tours | QMS Nepal</p>
          </div>
        </div>
      `,
      creds: `
        <h3>Verified_Training_&_Certs</h3>
        <div class="project-grid" style="margin-top:20px;">
          <div class="proj-card"><h4>AWS Academy</h4><p>Cloud Security, Architecting, and Operations.</p></div>
          <div class="proj-card"><h4>Broadway Infosys</h4><p>Professional Video Editing & Graphic Design.</p></div>
          <div class="proj-card"><h4>Cybersecurity (Online)</h4><p>Intro to PenTesting & Offensive Security.</p></div>
          <div class="proj-card"><h4>TryHackMe</h4><p>Top 1% Global Rank in security labs.</p></div>
        </div>
      `,
      hobbies: `
        <h3>Personal_Research_Interests</h3>
        <div class="project-grid" style="margin-top:20px;">
          <div class="proj-card"><h4>Ethical Hacking</h4><p>Exploring 0-day simulations and CTF challenges.</p></div>
          <div class="proj-card"><h4>AI Development</h4><p>Building computer vision models for smart cities.</p></div>
          <div class="proj-card"><h4>Robotics</h4><p>Autonomous hardware systems using Arduino/ESP32.</p></div>
        </div>
      `,
      games: `<div id="g-menu"><h3>Arcade v20.0</h3><div class="game-grid"><div class="game-card" onclick="playG('snake')"><i class="fas fa-snake"></i><h5>SNAKE</h5></div><div class="game-card" onclick="playG('ttt')"><i class="fas fa-hashtag"></i><h5>UNBEATABLE TTT</h5></div><div class="game-card" onclick="playG('2048')"><i class="fas fa-square-check"></i><h5>2048</h5></div><div class="game-card" onclick="playG('mem')"><i class="fas fa-brain"></i><h5>MEMORY</h5></div><div class="game-card" onclick="playG('mine')"><i class="fas fa-burst"></i><h5>MINE</h5></div></div></div><div id="g-vp" style="display:none;"></div>`,
      tools: `<div id="t-menu"><h3>Cyber Security Tools</h3><div class="game-grid"><div class="game-card" onclick="openTool('pass')"><i class="fas fa-key"></i><h5>PASS_GEN / CHECK</h5></div><div class="game-card" onclick="openTool('geo')"><i class="fas fa-map-location-dot"></i><h5>GEO_FINDER</h5></div><div class="game-card" onclick="openTool('sql')"><i class="fas fa-database"></i><h5>SQL_PAYLOADS</h5></div><div class="game-card" onclick="openTool('xss')"><i class="fas fa-bug"></i><h5>XSS_PAYLOADS</h5></div></div></div><div id="t-vp" style="display:none;"></div>`,
      terminal: `
        <div style="font-family:monospace; color:var(--accent);">
          > System: SONU_OS v5.0 Platinum<br>
          > User: Sonu Kumar [AUTHENTICATED]<br>
          > Location: Kathmandu, NP<br>
          > Last Login: 2026-04-23<br><br>
          > type 'help' for system commands.
        </div>
      `
    };
    return data[id] || "Initializing...";
  }

  window.runLive = (id) => {
    showOSAlert("CONNECTING_TO_LIVE_SERVER: " + id.toUpperCase() + "...");
  };

  // 7. ARCADE ENGINE
  window.playG = (id) => {
    const vp = document.getElementById('g-vp'); const menu = document.getElementById('g-menu');
    menu.style.display = 'none'; vp.style.display = 'block';
    vp.innerHTML = `<div class="arcade-header"><span>${id.toUpperCase()}</span><div style="display:flex; gap:10px;"><button class="btn-sys" onclick="initG('${id}')">RESTART</button><button class="btn-sys" onclick="quitG()" style="background:#ff5f56 !important;">CLOSE</button></div></div><div id="p-area"></div>`;
    initG(id);
  };
  window.quitG = () => { if(gInt) clearInterval(gInt); window.onkeydown = null; document.getElementById('g-vp').style.display='none'; document.getElementById('g-menu').style.display='block'; };
  window.initG = (id) => {
    if(gInt) clearInterval(gInt); const area = document.getElementById('p-area');
    if(id==='snake') { area.innerHTML='<canvas id="sc" width="300" height="300" style="background:#000; border:2px solid #222;"></canvas>'; startSnake(); }
    else if(id==='ttt') { area.innerHTML='<div id="tttb" style="display:grid; grid-template-columns:repeat(3,100px); gap:10px;"></div>'; startTTT(); }
    else if(id==='2048') { area.innerHTML='<div id="g2048" style="display:grid; grid-template-columns:repeat(4,60px); gap:5px;"></div>'; start2048(); }
    else if(id==='mem') { area.innerHTML='<div id="memb" style="display:grid; grid-template-columns:repeat(4,60px); gap:5px;"></div>'; startMem(); }
    else if(id==='mine') { area.innerHTML='<div id="minb" style="display:grid; grid-template-columns:repeat(5,40px); gap:2px;"></div>'; startMine(); }
  };


  // --- PERFECTED ARCADE ENGINES ---

  function startSnake() {
    const c = document.getElementById('sc'); const ctx = c.getContext('2d');
    let s = [{x:10, y:10}], f = {x:5, y:5}, dx = 0, dy = 0, sc = 0;
    const area = document.getElementById('p-area');
    const scoreUI = document.createElement('div');
    scoreUI.style = "color:#00ff9d; font-family:monospace; margin-bottom:10px;";
    scoreUI.innerHTML = `SCORE: <span id="snake-sc">0</span>`;
    area.prepend(scoreUI);

    window.onkeydown = (e) => {
      if(e.key==='ArrowUp'&&dy===0){dx=0;dy=-1;} if(e.key==='ArrowDown'&&dy===0){dx=0;dy=1;}
      if(e.key==='ArrowLeft'&&dx===0){dx=-1;dy=0;} if(e.key==='ArrowRight'&&dx===0){dx=1;dy=0;}
    };

    gInt = setInterval(() => {
      if(dx===0 && dy===0) return;
      let h = {x: s[0].x+dx, y: s[0].y+dy};
      if(h.x<0||h.x>19||h.y<0||h.y>19||s.some(p=>p.x===h.x&&p.y===h.y)){ 
        clearInterval(gInt); showOSAlert(`GAME_OVER | SCORE: ${sc}`); return; 
      }
      s.unshift(h);
      if(h.x===f.x && h.y===f.y) { 
        sc += 10; document.getElementById('snake-sc').innerText = sc;
        f = {x:Math.floor(Math.random()*20), y:Math.floor(Math.random()*20)}; 
      } else { s.pop(); }
      
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,400,400);
      ctx.fillStyle = '#00ff9d'; s.forEach(p => ctx.fillRect(p.x*15, p.y*15, 14, 14));
      ctx.fillStyle = '#ff5f56'; ctx.fillRect(f.x*15, f.y*15, 14, 14);
    }, 100);
  }

  function startTTT() {
    const b = document.getElementById('tttb'); let st = Array(9).fill(null), over = false;
    const checkW = (board, p) => [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(w => w.every(i => board[i] === p));
    
    const minimax = (board, p) => {
      const avail = board.map((v,i)=>v===null?i:null).filter(v=>v!==null);
      if(checkW(board, 'X')) return {score: -10}; if(checkW(board, 'O')) return {score: 10}; if(avail.length === 0) return {score: 0};
      let moves = [];
      for(let i=0; i<avail.length; i++) {
        let move = {index: avail[i]}; board[avail[i]] = p;
        move.score = minimax(board, p === 'O' ? 'X' : 'O').score;
        board[avail[i]] = null; moves.push(move);
      }
      let best;
      if(p === 'O') { let bestS = -10000; for(let i=0; i<moves.length; i++) if(moves[i].score > bestS) { bestS = moves[i].score; best = i; } }
      else { let bestS = 10000; for(let i=0; i<moves.length; i++) if(moves[i].score < bestS) { bestS = moves[i].score; best = i; } }
      return moves[best];
    };

    b.innerHTML = '';
    for(let i=0; i<9; i++) {
      const c = document.createElement('div'); 
      c.style = "width:100px; height:100px; background:#111; border:1px solid #333; display:flex; align-items:center; justify-content:center; font-size:3rem; cursor:pointer; transition:0.2s;";
      c.onclick = () => {
        if(!st[i] && !over) {
          st[i] = 'X'; c.innerText = 'X'; c.style.color = '#00ff9d';
          if(checkW(st, 'X')) { over=true; showOSAlert("HUMAN_WINS (GLITCH?)"); return; }
          if(!st.includes(null)) { over=true; showOSAlert("DRAW_MATCH"); return; }
          
          c.style.pointerEvents = 'none';
          setTimeout(() => {
            const best = minimax(st, 'O').index; st[best] = 'O'; 
            b.children[best].innerText = 'O'; b.children[best].style.color = '#ff5f56';
            if(checkW(st, 'O')) { over=true; showOSAlert("AI_WINS | SYSTEM_STABLE"); }
            else if(!st.includes(null)) { over=true; showOSAlert("DRAW_MATCH"); }
          }, 400);
        }
      };
      b.appendChild(c);
    }
  }

  function start2048() {
    const b = document.getElementById('g2048'); let board = Array(16).fill(0), sc = 0;
    const render = () => {
      b.innerHTML = '';
      board.forEach(v => {
        const d = document.createElement('div');
        let color = v === 0 ? '#1a1a1a' : (v < 128 ? '#00ff9d' : '#ff5f56');
        d.style = `width:65px; height:65px; background:${color}; color:${v?'#000':'#333'}; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:20px; border-radius:4px; transition:0.1s;`;
        d.innerText = v || ''; b.appendChild(d);
      });
    };
    const slide = (row) => {
      let arr = row.filter(v => v);
      for(let i=0; i<arr.length-1; i++) if(arr[i]===arr[i+1]){ arr[i]*=2; sc+=arr[i]; arr.splice(i+1,1); }
      while(arr.length<4) arr.push(0); return arr;
    };
    const move = (dir) => {
      let old = [...board];
      for(let i=0; i<4; i++) {
        let row = [];
        if(dir==='L') row = [board[i*4], board[i*4+1], board[i*4+2], board[i*4+3]];
        if(dir==='R') row = [board[i*4+3], board[i*4+2], board[i*4+1], board[i*4]];
        if(dir==='U') row = [board[i], board[i+4], board[i+8], board[i+12]];
        if(dir==='D') row = [board[i+12], board[i+8], board[i+4], board[i]];
        let res = slide(row);
        for(let j=0; j<4; j++) {
          if(dir==='L') board[i*4+j] = res[j]; if(dir==='R') board[i*4+3-j] = res[j];
          if(dir==='U') board[i+j*4] = res[j]; if(dir==='D') board[i+(3-j)*4] = res[j];
        }
      }
      if(JSON.stringify(old)!==JSON.stringify(board)) add();
    };
    const add = () => { 
      let e = board.map((v,i)=>v===0?i:null).filter(v=>v!==null); 
      if(e.length) board[e[Math.floor(Math.random()*e.length)]] = Math.random()>0.9?4:2; 
      render(); 
    };
    window.onkeydown = (e) => {
      if(e.key==='ArrowLeft') move('L'); if(e.key==='ArrowRight') move('R');
      if(e.key==='ArrowUp') move('U'); if(e.key==='ArrowDown') move('D');
    };
    add(); add();
  }

  function startMem() {
    const b = document.getElementById('memb'); 
    let syms = ['🛡️','🛡️','💻','💻','🤖','🤖','🚀','🚀','🔥','🔥','⚡','⚡'].sort(()=>Math.random()-0.5);
    let sel = [], solved = 0;
    b.innerHTML = '';
    syms.forEach((v, i) => {
      const c = document.createElement('div');
      c.style = "width:60px; height:60px; background:#111; border:1px solid #00ff9d; display:flex; align-items:center; justify-content:center; font-size:1.5rem; cursor:pointer; transition:0.3s; color:transparent;";
      c.innerText = v;
      c.onclick = () => {
        if(sel.length < 2 && !sel.includes(c) && c.style.color === 'transparent') {
          c.style.color = '#fff'; c.style.background = '#00ff9d'; sel.push(c);
          if(sel.length === 2) {
            if(sel[0].innerText === sel[1].innerText) { solved += 2; sel = []; if(solved === syms.length) showOSAlert("MEMORY_OPTIMIZED!"); }
            else { setTimeout(() => { sel.forEach(x=>{x.style.color='transparent'; x.style.background='#111';}); sel=[]; }, 500); }
          }
        }
      };
      b.appendChild(c);
    });
  }

  function startMine() {
    const b = document.getElementById('minb'); let mines = Array(25).fill(false), revealed = 0;
    for(let i=0; i<5; i++) { let r = Math.floor(Math.random()*25); if(!mines[r]) mines[r]=true; else i--; }
    b.innerHTML = '';
    for(let i=0; i<25; i++) {
      const c = document.createElement('div'); c.style = "width:45px; height:45px; background:#111; border:1px solid #333; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:900;";
      c.onclick = () => {
        if(c.style.background === 'rgb(0, 255, 157)') return;
        if(mines[i]) { 
          b.children.forEach((x,j)=>{ if(mines[j]) {x.style.background='#ff5f56'; x.innerText='💣';} });
          showOSAlert("SYSTEM_BREACHED!"); 
        } else {
          let count = 0;
          let x = i%5, y = Math.floor(i/5);
          for(let dy=-1; dy<=1; dy++) for(let dx=-1; dx<=1; dx++) {
            let nx = x+dx, ny = y+dy;
            if(nx>=0&&nx<5&&ny>=0&&ny<5 && mines[ny*5+nx]) count++;
          }
          c.style.background = '#00ff9d'; c.style.color = '#000'; c.innerText = count || ''; revealed++;
          if(revealed === 20) showOSAlert("ZONE_SECURED!");
        }
      };
      b.appendChild(c);
    }
  }

  // 8. SECURITY TOOLS ENGINE
  window.openTool = (id) => {
    const vp = document.getElementById('t-vp'); const menu = document.getElementById('t-menu');
    menu.style.display = 'none'; vp.style.display = 'block';
    vp.innerHTML = `<div class="arcade-header"><span>${id.toUpperCase()}_TOOL</span><div style="display:flex; gap:10px;"><button class="btn-sys" onclick="quitTool()" style="background:#ff5f56 !important;">CLOSE</button></div></div><div id="t-area" style="padding:20px; width:100%;"></div>`;
    
    const area = document.getElementById('t-area');
    if(id === 'pass') initPassTool(area);
    if(id === 'geo') initGeoTool(area);
    if(id === 'sql') initSqlTool(area);
    if(id === 'xss') initXssTool(area);
  };

  window.quitTool = () => {
    document.getElementById('t-vp').style.display='none';
    document.getElementById('t-menu').style.display='block';
  };

  function initPassTool(area) {
    area.innerHTML = `
      <div style="background:#0a0e14; border:1px solid #1a2635; border-radius:10px; padding:20px; position:relative; margin-bottom:20px; display:flex; align-items:center;">
        <input type="text" id="pass-input" placeholder="Enter password to check..." style="flex:1; background:transparent; border:none; outline:none; color:#00ff9d; font-family:monospace; font-size:20px; letter-spacing:1px; width:100%;">
        <button onclick="navigator.clipboard.writeText(document.getElementById('pass-input').value); showOSAlert('PASSWORD_COPIED');" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px; color:#ccc; cursor:pointer; transition:0.2s; margin-left:10px;"><i class="fas fa-copy"></i></button>
      </div>
      
      <div id="pass-strength" style="height:6px; background:#111; border-radius:3px; margin-bottom:30px; overflow:hidden;">
        <div id="pass-fill" style="height:100%; width:0%; background:#ff5f56; transition:0.3s;"></div>
      </div>
      
      <div style="display:flex; flex-direction:column; gap:20px; margin-bottom:30px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <label style="color:#ccc; font-size:14px; font-weight:700;">Length: <span id="len-val">19</span></label>
          <input type="range" id="pass-len" min="8" max="64" value="19" style="width:40%; accent-color:#00ff9d; cursor:pointer;" oninput="document.getElementById('len-val').innerText=this.value; generatePass()">
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <label style="color:#ccc; font-size:14px; font-weight:700;">Include Symbols</label>
          <input type="checkbox" id="pass-sym" checked style="accent-color:#00ff9d; width:18px; height:18px; cursor:pointer;" onchange="generatePass()">
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <label style="color:#ccc; font-size:14px; font-weight:700;">Include Numbers</label>
          <input type="checkbox" id="pass-num" checked style="accent-color:#00ff9d; width:18px; height:18px; cursor:pointer;" onchange="generatePass()">
        </div>
      </div>
      
      <button class="btn-sys" onclick="generatePass()" style="width:100%; padding:15px; font-size:16px; border-radius:100px; background:linear-gradient(90deg, #00d2ff, #7a00ff) !important; color:#fff !important; border:none !important; font-weight:700; cursor:pointer;">Generate Secure Password</button>
    `;
    
    document.getElementById('pass-input').onkeyup = (e) => {
      let val = e.target.value; let score = 0;
      if(val.length > 8) score += 25;
      if(val.length > 15) score += 10;
      if(val.match(/[A-Z]/)) score += 20;
      if(val.match(/[0-9]/)) score += 20;
      if(val.match(/[^A-Za-z0-9]/)) score += 25;
      score = Math.min(score, 100);
      let color = score < 50 ? '#ff5f56' : (score < 90 ? '#ffbd2e' : '#00ff9d');
      document.getElementById('pass-fill').style.width = score + '%';
      document.getElementById('pass-fill').style.background = color;
    };
    
    window.generatePass = () => {
      const len = parseInt(document.getElementById('pass-len').value);
      const incSym = document.getElementById('pass-sym').checked;
      const incNum = document.getElementById('pass-num').checked;
      
      let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if(incNum) chars += "0123456789";
      if(incSym) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
      
      let pass = ""; 
      for(let i=0; i<len; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
      
      document.getElementById('pass-input').value = pass;
      document.getElementById('pass-input').dispatchEvent(new Event('keyup'));
    };

    generatePass();
  }

  function initGeoTool(area) {
    area.innerHTML = `
      <h4 style="color:#00ff9d; margin-bottom:15px;">IP_GEOLOCATION_FINDER</h4>
      <div style="display:flex; gap:10px; margin-bottom:20px;">
        <input type="text" id="ip-input" placeholder="8.8.8.8" style="flex:1; padding:10px; background:#111; border:1px solid #333; color:#00ff9d; font-family:monospace;">
        <button class="btn-sys" onclick="locateIP()">TRACE</button>
      </div>
      <div id="geo-res" style="background:rgba(0,255,157,0.05); border:1px solid #00ff9d; padding:15px; font-family:monospace; color:#ccc; min-height:100px; font-size:12px; line-height:1.6;">
        > AWAITING_TARGET_IP...
      </div>
    `;
    
    window.locateIP = async () => {
      const ip = document.getElementById('ip-input').value || '8.8.8.8';
      const resDiv = document.getElementById('geo-res');
      resDiv.innerHTML = `> INITIATING_TRACE_ROUTE TO ${ip}...<br>> BYPASSING_PROXY_LAYERS...`;
      try {
        const res = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await res.json();
        if(data.error) throw new Error("Invalid IP");
        resDiv.innerHTML = `
          <span style="color:#00ff9d">TARGET_ACQUIRED:</span><br>
          IP: ${data.ip}<br>
          CITY: ${data.city}<br>
          REGION: ${data.region}<br>
          COUNTRY: ${data.country_name}<br>
          ISP: ${data.org}<br>
          LAT/LON: ${data.latitude}, ${data.longitude}
        `;
      } catch(e) {
        resDiv.innerHTML = `<span style="color:#ff5f56">> ERROR: TRACE_FAILED (INVALID_TARGET_OR_RATE_LIMIT)</span>`;
      }
    };
  }

  function initSqlTool(area) {
    const payloads = [
      "' OR 1=1--",
      "admin' --",
      "1; DROP TABLE users",
      "1' ORDER BY 1--+",
      "1' UNION SELECT 1,2,3--+",
      "' OR '1'='1",
      "\" OR \"1\"=\"1",
      "admin' OR 1=1/*",
      "admin'#",
      "' UNION SELECT null,@@version--"
    ];
    let html = `<h4 style="color:#00ff9d; margin-bottom:15px;">SQLi_PAYLOAD_DICTIONARY</h4><div style="height:300px; overflow-y:auto; background:#050505; border:1px solid #333; padding:10px;">`;
    payloads.forEach(p => {
      html += `<div style="padding:8px; border-bottom:1px solid #222; font-family:monospace; color:#ffbd2e; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
        <code>${p.replace(/</g, '&lt;')}</code>
        <i class="fas fa-copy" style="cursor:pointer; color:#00ff9d;" onclick="navigator.clipboard.writeText('${p.replace(/'/g, "\\'")}'); showOSAlert('PAYLOAD_COPIED_TO_CLIPBOARD');"></i>
      </div>`;
    });
    html += `</div>`;
    area.innerHTML = html;
  }

  function initXssTool(area) {
    const payloads = [
      "<script>alert(1)</script>",
      "<img src=x onerror=alert(1)>",
      "<svg/onload=alert(1)>",
      "\"><script>alert(document.cookie)</script>",
      "javascript:alert(1)",
      "<body onload=alert(1)>",
      "<input autofocus onfocus=alert(1)>",
      "<iframe src=javascript:alert(1)>",
      "<a href=\"javascript:alert(1)\">Click</a>",
      "<math><mi xlink:href=data:x,<script>alert(1)</script>></mi></math>"
    ];
    let html = `<h4 style="color:#00ff9d; margin-bottom:15px;">XSS_PAYLOAD_DICTIONARY</h4><div style="height:300px; overflow-y:auto; background:#050505; border:1px solid #333; padding:10px;">`;
    payloads.forEach(p => {
      html += `<div style="padding:8px; border-bottom:1px solid #222; font-family:monospace; color:#ff5f56; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
        <code>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
        <i class="fas fa-copy" style="cursor:pointer; color:#00ff9d;" onclick="navigator.clipboard.writeText('${p.replace(/'/g, "\\'").replace(/"/g, '&quot;')}'); showOSAlert('PAYLOAD_COPIED_TO_CLIPBOARD');"></i>
      </div>`;
    });
    html += `</div>`;
    area.innerHTML = html;
  }

  // 9. Final Init
  arrangeIcons();
  window.toggleMenu = () => { const m = document.getElementById('start-menu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; };
});
