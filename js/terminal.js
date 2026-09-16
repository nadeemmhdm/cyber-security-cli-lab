/**
 * Interactive Cyber Terminal Engine
 * Supports ANSI color translation, command history, Tab auto-completion,
 * keyboard navigation, audio sound synthesis, Fullscreen mode, and Click-to-Copy tokens.
 */

class Terminal {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.history = [];
    this.historyIndex = -1;
    this.commandEngine = null;
    this.currentPromptUser = 'level0';
    this.currentPromptHost = 'cyberlab';
    this.soundEnabled = true;
    this.isFullscreen = false;

    this.audioCtx = null;
    this.initAudio();

    this.renderBaseTerminal();
    this.bindEvents();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('AudioContext not supported', e);
    }
  }

  playKeystrokeSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  playSuccessSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.06, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.18);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  setEngine(engine) {
    this.commandEngine = engine;
  }

  renderBaseTerminal() {
    this.container.innerHTML = `
      <div class="terminal-screen" id="terminalScreen">
        <div class="terminal-header-bar">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="terminal-title">
            <i class="bx bx-terminal"></i> bash - <span id="termSessionTitle">level0@cyberlab:~</span>
          </div>
          <div class="terminal-header-actions">
            <button class="term-header-btn" id="btnFullscreenToggle" title="Toggle Terminal Fullscreen (F11/Esc)">
              <i class="bx bx-fullscreen"></i>
            </button>
            <button class="term-header-btn" id="btnScanlineToggle" title="Toggle CRT Scanlines">
              <i class="bx bx-tv"></i>
            </button>
            <button class="term-header-btn" id="btnClearTerm" title="Clear Terminal (Ctrl+L)">
              <i class="bx bx-trash"></i>
            </button>
          </div>
        </div>
        <div class="terminal-body" id="terminalBody">
          <div class="terminal-output" id="terminalOutput"></div>
          <div class="terminal-input-row" id="terminalInputRow">
            <span class="terminal-prompt" id="terminalPrompt">
              <span class="prompt-user" id="promptUser">level0</span><span class="prompt-at">@</span><span class="prompt-host">cyberlab</span><span class="prompt-colon">:</span><span class="prompt-path" id="promptPath">~</span><span class="prompt-char">$</span>
            </span>
            <div class="terminal-input-wrapper">
              <input type="text" id="terminalInput" class="terminal-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" autofocus />
            </div>
          </div>
        </div>
        <div class="terminal-scanlines" id="terminalScanlines"></div>
      </div>
    `;

    this.screenEl = document.getElementById('terminalScreen');
    this.outputEl = document.getElementById('terminalOutput');
    this.inputEl = document.getElementById('terminalInput');
    this.promptPathEl = document.getElementById('promptPath');
    this.promptUserEl = document.getElementById('promptUser');
    this.sessionTitleEl = document.getElementById('termSessionTitle');
    this.scanlinesEl = document.getElementById('terminalScanlines');
    this.bodyEl = document.getElementById('terminalBody');
    this.btnFullscreen = document.getElementById('btnFullscreenToggle');

    // Click anywhere on terminal body to focus input
    this.bodyEl.addEventListener('click', (e) => {
      // Don't focus input if user clicked a copyable token
      if (e.target.closest('.copyable-token')) return;
      this.inputEl.focus();
    });

    document.getElementById('btnClearTerm').addEventListener('click', () => this.clear());
    document.getElementById('btnScanlineToggle').addEventListener('click', () => {
      this.scanlinesEl.classList.toggle('active');
    });

    this.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());

    // Listen for click on copyable tokens inside terminal
    this.outputEl.addEventListener('click', (e) => {
      const tokenSpan = e.target.closest('.copyable-token');
      if (tokenSpan) {
        const textToCopy = tokenSpan.dataset.copy || tokenSpan.innerText.trim();
        this.copyToClipboard(textToCopy, tokenSpan);
      }
    });

    // Escape key exits fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isFullscreen) {
        this.toggleFullscreen(false);
      }
    });
  }

  toggleFullscreen(forceState = null) {
    this.isFullscreen = forceState !== null ? forceState : !this.isFullscreen;
    this.screenEl.classList.toggle('terminal-fullscreen', this.isFullscreen);

    const icon = this.btnFullscreen.querySelector('i');
    if (icon) {
      icon.className = this.isFullscreen ? 'bx bx-exit-fullscreen' : 'bx bx-fullscreen';
    }
    this.btnFullscreen.title = this.isFullscreen ? 'Exit Fullscreen (Esc)' : 'Toggle Terminal Fullscreen (F11/Esc)';

    // Scroll to bottom and refocus
    setTimeout(() => {
      this.scrollToBottom();
      this.inputEl.focus();
    }, 100);
  }

  async copyToClipboard(text, element = null) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (element) {
        element.classList.add('copied');
        setTimeout(() => element.classList.remove('copied'), 1500);
      }

      // Auto-fill sidebar flag input for frictionless play!
      const flagInput = document.getElementById('sidebarFlagInput');
      if (flagInput) {
        flagInput.value = text;
        flagInput.focus();
      }

      // Show sleek toast notification
      if (window.app?.showToast) {
        window.app.showToast(`📋 Copied "${text}" to clipboard!`, 'bx-copy');
      }
      this.playKeystrokeSound();
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  }

  updatePrompt(user, path) {
    this.currentPromptUser = user;
    this.promptUserEl.textContent = user;
    const displayPath = path.startsWith(`/home/${user}`) ? path.replace(`/home/${user}`, '~') : path;
    this.promptPathEl.textContent = displayPath || '~';
    this.sessionTitleEl.textContent = `${user}@cyberlab:${displayPath || '~'}`;
  }

  bindEvents() {
    this.inputEl.addEventListener('keydown', async (e) => {
      this.playKeystrokeSound();

      if (e.key === 'Enter') {
        e.preventDefault();
        const commandText = this.inputEl.value;
        this.inputEl.value = '';
        await this.handleCommand(commandText);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0) {
          if (this.historyIndex === -1) {
            this.historyIndex = this.history.length - 1;
          } else if (this.historyIndex > 0) {
            this.historyIndex--;
          }
          this.inputEl.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex !== -1) {
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.inputEl.value = this.history[this.historyIndex] || '';
          } else {
            this.historyIndex = -1;
            this.inputEl.value = '';
          }
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabComplete();
      } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        this.clear();
      } else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        this.printPromptLine(this.inputEl.value + '^C');
        this.inputEl.value = '';
      }
    });
  }

  handleTabComplete() {
    const currentVal = this.inputEl.value;
    const parts = currentVal.split(' ');
    const lastPart = parts[parts.length - 1];

    if (parts.length === 1) {
      // Auto-complete commands
      const allCommands = Object.keys(window.COMMAND_DOCS || {}).concat(['submit', 'clear', 'hint', 'su', 'history']);
      const matches = allCommands.filter(c => c.startsWith(lastPart));
      if (matches.length === 1) {
        this.inputEl.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.printPromptLine(currentVal);
        this.printOutput(matches.join('  '));
      }
    } else if (this.commandEngine?.vfs) {
      // Auto-complete files in current directory
      const list = this.commandEngine.vfs.listDirectory('.');
      if (list.success) {
        const fileNames = list.entries.map(e => e.name);
        const matches = fileNames.filter(f => f.startsWith(lastPart));
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          this.inputEl.value = parts.join(' ');
        } else if (matches.length > 1) {
          this.printPromptLine(currentVal);
          this.printOutput(matches.join('  '));
        }
      }
    }
  }

  async handleCommand(rawCmd) {
    this.printPromptLine(rawCmd);

    const trimmed = rawCmd.trim();
    if (trimmed) {
      this.history.push(trimmed);
      this.historyIndex = -1;
    }

    if (this.commandEngine && trimmed) {
      const result = await this.commandEngine.execute(trimmed);
      if (result.stdout) {
        this.printOutput(result.stdout);
        if (result.stdout.includes('UNLOCKED') || result.stdout.includes('CONGRATULATIONS')) {
          this.playSuccessSound();
        }
      }
      if (result.stderr) {
        this.printOutput(result.stderr, 'terminal-error');
      }

      // Update prompt path & user
      this.updatePrompt(this.commandEngine.vfs.currentUser, this.commandEngine.vfs.currentPath);
    }

    this.scrollToBottom();
  }

  printPromptLine(cmdText) {
    const row = document.createElement('div');
    row.className = 'terminal-echo-row';
    const path = this.promptPathEl.textContent;
    const user = this.currentPromptUser;
    row.innerHTML = `
      <span class="terminal-prompt">
        <span class="prompt-user">${user}</span><span class="prompt-at">@</span><span class="prompt-host">cyberlab</span><span class="prompt-colon">:</span><span class="prompt-path">${path}</span><span class="prompt-char">$</span>
      </span>
      <span class="terminal-echo-text">${this.escapeHtml(cmdText)}</span>
    `;
    this.outputEl.appendChild(row);
  }

  printOutput(text, customClass = '') {
    if (!text) return;
    const block = document.createElement('div');
    block.className = `terminal-output-block ${customClass}`;
    block.innerHTML = this.ansiToHtml(text);
    this.outputEl.appendChild(block);
    this.scrollToBottom();
  }

  printBanner(bannerText) {
    this.printOutput(bannerText, 'terminal-banner');
  }

  clear() {
    this.outputEl.innerHTML = '';
    this.inputEl.value = '';
    this.inputEl.focus();
  }

  scrollToBottom() {
    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  }

  typeCommand(cmdText) {
    this.inputEl.value = cmdText;
    this.inputEl.focus();
    // Position cursor at end
    this.inputEl.setSelectionRange(cmdText.length, cmdText.length);
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Converts basic ANSI color escape codes to styled HTML and wraps passwords in click-to-copy tokens
  ansiToHtml(str) {
    let s = this.escapeHtml(str);

    // ANSI escape code parsing
    s = s.replace(/\x1b\[32m/g, '<span class="ansi-green">');
    s = s.replace(/\x1b\[1;36m/g, '<span class="ansi-cyan-bold">');
    s = s.replace(/\x1b\[1;32m/g, '<span class="ansi-green-bold">');
    s = s.replace(/\x1b\[31m/g, '<span class="ansi-red">');
    s = s.replace(/\x1b\[33m/g, '<span class="ansi-yellow">');
    s = s.replace(/\x1b\[36m/g, '<span class="ansi-cyan">');
    s = s.replace(/\x1b\[1m/g, '<span class="ansi-bold">');
    s = s.replace(/\x1b\[0m/g, '</span>');

    // Automatic detection of passwords/tokens for 1-Click Copy
    // Matches:
    // 1) cyb3r_xxxxxxxx_xxxx or similar dynamic random passwords
    // 2) CYB3R_M4ST3R_..._2026
    // 3) Tokens following "Password: <token>" or "Password is <token>"
    s = s.replace(/\b([a-z0-9_]{3,10}_[a-f0-9]{8}_[a-z0-9_]{3,10})\b/gi, (match) => {
      return `<span class="copyable-token" data-copy="${match}" title="Click to copy password!"><span class="token-text">${match}</span><i class="bx bx-copy copy-icon"></i></span>`;
    });

    s = s.replace(/\b(CYB3R_M4ST3R_[A-F0-9]{8}_2026)\b/g, (match) => {
      return `<span class="copyable-token" data-copy="${match}" title="Click to copy Master Flag!"><span class="token-text">${match}</span><i class="bx bx-copy copy-icon"></i></span>`;
    });

    return s;
  }
}

window.Terminal = Terminal;
