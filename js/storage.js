/**
 * Progress Persistence and Storage Management
 * Handles localStorage auto-save, export, import, dynamic random level passwords,
 * Cyber Coins economy, Daily Practice Streaks, and Hint Unlocks.
 */

function generateRandomHex(length = 8) {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomLevelPassword(levelId) {
  if (levelId === 34) {
    return `CYB3R_M4ST3R_${generateRandomHex(8).toUpperCase()}_2026`;
  }
  const prefixes = [
    'cyb3r', 'l1nux', 't0k3n', 's3cr3t', 'fl4g', 'p4ss', 'h4ck', 'sh3ll',
    'pr1v', 'k3y', 'p0rt', 'd4t4', 'cr0n', 'su1d', 'g1t', 'b1n', 'r00t'
  ];
  const p1 = prefixes[levelId % prefixes.length];
  const p2 = prefixes[(levelId * 3 + 5) % prefixes.length];
  return `${p1}_${generateRandomHex(8)}_${p2}`;
}

class StorageManager {
  constructor() {
    this.storageKey = 'cyberlab_progress_v1';
    this.state = this.loadState();
    this.checkDailyStreak();
  }

  generateAllLevelPasswords() {
    const passwords = {};
    for (let i = 0; i < 35; i++) {
      passwords[i] = generateRandomLevelPassword(i);
    }
    return passwords;
  }

  getDefaultState() {
    const passwords = this.generateAllLevelPasswords();
    const today = new Date().toISOString().slice(0, 10);
    return {
      currentLevel: 0,
      unlockedLevels: [0],
      completedLevels: [],
      score: 0,
      coins: 100, // Starter bonus coins for hints!
      streak: {
        count: 1,
        lastDate: today,
        claimedToday: false
      },
      unlockedHints: {}, // { levelId: [0, 1] }
      commandsRun: 0,
      startedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      levelPasswords: passwords,
      passwordsDiscovered: {}
    };
  }

  loadState() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed.currentLevel === 'number') {
          const merged = { ...this.getDefaultState(), ...parsed };
          if (!merged.levelPasswords || Object.keys(merged.levelPasswords).length < 35) {
            merged.levelPasswords = this.generateAllLevelPasswords();
          }
          if (merged.coins === undefined) merged.coins = 100;
          if (!merged.streak) {
            merged.streak = { count: 1, lastDate: new Date().toISOString().slice(0, 10), claimedToday: false };
          }
          if (!merged.unlockedHints) merged.unlockedHints = {};
          return merged;
        }
      }
    } catch (e) {
      console.warn('Could not read state from localStorage', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      this.state.lastActive = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  checkDailyStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const streak = this.state.streak || { count: 1, lastDate: today, claimedToday: false };

    if (!streak.lastDate) {
      streak.lastDate = today;
      streak.count = 1;
      streak.claimedToday = true;
      this.saveState();
      return { rewarded: true, count: 1, bonus: 25 };
    }

    if (streak.lastDate === today) {
      return { rewarded: false, count: streak.count, bonus: 0 };
    }

    const prevDate = new Date(streak.lastDate);
    const currDate = new Date(today);
    const diffTime = Math.abs(currDate - prevDate);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day streak!
      streak.count += 1;
      streak.lastDate = today;
      streak.claimedToday = true;
      const bonus = Math.min(100, 25 * streak.count);
      this.addCoins(bonus);
      this.saveState();
      return { rewarded: true, count: streak.count, bonus };
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      streak.count = 1;
      streak.lastDate = today;
      streak.claimedToday = true;
      const bonus = 25;
      this.addCoins(bonus);
      this.saveState();
      return { rewarded: true, count: 1, bonus };
    }

    return { rewarded: false, count: streak.count, bonus: 0 };
  }

  addCoins(amount) {
    this.state.coins = (this.state.coins || 0) + amount;
    this.saveState();
    return this.state.coins;
  }

  spendCoins(amount) {
    if ((this.state.coins || 0) >= amount) {
      this.state.coins -= amount;
      this.saveState();
      return true;
    }
    return false;
  }

  isHintUnlocked(levelId, tierIndex) {
    // Tier 1 (index 0) is always free for learners
    if (tierIndex === 0) return true;

    const list = this.state.unlockedHints?.[levelId];
    return Array.isArray(list) && list.includes(tierIndex);
  }

  unlockHint(levelId, tierIndex, cost) {
    if (this.isHintUnlocked(levelId, tierIndex)) return { success: true };

    if (this.spendCoins(cost)) {
      if (!this.state.unlockedHints) this.state.unlockedHints = {};
      if (!this.state.unlockedHints[levelId]) this.state.unlockedHints[levelId] = [0];
      if (!this.state.unlockedHints[levelId].includes(tierIndex)) {
        this.state.unlockedHints[levelId].push(tierIndex);
      }
      this.saveState();
      return { success: true, remainingCoins: this.state.coins };
    }
    return { success: false, needed: cost, available: this.state.coins || 0 };
  }

  getLevelPassword(levelId) {
    if (!this.state.levelPasswords || !this.state.levelPasswords[levelId]) {
      if (!this.state.levelPasswords) this.state.levelPasswords = {};
      this.state.levelPasswords[levelId] = generateRandomLevelPassword(levelId);
      this.saveState();
    }
    return this.state.levelPasswords[levelId];
  }

  randomizeAllPasswords() {
    this.state.levelPasswords = this.generateAllLevelPasswords();
    this.saveState();
    return this.state.levelPasswords;
  }

  unlockLevel(levelId, passwordDiscovered) {
    if (!this.state.unlockedLevels.includes(levelId)) {
      this.state.unlockedLevels.push(levelId);
      this.state.unlockedLevels.sort((a, b) => a - b);
    }
    const prevLevel = levelId - 1;
    if (prevLevel >= 0 && !this.state.completedLevels.includes(prevLevel)) {
      this.state.completedLevels.push(prevLevel);
      this.state.score += 100;
      // Award Cyber Coins for completing level!
      this.addCoins(50);
    }
    if (passwordDiscovered) {
      this.state.passwordsDiscovered[prevLevel] = passwordDiscovered;
    }
    this.state.currentLevel = levelId;
    this.saveState();
  }

  setCurrentLevel(levelId) {
    if (this.state.unlockedLevels.includes(levelId)) {
      this.state.currentLevel = levelId;
      this.saveState();
      return true;
    }
    return false;
  }

  incrementCommands() {
    this.state.commandsRun = (this.state.commandsRun || 0) + 1;
    this.saveState();
  }

  resetProgress(randomizePasswords = true) {
    this.state = this.getDefaultState();
    if (randomizePasswords) {
      this.state.levelPasswords = this.generateAllLevelPasswords();
    }
    this.saveState();
  }

  exportProgress() {
    const jsonStr = JSON.stringify(this.state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberlab_backup_level${this.state.currentLevel}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importProgress(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.currentLevel === 'number' && Array.isArray(parsed.unlockedLevels)) {
        this.state = { ...this.getDefaultState(), ...parsed };
        if (!this.state.levelPasswords || Object.keys(this.state.levelPasswords).length < 35) {
          this.state.levelPasswords = this.generateAllLevelPasswords();
        }
        this.saveState();
        return { success: true };
      }
      return { success: false, error: 'Invalid progress JSON structure.' };
    } catch (e) {
      return { success: false, error: 'Failed to parse JSON file: ' + e.message };
    }
  }
}

window.StorageManager = StorageManager;
