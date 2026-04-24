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
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(drawM, 50);

  // 2. OS Setup
  setTimeout(() => gsap.to('#boot-screen', { opacity: 0, pointerEvents: 'none', duration: 1 }), 1000);
  function clock() { document.getElementById('os-clock').innerText = new Date().toLocaleTimeString([], { hour12: false }); setTimeout(clock, 1000); }
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
  window.openWin = function (id) {
    if (openWins[id]) { focusWin(id); return; }
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

  window.closeWin = (id) => { if (gInt) clearInterval(gInt); document.getElementById(`win-${id}`).remove(); delete openWins[id]; updateTaskbar(); };
  window.minWin = (id) => { document.getElementById(`win-${id}`).classList.toggle('minimized'); updateTaskbar(); };
  window.maxWin = (id) => { document.getElementById(`win-${id}`).classList.toggle('maximized'); };
  window.focusWin = (id) => {
    document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 100);
    const win = document.getElementById(`win-${id}`); if (win) { win.style.zIndex = 1000; win.classList.remove('minimized'); }
    updateTaskbar();
  };

  window.updateTaskbar = function () {
    const bar = document.getElementById('active-apps'); bar.innerHTML = '';
    Object.keys(openWins).forEach(id => {
      const p = document.createElement('div'); p.className = 'app-pill';
      const win = document.getElementById(`win-${id}`); if (win && win.style.zIndex == 1000) p.classList.add('active');
      const icons = { device: 'fa-laptop-code', performance: 'fa-gauge-high', projects: 'fa-folder-tree', experience: 'fa-briefcase', creds: 'fa-certificate', hobbies: 'fa-palette', games: 'fa-gamepad', tools: 'fa-toolbox', terminal: 'fa-terminal' };
      p.innerHTML = `<i class="fas ${icons[id] || 'fa-window-maximize'}"></i>`;
      p.onclick = () => focusWin(id); bar.appendChild(p);
    });
  };

  window.dragWinStart = (e, id) => {
    if (e.target.className !== 'window-header') return;
    const w = document.getElementById(`win-${id}`);
    const off = { x: e.clientX - w.offsetLeft, y: e.clientY - w.offsetTop };
    document.onmousemove = (me) => { w.style.left = (me.clientX - off.x) + 'px'; w.style.top = (me.clientY - off.y) + 'px'; };
    document.onmouseup = () => { document.onmousemove = null; };
    focusWin(id);
  };

  // 6. ULTIMATE MASTER DATA (FULL CV MIRROR)
  function getWinContent(id) {
    const data = {
      device: `
        <div style="display:flex; gap:40px; align-items:flex-start;">
          <img src="sonu-kumar-cybersecurity-nepal.gif" style="width:150px; border-radius:15px; border:2px solid var(--accent); box-shadow:0 0 20px rgba(0,255,157,0.2);">
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
      `,
      blog: `
        <div id="blog-list">
          <div style="margin-bottom:25px;">
            <h2 style="font-size:1.6rem;font-weight:900;letter-spacing:2px;">📰 BLOG_DIR <span style="color:var(--accent);font-size:1rem;font-family:monospace;">// FIELD_NOTES</span></h2>
            <p style="color:#666;font-size:12px;margin-top:6px;font-family:monospace;">Click any post to read. Also visit <a href="blog/" target="_blank" style="color:var(--accent);">kumarsonu.com.np/blog/</a> for full articles.</p>
          </div>
          <div class="project-grid">
            <div class="proj-card" onclick="openBlog('websurfer')" style="cursor:pointer;border-left:3px solid #00ff9d;">
              <span style="color:#00ff9d;font-family:monospace;font-size:10px;">SEPT–DEC 2025 · NETWORKING</span>
              <h4 style="margin:8px 0;">🌐 L2 Network Engineer at WebSurfer Nepal</h4>
              <p style="color:#888;font-size:12px;">BGP incidents, fiber outages, MikroTik, Zabbix — ISP life from inside.</p>
              <span style="color:#00ff9d;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="openBlog('skyline')" style="cursor:pointer;border-left:3px solid #7a00ff;">
              <span style="color:#7a00ff;font-family:monospace;font-size:10px;">2021–2024 · DESIGN</span>
              <h4 style="margin:8px 0;">🎨 Senior Graphic Designer at Skyline Tours</h4>
              <p style="color:#888;font-size:12px;">Brand identity, tourism campaigns, motion graphics and 3 years of creativity.</p>
              <span style="color:#7a00ff;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="openBlog('islington')" style="cursor:pointer;border-left:3px solid #00d2ff;">
              <span style="color:#00d2ff;font-family:monospace;font-size:10px;">2022–PRESENT · EDUCATION</span>
              <h4 style="margin:8px 0;">🎓 Inside Islington College Kathmandu</h4>
              <p style="color:#888;font-size:12px;">Honest review of Nepal's top IT college — BSc Computing at London Met.</p>
              <span style="color:#00d2ff;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="openBlog('cybersec')" style="cursor:pointer;border-left:3px solid #ff5f56;">
              <span style="color:#ff5f56;font-family:monospace;font-size:10px;">2022–PRESENT · SECURITY</span>
              <h4 style="margin:8px 0;">🔐 My Cybersecurity Journey — Nepal to Red Team</h4>
              <p style="color:#888;font-size:12px;">From a MITM demo in class to TryHackMe Top 1% and offensive security.</p>
              <span style="color:#ff5f56;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="openBlog('tryhackme')" style="cursor:pointer;border-left:3px solid #ffbd2e;">
              <span style="color:#ffbd2e;font-family:monospace;font-size:10px;">2022–2024 · ACHIEVEMENT</span>
              <h4 style="margin:8px 0;">🏆 Reaching TryHackMe Top 1% from Nepal</h4>
              <p style="color:#888;font-size:12px;">The rooms, paths and daily discipline that got me into the global top 1%.</p>
              <span style="color:#ffbd2e;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="openBlog('graphicdesign')" style="cursor:pointer;border-left:3px solid #ff9d00;">
              <span style="color:#ff9d00;font-family:monospace;font-size:10px;">2021–2025 · CREATIVE</span>
              <h4 style="margin:8px 0;">✏️ 4 Years of Graphic Design in Nepal</h4>
              <p style="color:#888;font-size:12px;">Skyline, Sama Publications, UHS Holdings — lessons from 4 years of design.</p>
              <span style="color:#ff9d00;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="window.open('blog/sonu-kumar-aws-cloud-security-nepal.html','_blank')" style="cursor:pointer;border-left:3px solid #00c6ff;">
              <span style="color:#00c6ff;font-family:monospace;font-size:10px;">2024 · CLOUD</span>
              <h4 style="margin:8px 0;">☁️ AWS Cloud Security from Nepal</h4>
              <p style="color:#888;font-size:12px;">IAM attacks, S3 misconfigs, EC2 metadata, cloud-native attack surfaces.</p>
              <span style="color:#00c6ff;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="window.open('blog/sonu-kumar-red-team-offensive-security-nepal.html','_blank')" style="cursor:pointer;border-left:3px solid #ff3366;">
              <span style="color:#ff3366;font-family:monospace;font-size:10px;">2024 · RED TEAM</span>
              <h4 style="margin:8px 0;">🛡️ Red Team Operations Methodology</h4>
              <p style="color:#888;font-size:12px;">MITRE ATT&CK, adversary simulation, OPSEC, social engineering.</p>
              <span style="color:#ff3366;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="window.open('blog/sonu-kumar-sama-publications-designer-kathmandu.html','_blank')" style="cursor:pointer;border-left:3px solid #b400ff;">
              <span style="color:#b400ff;font-family:monospace;font-size:10px;">NOV 2024–MAR 2025 · PUBLISHING</span>
              <h4 style="margin:8px 0;">📰 Design at Sama Publications</h4>
              <p style="color:#888;font-size:12px;">Typography obsession, book covers, editorial grid systems in Kathmandu.</p>
              <span style="color:#b400ff;font-size:11px;font-family:monospace;">READ →</span>
            </div>
            <div class="proj-card" onclick="window.open('blog/sonu-kumar-uhs-holdings-web-developer-nepal.html','_blank')" style="cursor:pointer;border-left:3px solid #00ff6a;">
              <span style="color:#00ff6a;font-family:monospace;font-size:10px;">MAY–AUG 2025 · WEB DEV</span>
              <h4 style="margin:8px 0;">💻 Web Developer at UHS Holdings Nepal</h4>
              <p style="color:#888;font-size:12px;">Design meets code — React, component systems, DevSecOps in production.</p>
              <span style="color:#00ff6a;font-size:11px;font-family:monospace;">READ →</span>
            </div>
          </div>
        </div>
        <div id="blog-reader" style="display:none;">
          <button onclick="closeBlog()" style="margin-bottom:20px;background:linear-gradient(90deg,#00ff9d22,#00ff9d11);border:1px solid var(--accent);color:var(--accent);padding:8px 20px;border-radius:6px;font-family:monospace;cursor:pointer;font-size:12px;">← BACK TO BLOG_DIR</button>
          <div id="blog-content"></div>
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
  window.quitG = () => { if (gInt) clearInterval(gInt); window.onkeydown = null; document.getElementById('g-vp').style.display = 'none'; document.getElementById('g-menu').style.display = 'block'; };
  window.initG = (id) => {
    if (gInt) clearInterval(gInt); const area = document.getElementById('p-area');
    if (id === 'snake') { area.innerHTML = '<canvas id="sc" width="300" height="300" style="background:#000; border:2px solid #222;"></canvas>'; startSnake(); }
    else if (id === 'ttt') { area.innerHTML = '<div id="tttb" style="display:grid; grid-template-columns:repeat(3,100px); gap:10px;"></div>'; startTTT(); }
    else if (id === '2048') { area.innerHTML = '<div id="g2048" style="display:grid; grid-template-columns:repeat(4,60px); gap:5px;"></div>'; start2048(); }
    else if (id === 'mem') { area.innerHTML = '<div id="memb" style="display:grid; grid-template-columns:repeat(4,60px); gap:5px;"></div>'; startMem(); }
    else if (id === 'mine') { area.innerHTML = '<div id="minb" style="display:grid; grid-template-columns:repeat(5,40px); gap:2px;"></div>'; startMine(); }
  };


  // --- PERFECTED ARCADE ENGINES ---

  function startSnake() {
    const c = document.getElementById('sc'); const ctx = c.getContext('2d');
    let s = [{ x: 10, y: 10 }], f = { x: 5, y: 5 }, dx = 0, dy = 0, sc = 0;
    const area = document.getElementById('p-area');
    const scoreUI = document.createElement('div');
    scoreUI.style = "color:#00ff9d; font-family:monospace; margin-bottom:10px;";
    scoreUI.innerHTML = `SCORE: <span id="snake-sc">0</span>`;
    area.prepend(scoreUI);

    window.onkeydown = (e) => {
      if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; } if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
      if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; } if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    };

    gInt = setInterval(() => {
      if (dx === 0 && dy === 0) return;
      let h = { x: s[0].x + dx, y: s[0].y + dy };
      if (h.x < 0 || h.x > 19 || h.y < 0 || h.y > 19 || s.some(p => p.x === h.x && p.y === h.y)) {
        clearInterval(gInt); showOSAlert(`GAME_OVER | SCORE: ${sc}`); return;
      }
      s.unshift(h);
      if (h.x === f.x && h.y === f.y) {
        sc += 10; document.getElementById('snake-sc').innerText = sc;
        f = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
      } else { s.pop(); }

      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#00ff9d'; s.forEach(p => ctx.fillRect(p.x * 15, p.y * 15, 14, 14));
      ctx.fillStyle = '#ff5f56'; ctx.fillRect(f.x * 15, f.y * 15, 14, 14);
    }, 100);
  }

  function startTTT() {
    const b = document.getElementById('tttb'); let st = Array(9).fill(null), over = false;
    const checkW = (board, p) => [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].some(w => w.every(i => board[i] === p));

    const minimax = (board, p) => {
      const avail = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      if (checkW(board, 'X')) return { score: -10 }; if (checkW(board, 'O')) return { score: 10 }; if (avail.length === 0) return { score: 0 };
      let moves = [];
      for (let i = 0; i < avail.length; i++) {
        let move = { index: avail[i] }; board[avail[i]] = p;
        move.score = minimax(board, p === 'O' ? 'X' : 'O').score;
        board[avail[i]] = null; moves.push(move);
      }
      let best;
      if (p === 'O') { let bestS = -10000; for (let i = 0; i < moves.length; i++) if (moves[i].score > bestS) { bestS = moves[i].score; best = i; } }
      else { let bestS = 10000; for (let i = 0; i < moves.length; i++) if (moves[i].score < bestS) { bestS = moves[i].score; best = i; } }
      return moves[best];
    };

    b.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const c = document.createElement('div');
      c.style = "width:100px; height:100px; background:#111; border:1px solid #333; display:flex; align-items:center; justify-content:center; font-size:3rem; cursor:pointer; transition:0.2s;";
      c.onclick = () => {
        if (!st[i] && !over) {
          st[i] = 'X'; c.innerText = 'X'; c.style.color = '#00ff9d';
          if (checkW(st, 'X')) { over = true; showOSAlert("HUMAN_WINS (GLITCH?)"); return; }
          if (!st.includes(null)) { over = true; showOSAlert("DRAW_MATCH"); return; }

          c.style.pointerEvents = 'none';
          setTimeout(() => {
            const best = minimax(st, 'O').index; st[best] = 'O';
            b.children[best].innerText = 'O'; b.children[best].style.color = '#ff5f56';
            if (checkW(st, 'O')) { over = true; showOSAlert("AI_WINS | SYSTEM_STABLE"); }
            else if (!st.includes(null)) { over = true; showOSAlert("DRAW_MATCH"); }
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
        d.style = `width:65px; height:65px; background:${color}; color:${v ? '#000' : '#333'}; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:20px; border-radius:4px; transition:0.1s;`;
        d.innerText = v || ''; b.appendChild(d);
      });
    };
    const slide = (row) => {
      let arr = row.filter(v => v);
      for (let i = 0; i < arr.length - 1; i++) if (arr[i] === arr[i + 1]) { arr[i] *= 2; sc += arr[i]; arr.splice(i + 1, 1); }
      while (arr.length < 4) arr.push(0); return arr;
    };
    const move = (dir) => {
      let old = [...board];
      for (let i = 0; i < 4; i++) {
        let row = [];
        if (dir === 'L') row = [board[i * 4], board[i * 4 + 1], board[i * 4 + 2], board[i * 4 + 3]];
        if (dir === 'R') row = [board[i * 4 + 3], board[i * 4 + 2], board[i * 4 + 1], board[i * 4]];
        if (dir === 'U') row = [board[i], board[i + 4], board[i + 8], board[i + 12]];
        if (dir === 'D') row = [board[i + 12], board[i + 8], board[i + 4], board[i]];
        let res = slide(row);
        for (let j = 0; j < 4; j++) {
          if (dir === 'L') board[i * 4 + j] = res[j]; if (dir === 'R') board[i * 4 + 3 - j] = res[j];
          if (dir === 'U') board[i + j * 4] = res[j]; if (dir === 'D') board[i + (3 - j) * 4] = res[j];
        }
      }
      if (JSON.stringify(old) !== JSON.stringify(board)) add();
    };
    const add = () => {
      let e = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
      if (e.length) board[e[Math.floor(Math.random() * e.length)]] = Math.random() > 0.9 ? 4 : 2;
      render();
    };
    window.onkeydown = (e) => {
      if (e.key === 'ArrowLeft') move('L'); if (e.key === 'ArrowRight') move('R');
      if (e.key === 'ArrowUp') move('U'); if (e.key === 'ArrowDown') move('D');
    };
    add(); add();
  }

  function startMem() {
    const b = document.getElementById('memb');
    let syms = ['🛡️', '🛡️', '💻', '💻', '🤖', '🤖', '🚀', '🚀', '🔥', '🔥', '⚡', '⚡'].sort(() => Math.random() - 0.5);
    let sel = [], solved = 0;
    b.innerHTML = '';
    syms.forEach((v, i) => {
      const c = document.createElement('div');
      c.style = "width:60px; height:60px; background:#111; border:1px solid #00ff9d; display:flex; align-items:center; justify-content:center; font-size:1.5rem; cursor:pointer; transition:0.3s; color:transparent;";
      c.innerText = v;
      c.onclick = () => {
        if (sel.length < 2 && !sel.includes(c) && c.style.color === 'transparent') {
          c.style.color = '#fff'; c.style.background = '#00ff9d'; sel.push(c);
          if (sel.length === 2) {
            if (sel[0].innerText === sel[1].innerText) { solved += 2; sel = []; if (solved === syms.length) showOSAlert("MEMORY_OPTIMIZED!"); }
            else { setTimeout(() => { sel.forEach(x => { x.style.color = 'transparent'; x.style.background = '#111'; }); sel = []; }, 500); }
          }
        }
      };
      b.appendChild(c);
    });
  }

  function startMine() {
    const b = document.getElementById('minb'); let mines = Array(25).fill(false), revealed = 0;
    for (let i = 0; i < 5; i++) { let r = Math.floor(Math.random() * 25); if (!mines[r]) mines[r] = true; else i--; }
    b.innerHTML = '';
    for (let i = 0; i < 25; i++) {
      const c = document.createElement('div'); c.style = "width:45px; height:45px; background:#111; border:1px solid #333; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:900;";
      c.onclick = () => {
        if (c.style.background === 'rgb(0, 255, 157)') return;
        if (mines[i]) {
          b.children.forEach((x, j) => { if (mines[j]) { x.style.background = '#ff5f56'; x.innerText = '💣'; } });
          showOSAlert("SYSTEM_BREACHED!");
        } else {
          let count = 0;
          let x = i % 5, y = Math.floor(i / 5);
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            let nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5 && mines[ny * 5 + nx]) count++;
          }
          c.style.background = '#00ff9d'; c.style.color = '#000'; c.innerText = count || ''; revealed++;
          if (revealed === 20) showOSAlert("ZONE_SECURED!");
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
    if (id === 'pass') initPassTool(area);
    if (id === 'geo') initGeoTool(area);
    if (id === 'sql') initSqlTool(area);
    if (id === 'xss') initXssTool(area);
  };

  window.quitTool = () => {
    document.getElementById('t-vp').style.display = 'none';
    document.getElementById('t-menu').style.display = 'block';
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
      if (val.length > 8) score += 25;
      if (val.length > 15) score += 10;
      if (val.match(/[A-Z]/)) score += 20;
      if (val.match(/[0-9]/)) score += 20;
      if (val.match(/[^A-Za-z0-9]/)) score += 25;
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
      if (incNum) chars += "0123456789";
      if (incSym) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

      let pass = "";
      for (let i = 0; i < len; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));

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
        if (data.error) throw new Error("Invalid IP");
        resDiv.innerHTML = `
          <span style="color:#00ff9d">TARGET_ACQUIRED:</span><br>
          IP: ${data.ip}<br>
          CITY: ${data.city}<br>
          REGION: ${data.region}<br>
          COUNTRY: ${data.country_name}<br>
          ISP: ${data.org}<br>
          LAT/LON: ${data.latitude}, ${data.longitude}
        `;
      } catch (e) {
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

  // 9. Blog Engine
  const blogPosts = {
    websurfer: {
      title: '🌐 Life as an L2 Network Support Engineer at WebSurfer',
      date: 'Sept 2025 – Dec 2025',
      accent: '#00ff9d',
      content: `
        <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:5px;">🌐 Life as an L2 Network Support Engineer at WebSurfer</h2>
        <p style="color:#666;font-family:monospace;font-size:11px;margin-bottom:30px;">SEPT 2025 – DEC 2025 &nbsp;|&nbsp; WebSurfer Nepal Pvt. Ltd. &nbsp;|&nbsp; L2 Network Support</p>
        <p style="line-height:1.9;margin-bottom:20px;">When I first walked into the WebSurfer operations centre in September 2025, I had no idea that the next four months would transform me from a cybersecurity student with theoretical knowledge into a battle-hardened network engineer who had seen every kind of failure a modern ISP can produce. WebSurfer is one of Nepal's most established Internet Service Providers, and working inside its operations team — specifically at the Level 2 (L2) support tier — was one of the most defining professional experiences of my life.</p>
        <h3 style="color:#00ff9d;margin:25px 0 10px;">What Does an L2 Support Engineer Actually Do?</h3>
        <p style="line-height:1.9;margin-bottom:20px;">At WebSurfer, support is tiered. Level 1 handles the first call — checking whether your cable is plugged in, rebooting your router, the basics. When a ticket was too complex, too persistent, or too deep in the network stack for L1 to resolve, it escalated to us — the L2 team. We were the people who dug into the actual infrastructure. My responsibilities spanned a wide range: diagnosing routing anomalies, handling escalated customer complaints from enterprise clients, working with network monitoring dashboards (we used a combination of Zabbix and custom SNMP traps), troubleshooting VLAN misconfigurations, tracing packet loss across the backbone, and coordinating with the NOC (Network Operations Centre) during major outages.</p>
        <p style="line-height:1.9;margin-bottom:20px;">On a typical day, I would arrive, check the overnight alert logs, prioritise tickets by severity, and begin methodically resolving them. The most common issues were fiber breaks, misconfigured CPE (Customer Premises Equipment) devices, BGP path anomalies that caused packet routing to take sub-optimal routes, and DHCP pool exhaustion events that left entire residential blocks without addresses. Each of these required a different diagnostic mindset, and I had to be fluent in all of them.</p>
        <h3 style="color:#00ff9d;margin:25px 0 10px;">The Incident That Taught Me the Most</h3>
        <p style="line-height:1.9;margin-bottom:20px;">About six weeks into my tenure, a major enterprise client — a hospital group — experienced intermittent connectivity loss. This was a Priority 1 ticket, meaning every minute counted. The L1 team had already ruled out physical issues at the client premises. When the ticket landed on my desk at 10:47 PM, I ran a traceroute from the WebSurfer edge router toward the hospital's gateway and noticed something immediately: the path was flapping, alternating between two routes every few seconds. Classic BGP instability. I cross-referenced with our Zabbix dashboard and found that one of our upstream peering sessions had been experiencing a high number of prefix withdrawals over the past two hours. A BGP peer was flapping, which was poisoning our routing table with unstable entries. I coordinated with the senior NOC engineer, we applied a dampening policy to the affected peer, and within 22 minutes, the hospital was fully stable. That night, I learned more about real-world BGP operations than any certification course had ever shown me.</p>
        <h3 style="color:#00ff9d;margin:25px 0 10px;">Tools and Technologies I Used Daily</h3>
        <p style="line-height:1.9;margin-bottom:20px;">The WebSurfer tech stack was diverse and enterprise-grade. I became deeply familiar with MikroTik RouterOS for CPE management, Cisco IOS for edge and core switches, Zabbix for infrastructure monitoring, and LibreNMS for device inventory and graphing. I also extensively used Wireshark for packet-level diagnostics, worked with RADIUS servers for PPPoE authentication troubleshooting, and got hands-on experience with MPLS tunnels for enterprise client isolation. On the documentation side, I maintained incident reports, updated network topology diagrams, and contributed to the internal knowledge base with runbooks for recurring issues. These runbooks helped the L1 team resolve tickets faster without escalation, which directly reduced our average resolution time by about 30% over my tenure.</p>
        <h3 style="color:#00ff9d;margin:25px 0 10px;">Working the Night Shifts</h3>
        <p style="line-height:1.9;margin-bottom:20px;">One of the realities of network support is that the internet does not sleep. I rotated through night shifts where the NOC room was quiet, the city was dark outside the window, but the alert dashboard was never still. Some of my best learning happened at 2 AM when a major fiber cut was reported on the Kathmandu ring and I had to help reroute traffic through a backup path before morning peak traffic began. Those high-pressure scenarios, where you have to think clearly and act decisively with incomplete information, are things that no classroom can replicate. They forge a different kind of competence — one built on calm, systematic thinking under pressure.</p>
        <h3 style="color:#00ff9d;margin:25px 0 10px;">How WebSurfer Shaped My Security Mindset</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Working inside an ISP gave me a uniquely powerful perspective on cybersecurity. I could see traffic at the network level. I understood how DNS hijacking could be carried out at the ISP layer. I saw firsthand how ARP spoofing, if unchecked, could compromise entire customer subnets. I watched how DDoS attacks looked from the upstream perspective — massive, sudden traffic spikes that overwhelmed specific destination IPs. This vantage point — inside the plumbing of the internet — made my understanding of offensive and defensive security far more concrete and nuanced. When you understand how data flows at every layer, you understand exactly where attackers can intercept, redirect, or destroy it. That knowledge is something I carry into every cybersecurity project I work on today.</p>
        <h3 style="color:#00ff9d;margin:25px 0 10px;">Final Thoughts</h3>
        <p style="line-height:1.9;margin-bottom:20px;">My four months at WebSurfer were among the most intense and rewarding of my professional life. I am deeply grateful to the senior engineers who mentored me, the NOC team who trusted me with critical escalations, and the clients whose patience during outages pushed me to resolve issues faster than I thought possible. If you are a student of networking or cybersecurity, I cannot recommend enough the experience of working inside an ISP. It is where theory becomes reality, and where you learn what it truly means to keep the world connected.</p>
      `
    },
    skyline: {
      title: '🎨 Senior Graphic Designer at Skyline Tours',
      date: '2021 – 2024',
      accent: '#7a00ff',
      content: `
        <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:5px;">🎨 Senior Graphic Designer at Skyline Tours — Where Art Meets Adventure</h2>
        <p style="color:#666;font-family:monospace;font-size:11px;margin-bottom:30px;">2021 – 2024 &nbsp;|&nbsp; Skyline Tours & Travel &nbsp;|&nbsp; Senior Graphic Designer</p>
        <p style="line-height:1.9;margin-bottom:20px;">There is a particular kind of magic in designing for travel. When Skyline Tours first brought me on board as a Graphic Designer in 2021, I was stepping into a world where every visual had to do more than communicate — it had to make someone feel the Himalayas, the ancient temples, the thundering rivers of Nepal. Over three years, rising to the position of Senior Graphic Designer, I learned that visual design is not about making things look pretty. It is about making people feel things deeply enough to act on them.</p>
        <h3 style="color:#7a00ff;margin:25px 0 10px;">The Scope of the Role</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Skyline Tours is a mid-to-large scale tourism and travel company operating across Nepal and parts of South Asia. My role as Senior Graphic Designer was comprehensive. I was responsible for all visual output — from the company's print brochures and event banners to its social media content, website UI assets, promotional videos, and destination marketing campaigns. I led a small creative team and worked closely with the marketing and sales departments to ensure that every visual asset aligned with the business objective of attracting both domestic and international tourists.</p>
        <h3 style="color:#7a00ff;margin:25px 0 10px;">Brand Identity and Campaign Design</h3>
        <p style="line-height:1.9;margin-bottom:20px;">One of the most significant projects during my time at Skyline was a full brand identity refresh in 2022. The existing brand had become dated, inconsistent across materials, and was not resonating with the younger, digital-savvy tourist demographic that was increasingly booking travel online. I led the redesign from concept to completion — building a new colour palette that balanced Nepal's cultural richness (warm ochres, deep reds, Himalayan blues) with the clean, modern aesthetics expected by international travellers. The new logo, typography system, and brand guidelines I developed became the visual language used across all Skyline communications for years afterward.</p>
        <h3 style="color:#7a00ff;margin:25px 0 10px;">Digital-First Design Thinking</h3>
        <p style="line-height:1.9;margin-bottom:20px;">By 2022, tourism was recovering post-pandemic and the digital channel was more important than ever. I spearheaded Skyline's shift to a digital-first design philosophy. I designed optimised social media templates for Instagram, Facebook, and LinkedIn that maintained visual consistency while being adaptable for different campaigns. I created a library of reusable UI components for the Skyline website redesign, working alongside a developer to ensure the designs were both beautiful and technically implementable. The website redesign resulted in a measurable increase in online booking inquiries, which the marketing team attributed significantly to improved visual trust signals on the landing pages I designed.</p>
        <h3 style="color:#7a00ff;margin:25px 0 10px;">Video and Motion Graphics</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Tourism sells on emotion, and nothing conveys emotion like video. I produced a series of destination showcase videos — short-form content for social media and longer promotional reels for travel expos. Using Adobe Premiere Pro and After Effects, I crafted motion sequences that took viewers on immersive journeys: the sunrise over Pokhara's Phewa Lake, the ancient courtyards of Patan Durbar Square, the adrenaline of white-water rafting on the Trishuli River. These videos became some of Skyline's highest-performing content, regularly achieving engagement rates several times higher than static posts.</p>
        <h3 style="color:#7a00ff;margin:25px 0 10px;">What Design Taught Me About Communication</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Three years of professional design work taught me something that technical education rarely covers: the power of intentional visual communication. Every colour choice carries psychological weight. Every font selection signals a personality. Every composition tells the viewer where to look and what to feel. This understanding of how humans process visual information — which is largely instinctive and emotional — has fundamentally shaped how I think about all forms of communication, including cybersecurity presentations, technical documentation, and user interface design. Good design is not decoration. It is the difference between information that is ignored and information that changes behaviour.</p>
        <h3 style="color:#7a00ff;margin:25px 0 10px;">Leaving Skyline</h3>
        <p style="line-height:1.9;margin-bottom:20px;">In 2024, I made the difficult decision to transition my career fully toward cybersecurity. Leaving Skyline was bittersweet — I had built genuine relationships, contributed to real growth, and developed a creative identity there. But the call of the technical world, of offensive security, red teaming, and network defence, was too strong to ignore. I am deeply grateful to the Skyline team for the platform they gave me to develop as a professional. The creative discipline and visual thinking I built there continues to inform everything I do — including the design of this very portfolio.</p>
      `
    },
    islington: {
      title: '🎓 Inside Islington College — Nepal\'s Gateway to London Metropolitan Degree',
      date: '2022 – Present',
      accent: '#00d2ff',
      content: `
        <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:5px;">🎓 Inside Islington College — Nepal's Gateway to a London Metropolitan Degree</h2>
        <p style="color:#666;font-family:monospace;font-size:11px;margin-bottom:30px;">2022 – Present &nbsp;|&nbsp; Islington College, Kathmandu &nbsp;|&nbsp; BSc (Hons) Computing</p>
        <p style="line-height:1.9;margin-bottom:20px;">When people in Nepal's tech community discuss higher education, Islington College comes up consistently — not merely because of its London Metropolitan University affiliation, but because of the culture it has built inside its walls. I enrolled in the BSc (Hons) Computing programme in 2022, and what I have experienced since then is far more nuanced, challenging, and rewarding than any prospectus could capture. This is my honest account of what Islington is truly like.</p>
        <h3 style="color:#00d2ff;margin:25px 0 10px;">The Academic Structure</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Islington's computing programme is validated by London Metropolitan University, which means the curriculum, assessment standards, and ultimately the degree are benchmarked against a UK institution. The programme covers a broad spectrum — from fundamental programming (Java, Python) and database systems in the early years to advanced topics like cybersecurity, cloud computing, machine learning, and enterprise systems architecture in the upper years. The modularity of the programme means you can specialise through your module selections, and I deliberately oriented my choices toward security, networks, and systems — the foundation of what I now practise professionally.</p>
        <h3 style="color:#00d2ff;margin:25px 0 10px;">The Faculty — The Real Asset</h3>
        <p style="line-height:1.9;margin-bottom:20px;">If there is one thing that genuinely differentiates Islington from other colleges in Kathmandu, it is the quality and accessibility of its lecturers. Unlike large universities where students are anonymous faces in auditoriums, Islington maintains small class sizes that allow for real intellectual exchange. My lecturers were not just academic theorists — many of them had or continued to have active industry careers, which meant their teaching was grounded in practical reality. When we discussed network security, it was not abstract; we were looking at real attack vectors, real CVE databases, and real case studies from recent breaches.</p>
        <h3 style="color:#00d2ff;margin:25px 0 10px;">Practical Labs and Project-Based Learning</h3>
        <p style="line-height:1.9;margin-bottom:20px;">One of Islington's strongest pedagogical features is its emphasis on hands-on, project-based learning. Assignments are rarely simple examinations of memorised content. Instead, students are given real-world scenarios and asked to research, design, implement, and critically evaluate solutions. My most significant academic project — a fully functional browser-based cybersecurity extension with phishing detection, real-time threat analysis, and an AI-powered chat assistant — was conceived, built, and defended at Islington. The rigour of defending that work before a panel taught me how to communicate complex technical work to both technical and non-technical audiences, a skill that is invaluable in the professional world.</p>
        <h3 style="color:#00d2ff;margin:25px 0 10px;">The Community and Student Culture</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Islington has a genuinely diverse student body — not just geographically but in terms of background and aspiration. You will find students who are simultaneously running startups, students who are supporting their families while studying, students who have come from technical college backgrounds with strong practical skills, and students fresh from school with strong theoretical foundations. This diversity makes collaborative projects richer and more realistic — closer to what you would experience in an actual tech team than a homogeneous classroom ever could be. The student culture values initiative; those who explore beyond the syllabus, who build things on the side, who attend hackathons and cybersecurity competitions, are deeply respected.</p>
        <h3 style="color:#00d2ff;margin:25px 0 10px;">Challenges and Honest Critiques</h3>
        <p style="line-height:1.9;margin-bottom:20px;">No institution is perfect, and intellectual honesty requires acknowledging Islington's challenges. The reliance on UK-centric curriculum occasionally means the content is less directly applicable to Nepal's specific technology landscape. Some administrative processes can feel slow. And the cost — while reasonable by international standards — is a significant investment that places the college out of reach for many talented Nepali students. However, it is worth noting that Islington has made efforts to address the access issue through scholarships and flexible payment structures.</p>
        <h3 style="color:#00d2ff;margin:25px 0 10px;">What Islington Has Given Me</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Beyond the technical skills and the internationally recognised degree, Islington has given me something more difficult to quantify: confidence in academic rigour. The ability to read research papers critically, to formulate a technical argument, to situate my work within the broader context of the field — these are intellectual muscles that Islington helped me build. When I work on a security assessment today, I do not just execute techniques. I think about the why, the how it fits into the threat landscape, and how I would explain my findings to stakeholders at every level. That reflective, analytical dimension is a direct product of my time at Islington. I would recommend it without hesitation to anyone serious about building a computing career with both depth and breadth.</p>
      `
    },
    cybersec: {
      title: '🔐 My Cybersecurity Journey — From Curiosity to Red Team Ops',
      date: '2022 – Present',
      accent: '#ff5f56',
      content: `
        <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:5px;">🔐 My Cybersecurity Journey — From Curiosity to Red Team Ops</h2>
        <p style="color:#666;font-family:monospace;font-size:11px;margin-bottom:30px;">2022 – Present &nbsp;|&nbsp; Self-Directed Learning & Professional Practice</p>
        <p style="line-height:1.9;margin-bottom:20px;">Every cybersecurity professional has an origin story — a moment when the abstract concept of hacking became viscerally real and personally compelling. For me, that moment came during a networking class at Islington College when a lecturer casually demonstrated a man-in-the-middle attack on the local lab network and captured my own HTTP credentials in plaintext. I remember staring at my username and password appearing on the projector screen and feeling a mixture of violated, fascinated, and electrified. From that day, I was in.</p>
        <h3 style="color:#ff5f56;margin:25px 0 10px;">The Early Days — TryHackMe and the Art of Learning by Doing</h3>
        <p style="line-height:1.9;margin-bottom:20px;">I discovered TryHackMe in early 2022 and it became my obsession. The platform's gamified approach to security learning — where you earn points by completing rooms, each room being a self-contained lab environment focused on a specific vulnerability or technique — matched my learning style perfectly. I worked through beginner paths initially: understanding how ports work, how services expose themselves, how basic enumeration gives an attacker the lay of the land. Then I moved into more advanced territory. Buffer overflows, privilege escalation on Linux and Windows, web application vulnerabilities, Active Directory attacks. I reached the top 1% of global users on the platform, a milestone that took months of daily practice but that validated the intensity of my focus. The TryHackMe environment is a safe, legal space to develop genuinely dangerous skills — and I am grateful for every hour I spent there.</p>
        <h3 style="color:#ff5f56;margin:25px 0 10px;">Understanding the Adversary Mindset</h3>
        <p style="line-height:1.9;margin-bottom:20px;">The turning point in my development came when I stopped thinking like a defender trying to prevent attacks and started thinking like an attacker trying to find paths of least resistance. The adversary mindset is fundamentally different. A defender tries to eliminate every risk. An attacker only needs to find one. This asymmetry — where the attacker has all the time in the world and only needs to succeed once, while the defender must succeed every single time — is what makes offensive security both intellectually challenging and critically important. Understanding that asymmetry shaped how I approach security architecture: you cannot protect everything equally, so you must identify your crown jewels and concentrate your controls there.</p>
        <h3 style="color:#ff5f56;margin:25px 0 10px;">Penetration Testing Methodology</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Through a combination of academic study, online platforms, and self-directed research, I developed a systematic penetration testing methodology grounded in industry standards like OWASP and PTES (Penetration Testing Execution Standard). My process begins with reconnaissance — OSINT gathering, DNS enumeration, subdomain discovery — before moving into active scanning with tools like Nmap and Nikto. Vulnerability identification follows, using both automated scanners and manual analysis to avoid the false positives that automated tools frequently generate. Exploitation comes next, and this is where creativity matters most: the ability to chain multiple low-severity vulnerabilities into a critical attack path is what separates a competent pentester from an outstanding one. Finally, reporting — clear, actionable, prioritised — is where the real value is delivered to the client.</p>
        <h3 style="color:#ff5f56;margin:25px 0 10px;">AWS Cloud Security and the Modern Attack Surface</h3>
        <p style="line-height:1.9;margin-bottom:20px;">My AWS Academy training fundamentally expanded my understanding of the modern attack surface. The cloud has not eliminated traditional security concerns — it has transformed them. Misconfigured S3 buckets, over-permissive IAM roles, exposed EC2 metadata services, insecure Lambda functions — these are the misconfigurations that lead to data breaches affecting millions of users. I learned to think about cloud security not just as a series of configuration checkboxes but as a continuous, dynamic discipline that requires understanding the shared responsibility model, the principle of least privilege applied at cloud scale, and the detection capabilities needed to identify cloud-native attacks in real time.</p>
        <h3 style="color:#ff5f56;margin:25px 0 10px;">Looking Forward</h3>
        <p style="line-height:1.9;margin-bottom:20px;">My cybersecurity journey is still early, and I am keenly aware of how much remains to learn. The field evolves at a pace that demands perpetual students — people who are comfortable with uncertainty, who can rapidly acquire new knowledge, and who can apply first-principles thinking to novel situations. My immediate goals include deepening my expertise in red team operations, developing proficiency in malware analysis, and eventually contributing to open-source security tooling that benefits the broader community. I believe that Nepal has enormous untapped cybersecurity talent, and I hope that my journey — openly shared here — inspires others in this country to pursue this field with the same intensity and curiosity that has defined my own path.</p>
      `
    },
    graphicdesign: {
      title: '✏️ 4 Years of Graphic Design — Lessons, Tools & Visual Storytelling',
      date: '2021 – 2025',
      accent: '#ffbd2e',
      content: `
        <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:5px;">✏️ 4 Years of Graphic Design — Lessons, Tools, and the Art of Visual Storytelling</h2>
        <p style="color:#666;font-family:monospace;font-size:11px;margin-bottom:30px;">2021 – 2025 &nbsp;|&nbsp; Skyline Tours | Sama Publications | UHS Holdings</p>
        <p style="line-height:1.9;margin-bottom:20px;">Four years. Three companies. Hundreds of projects. Thousands of design decisions. Looking back at my graphic design career — which spanned from a fledgling designer at Skyline Tours in 2021 to a Senior Graphic Designer and Web Developer at UHS Holdings in 2025 — what strikes me most is not the technical progression, though that was real and substantial. What strikes me most is how much design taught me about people: how they perceive, how they feel, how they make decisions, and how a single visual choice can change all three.</p>
        <h3 style="color:#ffbd2e;margin:25px 0 10px;">Skyline Tours (2021–2024): Learning the Foundation</h3>
        <p style="line-height:1.9;margin-bottom:20px;">I have already written extensively about my time at Skyline in a dedicated post, but from a pure design craft perspective, those three years were my university. I learned print production — the difference between RGB and CMYK, bleed margins, resolution requirements for large-format printing. I learned brand systems — how to create a visual identity that is simultaneously distinctive, flexible, and consistent across every application. I learned the tourism design language — the visual shorthand of adventure, discovery, and wonder that makes travel brands resonate globally. Most importantly, I learned how to receive critique. The best designers are not the most gifted — they are the most receptive to feedback and the most willing to iterate without ego.</p>
        <h3 style="color:#ffbd2e;margin:25px 0 10px;">Sama Publications (Nov 2024 – Mar 2025): The World of Publishing Design</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Moving to Sama Publications was a significant pivot. Publishing design operates under entirely different constraints than tourism marketing. The primacy of text, the hierarchy of information across long-form layouts, the discipline of grid systems and typographic rhythm — these are the muscles of editorial design, and they were largely new to me. At Sama, I designed publication layouts, book covers, magazine spreads, and digital reading experiences. Typography became my obsession during this period. The difference between a publication that is merely readable and one that is genuinely pleasurable to read lies almost entirely in typographic decisions: leading, tracking, the relationship between body text and headings, the personality of the chosen typeface. I came away from Sama Publications with a typographic sensitivity that has made every subsequent design project better.</p>
        <h3 style="color:#ffbd2e;margin:25px 0 10px;">UHS Holdings (May–Aug 2025): Design Meets Development</h3>
        <p style="line-height:1.9;margin-bottom:20px;">My final design role — at UHS Holdings, where my title was Senior Graphic Designer and Web Developer — marked the evolution of my design practice into full-stack creative production. At UHS, I was not merely handing off design files to developers; I was implementing them myself. This required a rethinking of how I designed. Suddenly, every visual decision had to be evaluated not just aesthetically but technically: Can this gradient be achieved in CSS without a performance hit? Is this layout achievable in flexbox or does it require grid? Will this animation degrade gracefully on mobile? Designing with implementation in mind is a fundamentally different practice than designing for print or even for handoff to developers. It produces designs that are inherently more realistic, more performant, and more maintainable.</p>
        <h3 style="color:#ffbd2e;margin:25px 0 10px;">The Tools That Defined My Practice</h3>
        <p style="line-height:1.9;margin-bottom:20px;">Across four years and three companies, my toolset evolved considerably. The Adobe Creative Suite — Photoshop, Illustrator, InDesign, Premiere Pro, After Effects — was my primary environment throughout. I became particularly advanced in Illustrator for vector work and After Effects for motion graphics. I also worked extensively with Figma for UI/UX design and prototyping, which became my preferred tool for any digital design work given its collaborative features and superior prototyping capabilities compared to Adobe XD. For web implementation, I used HTML, CSS, JavaScript, and frameworks including React and Tailwind CSS. Across all these tools, the principle was the same: tools serve intent. Understanding why you are making a design decision matters infinitely more than which software you use to execute it.</p>
        <h3 style="color:#ffbd2e;margin:25px 0 10px;">What Design Gave My Cybersecurity Career</h3>
        <p style="line-height:1.9;margin-bottom:20px;">This might seem like an unlikely connection, but my design background has made me a better cybersecurity professional in measurable ways. Security reporting is a discipline that most technical practitioners neglect — they produce impenetrable walls of technical jargon that non-technical stakeholders cannot act on. My design training means I approach security reports as communication artefacts: clearly structured, visually organised, with key findings surfaced immediately and detailed evidence available for those who need it. I have seen executives make better security investment decisions because a report was designed to communicate clearly rather than to demonstrate technical complexity. That is design thinking applied to security — and it works.</p>
      `
    }
  };

  window.openBlog = (id) => {
    const post = blogPosts[id];
    if (!post) { post = blogPosts['cybersec']; } // fallback
    if (!post) return;
    const list = document.getElementById('blog-list');
    const reader = document.getElementById('blog-reader');
    const content = document.getElementById('blog-content');
    if (!list || !reader || !content) return;
    content.innerHTML = `<div style="line-height:1.9; color:#ccc; max-width:800px;">${post.content}</div>`;
    list.style.display = 'none';
    reader.style.display = 'block';
    reader.parentElement.scrollTop = 0;
  };

  window.closeBlog = () => {
    const list = document.getElementById('blog-list');
    const reader = document.getElementById('blog-reader');
    if (!list || !reader) return;
    reader.style.display = 'none';
    list.style.display = 'block';
  };

  // 10. Final Init
  arrangeIcons();
  window.toggleMenu = () => { const m = document.getElementById('start-menu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; };
});
