/**
 * Main Application Coordinator
 * Integrates Terminal, VFS, Levels, Storage, and UI Modals.
 */

class App {
  constructor() {
    this.storage = new StorageManager();
    this.vfs = new VirtualFileSystem();
    this.terminal = new Terminal('terminalContainer');
    this.engine = new CommandEngine(this.vfs, this.storage, this.terminal);
    this.terminal.setEngine(this.engine);

    this.currentLevelId = this.storage.state.currentLevel || 0;

    this.initUI();
    this.loadLevel(this.currentLevelId, false);
    this.renderWelcome();
  }

  initUI() {
    // Top Bar Actions
    document.getElementById('btnOpenManual')?.addEventListener('click', () => this.openManualModal());
    document.getElementById('btnOpenHints')?.addEventListener('click', () => this.openHintModal());
    document.getElementById('btnOpenLevels')?.addEventListener('click', () => this.openLevelsModal());
    document.getElementById('btnOpenSettings')?.addEventListener('click', () => this.openSettingsModal());

    // Sound toggle
    const soundBtn = document.getElementById('btnToggleSound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.terminal.soundEnabled = !this.terminal.soundEnabled;
        const icon = soundBtn.querySelector('i');
        if (icon) {
          icon.className = this.terminal.soundEnabled ? 'bx bx-volume-full' : 'bx bx-volume-mute';
        }
        soundBtn.classList.toggle('active', this.terminal.soundEnabled);
      });
    }

    // Flag submission from sidebar form
    const flagForm = document.getElementById('flagSubmitForm');
    if (flagForm) {
      flagForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('sidebarFlagInput');
        if (input && input.value.trim()) {
          this.terminal.handleCommand(`submit ${input.value.trim()}`);
          input.value = '';
        }
      });
    }

    // Mobile Virtual Keyboard Helpers
    const virtualKeys = document.querySelectorAll('.virtual-key');
    virtualKeys.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const insert = btn.dataset.insert;
        if (insert) {
          this.terminal.typeCommand(this.terminal.inputEl.value + insert);
        } else if (action === 'tab') {
          this.terminal.handleTabComplete();
        } else if (action === 'enter') {
          const val = this.terminal.inputEl.value;
          this.terminal.inputEl.value = '';
          this.terminal.handleCommand(val);
        } else if (action === 'ctrl-c') {
          this.terminal.printPromptLine(this.terminal.inputEl.value + '^C');
          this.terminal.inputEl.value = '';
        } else if (action === 'clear') {
          this.terminal.clear();
        } else if (action === 'hint') {
          this.openHintModal();
        }
      });
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          this.closeAllModals();
        }
      });
    });

    // Modal Search in Command Manual
    const manualSearch = document.getElementById('manualSearchInput');
    if (manualSearch) {
      manualSearch.addEventListener('input', (e) => {
        this.filterManualList(e.target.value);
      });
    }

    // Export/Import in Settings
    document.getElementById('btnExportProgress')?.addEventListener('click', () => {
      this.storage.exportProgress();
    });

    document.getElementById('btnImportProgressTrigger')?.addEventListener('click', () => {
      document.getElementById('importFileInput')?.click();
    });

    document.getElementById('importFileInput')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = this.storage.importProgress(event.target.result);
          if (res.success) {
            alert('Progress imported successfully!');
            this.loadLevel(this.storage.state.currentLevel);
            this.closeAllModals();
          } else {
            alert('Failed to import: ' + res.error);
          }
        };
        reader.readAsText(file);
      }
    });

    document.getElementById('btnRandomizePasswords')?.addEventListener('click', () => {
      if (confirm('Randomize passwords for all 35 levels? New random passwords will be generated immediately.')) {
        this.storage.randomizeAllPasswords();
        this.loadLevel(this.currentLevelId, false);
        this.closeAllModals();
        this.terminal.printOutput('\n\x1b[1;33m[!] All 35 level passwords have been freshly randomized!\x1b[0m\nFilesystem reloaded with new secret tokens.\n');
      }
    });

    document.getElementById('btnResetProgress')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all progress? You will restart at Level 0 with fresh random passwords.')) {
        this.storage.resetProgress(true);
        this.loadLevel(0);
        this.closeAllModals();
        this.terminal.clear();
        this.renderWelcome();
      }
    });

    // Populate the Manual Categories
    this.populateManualSidebar();
  }

  renderWelcome() {
    const banner = 
`========================================================================
     🛡️ CYBER SECURITY CLI WARGAME LAB (35 LEVELS) 🛡️
========================================================================
 Learn Linux commands, directory recon, file permissions, cryptography,
 network tools, and security privilege escalation.
 
 • Dynamic Random Passwords: Each lab run features unique generated tokens
 • Type 'help' to open the interactive Command & Attribute Manual
 • Type 'hint' if you get stuck on the current level
 • Type 'submit <password>' to unlock and advance to the next level
 • Use Tab for auto-completion and Up/Down arrows for history
========================================================================`;
    this.terminal.printBanner(banner);
  }

  loadLevel(levelId, printNotice = true) {
    const levelData = window.LEVELS[levelId];
    if (!levelData) return;

    this.currentLevelId = levelId;
    this.storage.setCurrentLevel(levelId);

    // Re-initialize VFS up to this level using each level's dynamic random password
    this.vfs = new VirtualFileSystem();
    for (let i = 0; i <= levelId; i++) {
      if (window.LEVELS[i]?.setup) {
        const pwd = this.storage.getLevelPassword(i);
        window.LEVELS[i].setup(this.vfs, pwd);
      }
    }

    const userName = `level${levelId}`;
    this.engine.vfs = this.vfs;
    this.engine.updateUser(userName);
    this.terminal.updatePrompt(userName, `/home/${userName}`);

    // Update Sidebar Briefing
    const titleEl = document.getElementById('sidebarLevelTitle');
    const catEl = document.getElementById('sidebarLevelCategory');
    const diffEl = document.getElementById('sidebarLevelDiff');
    const objEl = document.getElementById('sidebarLevelObjective');
    const cmdListEl = document.getElementById('sidebarCmdList');
    const levelBadgeEl = document.getElementById('headerLevelBadge');
    const completedBadgeEl = document.getElementById('headerCompletedCount');
    const scoreBadgeEl = document.getElementById('headerScoreCount');

    if (titleEl) titleEl.textContent = levelData.title;
    if (catEl) catEl.textContent = levelData.category;
    if (diffEl) {
      diffEl.textContent = levelData.difficulty;
      diffEl.className = `badge badge-${levelData.difficulty.toLowerCase()}`;
    }
    if (objEl) objEl.textContent = levelData.objective;
    if (levelBadgeEl) levelBadgeEl.textContent = `Level ${levelId}`;
    if (completedBadgeEl) completedBadgeEl.textContent = `${this.storage.state.completedLevels.length}/35`;
    if (scoreBadgeEl) scoreBadgeEl.textContent = `${this.storage.state.score} PTS`;

    if (cmdListEl) {
      cmdListEl.innerHTML = '';
      levelData.commandsUsed.forEach(cmd => {
        const span = document.createElement('span');
        span.className = 'cmd-tag';
        span.innerHTML = `<i class="bx bx-code-alt"></i> ${cmd}`;
        span.title = `Click to inspect '${cmd}' attributes in manual`;
        span.addEventListener('click', () => {
          const root = cmd.split(' ')[0];
          this.openManualModal(root);
        });
        cmdListEl.appendChild(span);
      });
    }

    if (printNotice) {
      this.terminal.printOutput(`\n\x1b[1;36m[>>> ENTERING ${levelData.title.toUpperCase()} <<<]\x1b[0m\n${levelData.objective}\n`);
    }
  }

  // ==========================================
  // MODALS MANAGEMENT
  // ==========================================
  closeAllModals() {
    document.querySelectorAll('.modal-wrapper').forEach(m => m.classList.remove('active'));
  }

  openManualModal(selectedCommand = 'ls') {
    this.closeAllModals();
    const modal = document.getElementById('manualModal');
    if (!modal) return;

    modal.classList.add('active');
    this.selectManualCommand(selectedCommand);
  }

  populateManualSidebar() {
    const listEl = document.getElementById('manualCommandsList');
    if (!listEl || !window.COMMAND_DOCS) return;

    listEl.innerHTML = '';
    Object.values(window.COMMAND_DOCS).forEach(doc => {
      const item = document.createElement('button');
      item.className = 'manual-nav-item';
      item.dataset.command = doc.command;
      item.innerHTML = `
        <span class="nav-cmd-name">${doc.command}</span>
        <span class="nav-cmd-cat">${doc.category}</span>
      `;
      item.addEventListener('click', () => {
        this.selectManualCommand(doc.command);
      });
      listEl.appendChild(item);
    });
  }

  selectManualCommand(cmdName) {
    const doc = window.COMMAND_DOCS[cmdName] || window.COMMAND_DOCS['ls'];
    if (!doc) return;

    // Highlight sidebar item
    document.querySelectorAll('.manual-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.command === doc.command);
    });

    const displayEl = document.getElementById('manualDetailDisplay');
    if (!displayEl) return;

    let attributesHtml = '';
    if (doc.attributes && doc.attributes.length > 0) {
      attributesHtml = `
        <div class="manual-attributes-section">
          <div class="section-title">
            <i class="bx bx-slider-alt"></i> Command Attributes & Flags Inspector
            <span class="attr-help-badge">Click an example to test in terminal!</span>
          </div>
          <div class="attributes-grid">
            ${doc.attributes.map(attr => `
              <div class="attribute-card">
                <div class="attribute-header">
                  <span class="attribute-flag">${attr.flag}</span>
                  <span class="attribute-long">${attr.longFlag}</span>
                </div>
                <div class="attribute-meaning">${attr.meaning}</div>
                <div class="attribute-security">
                  <strong><i class="bx bx-shield-quarter"></i> Security Context:</strong> ${attr.securityUse}
                </div>
                <div class="attribute-example-row">
                  <code class="attribute-code">${attr.example}</code>
                  <button class="btn-try-attribute" data-example="${attr.example}">
                    <i class="bx bx-play"></i> Try in Terminal
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      attributesHtml = `
        <div class="manual-attributes-section">
          <p class="text-muted">This utility runs with simple parameters or without required flags.</p>
        </div>
      `;
    }

    displayEl.innerHTML = `
      <div class="manual-detail-header">
        <div class="manual-detail-title">
          <h2>${doc.command} <span class="manual-category-badge">${doc.category}</span></h2>
          <p class="manual-subname">${doc.name}</p>
        </div>
        <div class="manual-quick-run">
          <button class="btn-primary btn-run-base" data-cmd="${doc.command}">
            <i class="bx bx-terminal"></i> Send '${doc.command}' to Terminal
          </button>
        </div>
      </div>

      <div class="manual-syntax-box">
        <span class="syntax-label">SYNTAX:</span>
        <code>${doc.syntax}</code>
      </div>

      <div class="manual-description-box">
        <h3>Description</h3>
        <p>${doc.description}</p>
      </div>

      <div class="manual-security-box">
        <h3><i class="bx bx-shield-quarter"></i> Cybersecurity & Recon Relevance</h3>
        <p>${doc.securityNote}</p>
      </div>

      ${attributesHtml}
    `;

    // Attach click handlers to "Try in Terminal" buttons
    displayEl.querySelectorAll('.btn-try-attribute').forEach(btn => {
      btn.addEventListener('click', () => {
        const example = btn.dataset.example;
        this.closeAllModals();
        this.terminal.typeCommand(example);
      });
    });

    displayEl.querySelector('.btn-run-base')?.addEventListener('click', () => {
      this.closeAllModals();
      this.terminal.typeCommand(doc.command);
    });
  }

  filterManualList(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    document.querySelectorAll('.manual-nav-item').forEach(item => {
      const cmd = item.dataset.command.toLowerCase();
      const text = item.textContent.toLowerCase();
      const match = cmd.includes(term) || text.includes(term);
      item.style.display = match ? 'flex' : 'none';
    });
  }

  openHintModal() {
    this.closeAllModals();
    const modal = document.getElementById('hintModal');
    if (!modal) return;

    const levelData = window.LEVELS[this.currentLevelId];
    if (!levelData) return;

    const bodyEl = document.getElementById('hintModalBody');
    bodyEl.innerHTML = `
      <div class="hint-header-info">
        <h3>${levelData.title}</h3>
        <p>${levelData.objective}</p>
      </div>
      <div class="hint-tiers-container">
        ${levelData.hints.map((hint, idx) => `
          <div class="hint-tier-card">
            <div class="hint-tier-header">
              <span class="tier-badge">Tier ${idx + 1}</span>
              <span class="tier-name">${idx === 0 ? 'Directional Clue' : idx === 1 ? 'Command & Attribute Strategy' : 'Solution Blueprint'}</span>
            </div>
            <div class="hint-tier-content">
              <p>${hint}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="hint-recommended-section">
        <strong>Recommended Command Utilities:</strong>
        <div class="cmd-pill-row">
          ${levelData.commandsUsed.map(c => `<span class="cmd-tag"><i class="bx bx-terminal"></i> ${c}</span>`).join('')}
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  openLevelsModal() {
    this.closeAllModals();
    const modal = document.getElementById('levelsModal');
    if (!modal) return;

    const gridEl = document.getElementById('levelsGrid');
    gridEl.innerHTML = '';

    window.LEVELS.forEach(lvl => {
      const isUnlocked = this.storage.state.unlockedLevels.includes(lvl.id);
      const isCompleted = this.storage.state.completedLevels.includes(lvl.id);
      const isCurrent = this.currentLevelId === lvl.id;

      const card = document.createElement('div');
      card.className = `level-grid-card ${isCurrent ? 'current' : isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="lvl-card-top">
          <span class="lvl-id">Level ${lvl.id}</span>
          <span class="lvl-status-icon">
            ${isCurrent ? '<i class="bx bx-target-lock"></i>' : isCompleted ? '<i class="bx bx-check-double"></i>' : isUnlocked ? '<i class="bx bx-lock-open-alt"></i>' : '<i class="bx bx-lock-alt"></i>'}
          </span>
        </div>
        <div class="lvl-card-title">${lvl.title.replace(/^Level \d+: /, '')}</div>
        <div class="lvl-card-cat">${lvl.category}</div>
        <div class="lvl-card-diff">${lvl.difficulty}</div>
      `;

      if (isUnlocked) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          this.loadLevel(lvl.id);
          this.closeAllModals();
        });
      }

      gridEl.appendChild(card);
    });

    modal.classList.add('active');
  }

  openSettingsModal() {
    this.closeAllModals();
    const modal = document.getElementById('settingsModal');
    if (modal) {
      document.getElementById('settingsUnlockedCount').textContent = this.storage.state.unlockedLevels.length;
      document.getElementById('settingsCompletedCount').textContent = this.storage.state.completedLevels.length;
      document.getElementById('settingsTotalCmds').textContent = this.storage.state.commandsRun;
      modal.classList.add('active');
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
