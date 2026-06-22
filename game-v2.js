    // --- DATABASE & AUTHENTICATION MODULE ---
    const authModule = (() => {
      const DB_KEY = 'abc_music_users';

      // Initialize database with some dummy accounts
      function getDatabase() {
        let db = localStorage.getItem(DB_KEY);
        if (!db) {
          db = [
            { email: 'admin@abc.com', password: 'password', status: 'approved', name: 'Administrator' },
            { email: 'test@abc.com', password: 'password', status: 'pending', name: 'Standard Test User' }
          ];
          localStorage.setItem(DB_KEY, JSON.stringify(db));
        } else {
          db = JSON.parse(db);
        }
        return db;
      }

      function saveDatabase(db) {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
      }

      function switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(scr => scr.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        
        // Show/hide admin trigger based on login/signup screen
        const adminTrigger = document.getElementById('admin-trigger');
        if (screenId === 'login-screen' || screenId === 'signup-screen') {
          adminTrigger.style.display = 'block';
        } else {
          adminTrigger.style.display = 'none';
        }
      }

      function togglePasswordVisibility(inputFieldId, btn) {
        const input = document.getElementById(inputFieldId);
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = 'Hide';
        } else {
          input.type = 'password';
          btn.textContent = 'Show';
        }
      }

      // SSO Modal Controls
      function openGoogleSSO() {
        document.getElementById('google-sso-modal').classList.add('active');
      }

      function closeGoogleSSO() {
        document.getElementById('google-sso-modal').classList.remove('active');
      }

      // Simulated Google Login (Auto Approves)
      function simulateGoogleSSOLogin(email, name) {
        closeGoogleSSO();
        
        // Add to database if not exists, auto-approving it
        const db = getDatabase();
        let user = db.find(u => u.email === email);
        if (!user) {
          user = { email: email, password: '', status: 'approved', name: name, provider: 'google' };
          db.push(user);
          saveDatabase(db);
        } else {
          user.status = 'approved'; // Make sure Google SSO is always auto-approved
          saveDatabase(db);
        }

        // Show a brief spinner and log in
        loginUser(user);
      }

      function loginUser(user) {
        localStorage.setItem('abc_music_current_user', JSON.stringify(user));
        document.getElementById('profile-email').textContent = user.name || user.email;
        switchScreen('song-selection-screen');
      }

      function logout() {
        localStorage.removeItem('abc_music_current_user');
        switchScreen('login-screen');
        gameEngine.stop();
      }

      // Normal signup (Requires Admin approval)
      function handleSignUp(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const msgDiv = document.getElementById('signup-status-msg');

        if (password.length < 6) {
          msgDiv.textContent = 'Password must be at least 6 characters long.';
          msgDiv.className = 'status-msg error';
          return;
        }

        const db = getDatabase();
        if (db.some(u => u.email === email)) {
          msgDiv.textContent = 'An account with this email already exists.';
          msgDiv.className = 'status-msg error';
          return;
        }

        const newUser = {
          email: email,
          password: password,
          status: 'pending', // Default is pending
          name: email.split('@')[0],
          provider: 'local'
        };

        db.push(newUser);
        saveDatabase(db);

        msgDiv.textContent = 'Account submitted! Waiting for Admin Approval.';
        msgDiv.className = 'status-msg success';
        document.getElementById('register-form').reset();

        // Switch back to Login after 2.5 seconds
        setTimeout(() => {
          msgDiv.className = 'status-msg';
          document.getElementById('signin-email').value = email;
          switchScreen('login-screen');
          
          // Advise the user about the Admin Console
          const loginMsg = document.getElementById('login-status-msg');
          loginMsg.textContent = 'Your account status is PENDING. Use the Admin Console (bottom left) to approve it.';
          loginMsg.className = 'status-msg success';
        }, 2000);
      }

      // Normal signin (Checks approval status)
      function handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;
        const msgDiv = document.getElementById('login-status-msg');

        const db = getDatabase();
        const user = db.find(u => u.email === email);

        if (!user || user.password !== password) {
          msgDiv.textContent = 'Invalid email or password.';
          msgDiv.className = 'status-msg error';
          return;
        }

        if (user.status !== 'approved') {
          msgDiv.textContent = 'Account pending approval. Log in via Google SSO for instant access, or approve this user via the Admin Console in the bottom-left.';
          msgDiv.className = 'status-msg error';
          return;
        }

        msgDiv.className = 'status-msg';
        document.getElementById('signin-form').reset();
        loginUser(user);
      }

      // Check current login state on startup
      function checkAutoLogin() {
        const userStr = localStorage.getItem('abc_music_current_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          document.getElementById('profile-email').textContent = user.name || user.email;
          switchScreen('song-selection-screen');
        } else {
          switchScreen('login-screen');
        }
      }

      return {
        getDatabase,
        saveDatabase,
        switchScreen,
        togglePasswordVisibility,
        openGoogleSSO,
        closeGoogleSSO,
        simulateGoogleSSOLogin,
        handleSignUp,
        handleSignIn,
        logout,
        checkAutoLogin
      };
    })();


    // --- ADMIN MODULE ---
    const adminModule = (() => {
      const modal = document.getElementById('admin-modal');
      const listContainer = document.getElementById('admin-users-container');

      function openConsole() {
        renderUsers();
        modal.classList.add('active');
      }

      function closeConsole() {
        modal.classList.remove('active');
      }

      function renderUsers() {
        const db = authModule.getDatabase();
        listContainer.innerHTML = '';

        db.forEach((user, index) => {
          const row = document.createElement('div');
          row.className = 'admin-user-row';

          const info = document.createElement('div');
          info.className = 'admin-user-info';
          info.innerHTML = `<strong>${user.name || 'User'}</strong><br>${user.email}`;

          const actions = document.createElement('div');
          actions.className = 'admin-user-actions';

          // Status Badge
          const badge = document.createElement('span');
          badge.className = `badge badge-${user.status}`;
          badge.textContent = user.status.toUpperCase();
          actions.appendChild(badge);

          // Approve Button (if pending)
          if (user.status === 'pending') {
            const approveBtn = document.createElement('button');
            approveBtn.className = 'btn-xs btn-approve';
            approveBtn.textContent = 'Approve';
            approveBtn.onclick = () => approveUser(index);
            actions.appendChild(approveBtn);
          }

          // Delete Button (skip deleting core admin for safety)
          if (user.email !== 'admin@abc.com') {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-xs btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteUser(index);
            actions.appendChild(deleteBtn);
          }

          row.appendChild(info);
          row.appendChild(actions);
          listContainer.appendChild(row);
        });
      }

      function approveUser(index) {
        const db = authModule.getDatabase();
        db[index].status = 'approved';
        authModule.saveDatabase(db);
        renderUsers();
      }

      function approveAll() {
        const db = authModule.getDatabase();
        db.forEach(u => u.status = 'approved');
        authModule.saveDatabase(db);
        renderUsers();
      }

      function deleteUser(index) {
        const db = authModule.getDatabase();
        db.splice(index, 1);
        authModule.saveDatabase(db);
        renderUsers();
      }

      return {
        openConsole,
        closeConsole,
        approveAll
      };
    })();


    // --- WEB AUDIO SYNTHESIZER MODULE ---
    const audioSynth = (() => {
      let audioCtx = null;
      let isMuted = false;

      // Note frequency map for octave 4
      const frequencies = {
        'C': 261.63,
        'D': 293.66,
        'E': 329.63,
        'F': 349.23,
        'G': 392.00,
        'A': 440.00,
        'B': 493.88
      };

      function initAudio() {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      }

      function toggleSound() {
        isMuted = !isMuted;
        document.getElementById('sound-btn').textContent = isMuted ? '🔇' : '🔊';
      }

      // Synthetic chimes using triangle oscillator for kid friendly toy xylophone sound
      function playChime(note, volume = 0.5) {
        if (isMuted) return;
        initAudio();

        const freq = frequencies[note];
        if (!freq) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Amplitude Envelope: Rapid attack, slow exponential decay
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.9);
      }

      // Background metronome drum loop (kick/snare synthesis)
      function playDrumKick(time) {
        if (isMuted) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

        osc.start(time);
        osc.stop(time + 0.15);
      }

      function playDrumSnare(time) {
        if (isMuted) return;
        
        // Synthesise noise snare
        const bufferSize = audioCtx.sampleRate * 0.1;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1000;

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.12, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noiseNode.start(time);
        noiseNode.stop(time + 0.1);
      }

      return {
        initAudio,
        toggleSound,
        playChime,
        playDrumKick,
        playDrumSnare
      };
    })();


    // --- SONG DATA DEFINITIONS ---
    const SONGS = {
      twinkle: {
        title: "Twinkle Twinkle Little Star",
        bpm: 100,
        // Array of notes: note = pitch class A-G, beat = offset in quarter beats
        notes: [
          { note: 'C', beat: 0 }, { note: 'C', beat: 1 }, { note: 'G', beat: 2 }, { note: 'G', beat: 3 },
          { note: 'A', beat: 4 }, { note: 'A', beat: 5 }, { note: 'G', beat: 6 },
          { note: 'F', beat: 8 }, { note: 'F', beat: 9 }, { note: 'E', beat: 10 }, { note: 'E', beat: 11 },
          { note: 'D', beat: 12 }, { note: 'D', beat: 13 }, { note: 'C', beat: 14 },
          { note: 'G', beat: 16 }, { note: 'G', beat: 17 }, { note: 'F', beat: 18 }, { note: 'F', beat: 19 },
          { note: 'E', beat: 20 }, { note: 'E', beat: 21 }, { note: 'D', beat: 22 },
          { note: 'G', beat: 24 }, { note: 'G', beat: 25 }, { note: 'F', beat: 26 }, { note: 'F', beat: 27 },
          { note: 'E', beat: 28 }, { note: 'E', beat: 29 }, { note: 'D', beat: 30 },
          { note: 'C', beat: 32 }, { note: 'C', beat: 33 }, { note: 'G', beat: 34 }, { note: 'G', beat: 35 },
          { note: 'A', beat: 36 }, { note: 'A', beat: 37 }, { note: 'G', beat: 38 },
          { note: 'F', beat: 40 }, { note: 'F', beat: 41 }, { note: 'E', beat: 42 }, { note: 'E', beat: 43 },
          { note: 'D', beat: 44 }, { note: 'D', beat: 45 }, { note: 'C', beat: 46 }
        ]
      },
      mary: {
        title: "Mary Had a Little Lamb",
        bpm: 105,
        notes: [
          { note: 'E', beat: 0 }, { note: 'D', beat: 1 }, { note: 'C', beat: 2 }, { note: 'D', beat: 3 },
          { note: 'E', beat: 4 }, { note: 'E', beat: 5 }, { note: 'E', beat: 6 },
          { note: 'D', beat: 8 }, { note: 'D', beat: 9 }, { note: 'D', beat: 10 },
          { note: 'E', beat: 12 }, { note: 'G', beat: 13 }, { note: 'G', beat: 14 },
          { note: 'E', beat: 16 }, { note: 'D', beat: 17 }, { note: 'C', beat: 18 }, { note: 'D', beat: 19 },
          { note: 'E', beat: 20 }, { note: 'E', beat: 21 }, { note: 'E', beat: 22 }, { note: 'E', beat: 23 },
          { note: 'D', beat: 24 }, { note: 'D', beat: 25 }, { note: 'E', beat: 26 }, { note: 'D', beat: 27 },
          { note: 'C', beat: 28 }
        ]
      },
      rowboat: {
        title: "Row, Row, Row Your Boat",
        bpm: 110,
        notes: [
          { note: 'C', beat: 0 }, { note: 'C', beat: 1.5 }, { note: 'C', beat: 3 }, { note: 'D', beat: 3.5 }, { note: 'E', beat: 4 },
          { note: 'E', beat: 5.5 }, { note: 'D', beat: 6.5 }, { note: 'E', beat: 7 }, { note: 'F', beat: 7.5 }, { note: 'G', beat: 8 },
          { note: 'C', beat: 10 }, { note: 'C', beat: 10.5 }, { note: 'C', beat: 11 }, { note: 'G', beat: 11.5 }, { note: 'G', beat: 12 }, { note: 'G', beat: 12.5 },
          { note: 'E', beat: 13 }, { note: 'E', beat: 13.5 }, { note: 'E', beat: 14 }, { note: 'C', beat: 14.5 }, { note: 'C', beat: 15 }, { note: 'C', beat: 15.5 },
          { note: 'G', beat: 16 }, { note: 'F', beat: 17 }, { note: 'E', beat: 18 }, { note: 'D', beat: 19 }, { note: 'C', beat: 20 }
        ]
      }
    };


    // --- 2D CANVAS GAME ENGINE (perspective trapezoid lanes, fully responsive) ---
    const gameEngine = (() => {
      let canvas, ctx;

      let activeNotes     = [];
      let activeParticles = [];
      let spawnedNoteIndices = new Set();

      let isPlaying = false;
      let isPaused  = false;
      let lastFrameTime   = 0;
      let songElapsedTime = 0;
      let score = 0, combo = 0, maxCombo = 0;

      const numLanes   = 7;
      // A=red  B=orange  C=yellow  D=green  E=cyan  F=blue  G=purple
      const laneColors = ['#ff4a4a','#ff914d','#ffde59','#7ed957','#5ce1e6','#38b6ff','#cb6ce6'];
      const letterToLaneMap = { A:0, B:1, C:2, D:3, E:4, F:5, G:6 };

      const TRAVEL_TIME = 2.2;
      const HIT_P       = 0.89;
      const NOTE_SPEED  = HIT_P / TRAVEL_TIME;

      const T_PERFECT = 0.038;
      const T_GREAT   = 0.075;
      const T_GOOD    = 0.110;
      const T_MISS    = HIT_P + 0.055;

      let W = 400, H = 700;
      let vanishX, vanishY, hitBarY, laneW;
      let lanePulse = new Array(numLanes).fill(0);

      function computeLayout() {
        const container = document.getElementById('canvas-container');
        if (!container || !canvas) return;
        W = canvas.width  = container.clientWidth  || 400;
        H = canvas.height = container.clientHeight || 700;
        vanishX = W / 2;
        vanishY = H * 0.05;
        hitBarY = H * HIT_P;
        laneW   = W / numLanes;
      }

      function laneCenter(i, p) { return vanishX + ((i + 0.5) * laneW - vanishX) * p; }
      function progressY(p)     { return vanishY + (hitBarY - vanishY) * p; }
      function noteR(p)         { return laneW * 0.43 * p; }

      function init() {
        window.removeEventListener('resize', computeLayout);
        const container = document.getElementById('canvas-container');
        container.innerHTML = '';
        canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        container.appendChild(canvas);
        ctx = canvas.getContext('2d');
        computeLayout();
        activeNotes = []; activeParticles = [];
        spawnedNoteIndices.clear();
        lanePulse = new Array(numLanes).fill(0);
        window.addEventListener('resize', computeLayout);
      }

      function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        drawSky(); drawLanes(); drawHitBar(); drawNotes(); drawParticles();
      }

      function drawSky() {
        const sky = ctx.createLinearGradient(0, 0, 0, vanishY + (hitBarY - vanishY) * 0.3);
        sky.addColorStop(0, '#4ab8e8');
        sky.addColorStop(1, '#9eddf5');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);
      }

      function drawLanes() {
        // Lanes extend fully to the BOTTOM of screen (H), not just hitBarY.
        // The hit bar is drawn ON TOP of the lanes as a separate element.
        for (let i = 0; i < numLanes; i++) {
          const pulse = lanePulse[i];
          const blX = i * laneW + 0.5;
          const brX = (i + 1) * laneW - 0.5;
          // Gradient from vanishY all the way to H (full screen bottom)
          const grad = ctx.createLinearGradient(0, vanishY, 0, H);
          grad.addColorStop(0,    hexA(laneColors[i], 0.10 + pulse * 0.10));
          grad.addColorStop(0.55, hexA(laneColors[i], 0.65 + pulse * 0.18));
          grad.addColorStop(1,    hexA(laneColors[i], 0.90 + pulse * 0.08));
          ctx.beginPath();
          ctx.moveTo(vanishX, vanishY);
          ctx.lineTo(brX, H);      // extend to screen bottom
          ctx.lineTo(blX, H);
          ctx.closePath();
          ctx.fillStyle = grad; ctx.fill();
        }
        // Separator lines from vanishing point to screen bottom
        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= numLanes; i++) {
          ctx.beginPath();
          ctx.moveTo(vanishX, vanishY);
          ctx.lineTo(i * laneW, H);   // extend to screen bottom
          ctx.stroke();
        }
        // Glossy center highlight strips — full height
        for (let i = 0; i < numLanes; i++) {
          const cx = (i + 0.5) * laneW;
          const hw = laneW * 0.28;
          const gl = ctx.createLinearGradient(cx - hw, 0, cx + hw, 0);
          gl.addColorStop(0,   'rgba(255,255,255,0)');
          gl.addColorStop(0.5, 'rgba(255,255,255,0.20)');
          gl.addColorStop(1,   'rgba(255,255,255,0)');
          ctx.beginPath();
          ctx.moveTo(vanishX, vanishY);
          ctx.lineTo(cx + hw, H);
          ctx.lineTo(cx - hw, H);
          ctx.closePath();
          ctx.fillStyle = gl; ctx.fill();
        }
        // No dark floor — lanes are visible all the way to the bottom under the buttons
      }

      function drawHitBar() {
        // Calculate Y positions for each hit zone
        const yPerfectStart = progressY(HIT_P - T_PERFECT);
        const yPerfectEnd   = progressY(HIT_P + T_PERFECT);
        const yGreatStart   = progressY(HIT_P - T_GREAT);
        const yGreatEnd     = progressY(HIT_P + T_GREAT);
        const yGoodStart   = progressY(HIT_P - T_GOOD);
        const yGoodEnd     = progressY(HIT_P + T_GOOD);

        // Draw GOOD zone (yellow, largest)
        ctx.save();
        ctx.shadowColor = '#ffde59'; ctx.shadowBlur = 18;
        const gGood = ctx.createLinearGradient(0, yGoodStart, 0, yGoodEnd);
        gGood.addColorStop(0,   'rgba(255,222,89,0.15)');
        gGood.addColorStop(0.5, '#ffde59');
        gGood.addColorStop(1,   'rgba(255,222,89,0.15)');
        ctx.fillStyle = gGood;
        ctx.fillRect(0, yGoodStart, W, yGoodEnd - yGoodStart);
        ctx.restore();

        // Draw GREAT zone (green, medium)
        ctx.save();
        ctx.shadowColor = '#7ed957'; ctx.shadowBlur = 20;
        const gGreat = ctx.createLinearGradient(0, yGreatStart, 0, yGreatEnd);
        gGreat.addColorStop(0,   'rgba(126,217,87,0.15)');
        gGreat.addColorStop(0.5, '#7ed957');
        gGreat.addColorStop(1,   'rgba(126,217,87,0.15)');
        ctx.fillStyle = gGreat;
        ctx.fillRect(0, yGreatStart, W, yGreatEnd - yGreatStart);
        ctx.restore();

        // Draw PERFECT zone (white/red, center)
        ctx.save();
        ctx.shadowColor = '#ff4a4a'; ctx.shadowBlur = 22;
        const gPerfect = ctx.createLinearGradient(0, yPerfectStart, 0, yPerfectEnd);
        gPerfect.addColorStop(0,   'rgba(255,74,74,0.15)');
        gPerfect.addColorStop(0.5, '#ffffff');
        gPerfect.addColorStop(1,   'rgba(255,74,74,0.15)');
        ctx.fillStyle = gPerfect;
        ctx.fillRect(0, yPerfectStart, W, yPerfectEnd - yPerfectStart);
        ctx.restore();
      }

      function drawNotes() {
        for (const note of activeNotes) {
          if (note.opacity <= 0 || note.progress < 0.02) continue;
          const p  = note.progress;
          const sc = note.hitAnimating ? note.hitScale : 1;
          const x  = laneCenter(note.lane, p);
          const y  = progressY(p);
          const r  = noteR(p) * sc;
          if (r < 2) continue;
          ctx.save();
          ctx.globalAlpha = Math.max(0, note.opacity);
          ctx.shadowColor = note.hit ? '#ffffff' : laneColors[note.lane];
          ctx.shadowBlur  = note.hit ? r * 2.5 : r * 0.8;
          const rg = ctx.createRadialGradient(x - r*0.28, y - r*0.28, r*0.06, x, y, r);
          rg.addColorStop(0,   lighten(laneColors[note.lane], 80));
          rg.addColorStop(0.6, laneColors[note.lane]);
          rg.addColorStop(1,   darken(laneColors[note.lane], 35));
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = rg; ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.95)';
          ctx.lineWidth   = Math.max(1.5, r * 0.13);
          ctx.stroke();
          ctx.shadowBlur = 3; ctx.shadowColor = 'rgba(0,0,0,0.55)';
          const fs = Math.max(6, r * 1.05);
          ctx.font = `bold ${fs}px Fredoka, sans-serif`;
          ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(note.letter, x, y);
          ctx.restore();
        }
      }

      function drawParticles() {
        for (const p of activeParticles) {
          if (p.opacity <= 0) continue;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.shadowColor = p.color; ctx.shadowBlur = p.r * 2;
          ctx.fillStyle   = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.5, p.r), 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }

      function hexA(hex, a) {
        const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
        return `rgba(${r},${g},${b},${a.toFixed(3)})`;
      }
      function clamp(v){ return Math.min(255, Math.max(0, v|0)); }
      function lighten(hex, amt){ return `rgb(${clamp(parseInt(hex.slice(1,3),16)+amt)},${clamp(parseInt(hex.slice(3,5),16)+amt)},${clamp(parseInt(hex.slice(5,7),16)+amt)})`; }
      function darken(hex, amt){ return lighten(hex,-amt); }

      function startSong(songData) {
        init();
        audioSynth.initAudio();
        score = 0; combo = 0; maxCombo = 0;
        updateHUD();
        isPlaying = true; isPaused = false;
        songElapsedTime = 0; lastFrameTime = performance.now();
        document.getElementById('game-over-panel').classList.remove('active');
        scheduleBackgroundBeat(songData.bpm);
      }

      let drumBeatInterval = null;
      let beatCounter = 0;

      function scheduleBackgroundBeat(bpm) {
        if (drumBeatInterval) clearInterval(drumBeatInterval);
        beatCounter = 0;
        const period = (60 / bpm) * 1000;
        drumBeatInterval = setInterval(() => {
          if (!isPlaying || isPaused) return;
          if (beatCounter % 2 === 0) audioSynth.playDrumKick(0);
          else audioSynth.playDrumSnare(0);
          for (let i = 0; i < numLanes; i++) lanePulse[i] = Math.min(1, lanePulse[i] + 0.6);
          beatCounter++;
        }, period);
      }

      function togglePause() {
        if (!isPlaying) return;
        isPaused = !isPaused;
        const btn = document.querySelector('.game-actions button:last-child');
        if (isPaused) btn.textContent = '\u25B6';
        else { btn.textContent = '\u23F8'; lastFrameTime = performance.now(); }
      }

      function stop() {
        isPlaying = false; isPaused = false;
        if (drumBeatInterval) clearInterval(drumBeatInterval);
        window.removeEventListener('resize', computeLayout);
      }

      function update(timeMs) {
        if (!isPlaying) return;
        const now = performance.now();
        let dt = (now - lastFrameTime) / 1000;
        lastFrameTime = now;
        dt = Math.min(0.1, Math.max(0, dt));

        if (!isPaused) {
          songElapsedTime += dt;
          const song = gameSequencer.getCurrentSong();
          if (!song) return;
          const beatDur = 60 / song.bpm;

          song.notes.forEach((n, idx) => {
            const hitTime   = n.beat * beatDur;
            const spawnTime = hitTime - TRAVEL_TIME;
            if (songElapsedTime >= spawnTime && !spawnedNoteIndices.has(idx)) {
              spawnedNoteIndices.add(idx);
              spawnNote(n.note, hitTime, idx);
            }
          });

          for (let i = activeNotes.length - 1; i >= 0; i--) {
            const note = activeNotes[i];
            note.progress += NOTE_SPEED * dt;
            if (!note.hit && !note.missed && note.progress > T_MISS) {
              note.missed = true; combo = 0; showComboFeedback('MISS', 0);
            }
            if (note.missed)               note.opacity -= 0.055;
            if (note.hit && note.hitAnimating) {
              note.hitScale += 0.07; note.opacity -= 0.075;
              if (note.opacity <= 0) note.hitAnimating = false;
            }
            if (note.opacity <= 0 || note.progress > 1.25) activeNotes.splice(i, 1);
          }

          for (let i = activeParticles.length - 1; i >= 0; i--) {
            const p = activeParticles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.opacity -= 0.022;
            if (p.opacity <= 0) activeParticles.splice(i, 1);
          }

          for (let i = 0; i < numLanes; i++) lanePulse[i] = Math.max(0, lanePulse[i] - 0.045);

          if (spawnedNoteIndices.size === song.notes.length && activeNotes.length === 0) {
            endSong(); return;
          }
        }
        draw();
      }

      function spawnNote(letter, hitTime, originalIndex) {
        const lane = letterToLaneMap[letter];
        if (lane === undefined) return;
        activeNotes.push({ letter, lane, hitTime, originalIndex,
          progress:0, opacity:1, hit:false, missed:false, hitAnimating:false, hitScale:1 });
      }

      function laneTriggerPress(laneIdx) {
        if (!isPlaying || isPaused) return;
        lanePulse[laneIdx] = 1.0;
        const btn = document.getElementById(`btn-${laneIdx}`);
        if (btn) btn.classList.add('active');
        audioSynth.playChime(['A','B','C','D','E','F','G'][laneIdx], 0.4);
        let best = null, bestDist = 9999;
        for (const note of activeNotes) {
          if (note.lane === laneIdx && !note.hit && !note.missed) {
            const dist = Math.abs(note.progress - HIT_P);
            if (dist < bestDist) { bestDist = dist; best = note; }
          }
        }
        if (best) {
          if      (bestDist <= T_PERFECT) triggerHit(best,'PERFECT',100);
          else if (bestDist <= T_GREAT)   triggerHit(best,'GREAT',   50);
          else if (bestDist <= T_GOOD)    triggerHit(best,'GOOD',    25);
        }
      }

      function laneTriggerRelease(laneIdx) {
        const btn = document.getElementById(`btn-${laneIdx}`);
        if (btn) btn.classList.remove('active');
      }

      function triggerHit(note, rating, points) {
        note.hit = true; note.hitAnimating = true;
        score += points; combo++;
        if (combo > maxCombo) maxCombo = combo;
        showComboFeedback(rating, combo); updateHUD(); spawnExplosion(note);
      }

      function spawnExplosion(note) {
        const x = laneCenter(note.lane, note.progress);
        const y = progressY(note.progress);
        for (let i = 0; i < 22; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd   = 2.5 + Math.random() * 5.5;
          activeParticles.push({ x, y,
            vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd - 3.5,
            r: 3 + Math.random()*5, opacity:1, color: laneColors[note.lane] });
        }
      }

      function showComboFeedback(rating, currentCombo) {
        const c = document.getElementById('combo-feedback');
        document.getElementById('feedback-rating').textContent = rating;
        document.getElementById('feedback-combo').textContent  = rating==='MISS' ? 'Missed Beat' : `${currentCombo}x Combo`;
        c.className = `combo-feedback ${rating.toLowerCase()}`;
        c.classList.remove('animate'); void c.offsetWidth; c.classList.add('animate');
      }

      function updateHUD() {
        document.getElementById('game-score').textContent = score.toString().padStart(4,'0');
        [1,2,3].forEach((n,i)=>document.getElementById(`hud-star-${n}`).classList.toggle('active',score>=[300,850,1400][i]));
      }

      function endSong() {
        stop();
        document.getElementById('result-score-val').textContent = score;
        document.getElementById('result-max-combo').textContent = `Max Combo: ${maxCombo}`;
        const box = document.getElementById('result-stars-box');
        box.innerHTML = '';
        [300,850,1400].forEach(t => {
          const s = document.createElement('span');
          s.textContent = '\u2605';
          s.style.color = score>=t ? '#ffde59' : 'rgba(255,255,255,0.2)';
          if (score>=t) s.style.textShadow='0 0 8px rgba(255,222,89,0.8)';
          box.appendChild(s);
        });
        document.getElementById('game-over-panel').classList.add('active');
      }

      return {
        startSong, togglePause, stop, update,
        laneTriggerPress, laneTriggerRelease,
        getActiveNotes:     () => activeNotes,
        getActiveParticles: () => activeParticles
      };
    })();


    // --- GAME SEQUENCER CONTROLLER ---
    const gameSequencer = (() => {
      let currentSongId = 'twinkle';
      let loopId = null;

      function selectSong(songId) {
        currentSongId = songId;
        authModule.switchScreen('game-screen');
        
        const songData = SONGS[songId];
        gameEngine.startSong(songData);

        // Start Three.js requestAnimationFrame loop
        if (loopId) cancelAnimationFrame(loopId);
        
        function tick(timestamp) {
          gameEngine.update(timestamp);
          loopId = requestAnimationFrame(tick);
        }
        loopId = requestAnimationFrame(tick);
      }

      function restartSong() {
        selectSong(currentSongId);
      }

      function exitToMenu() {
        if (loopId) cancelAnimationFrame(loopId);
        gameEngine.stop();
        authModule.switchScreen('song-selection-screen');
      }

      function getCurrentSong() {
        return SONGS[currentSongId];
      }

      return {
        selectSong,
        restartSong,
        exitToMenu,
        getCurrentSong
      };
    })();

    // --- KEYBOARD MAPPINGS FOR DESKTOP GAME TESTING ---
    // Bind A, S, D, F, G, H, J keys as well as literal A B C D E F G
    const keyMap = {
      // Lane 0: A
      'KeyA': 0, 'a': 0, 'A': 0,
      // Lane 1: B
      'KeyS': 1, 'KeyB': 1, 'b': 1, 'B': 1,
      // Lane 2: C
      'KeyD': 2, 'KeyC': 2, 'c': 2, 'C': 2,
      // Lane 3: D
      'KeyF': 3, 'KeyD_alt': 3, 'd': 3, 'D': 3,
      // Lane 4: E
      'KeyG': 4, 'KeyE': 4, 'e': 4, 'E': 4,
      // Lane 5: F
      'KeyH': 5, 'KeyF_alt': 5, 'f': 5, 'F': 5,
      // Lane 6: G
      'KeyJ': 6, 'KeyG_alt': 6, 'g': 6, 'G': 6
    };

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const lane = keyMap[e.code] !== undefined ? keyMap[e.code] : keyMap[e.key];
      if (lane !== undefined) {
        gameEngine.laneTriggerPress(lane);
      }
    });

    window.addEventListener('keyup', (e) => {
      const lane = keyMap[e.code] !== undefined ? keyMap[e.code] : keyMap[e.key];
      if (lane !== undefined) {
        gameEngine.laneTriggerRelease(lane);
      }
    });

    // --- STARTUP INVOCATION ---
    window.addEventListener('DOMContentLoaded', () => {
      authModule.checkAutoLogin();
    });
