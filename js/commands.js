/**
 * Linux Command Engine and Pipeline Parser
 * Simulates standard GNU coreutils and security tools with real attribute evaluation.
 */

class CommandEngine {
  constructor(vfs, storage, terminal) {
    this.vfs = vfs;
    this.storage = storage;
    this.terminal = terminal;
    this.assistantEnabled = typeof localStorage !== 'undefined' ? (localStorage.getItem('cyber_assistant_enabled') !== 'false') : true;
    this.env = {
      USER: 'level0',
      HOME: '/home/level0',
      PATH: '/bin:/usr/bin:/usr/local/bin',
      SHELL: '/bin/bash',
      TERM: 'xterm-256color',
      LANG: 'en_US.UTF-8',
      LEVEL32_SECRET_TOKEN: this.storage.getLevelPassword(31)
    };
  }

  updateUser(user) {
    this.env.USER = user;
    this.env.HOME = `/home/${user}`;
    this.env.LEVEL32_SECRET_TOKEN = this.storage.getLevelPassword(31);
    this.vfs.currentUser = user;
    this.vfs.currentGroup = user;
    this.vfs.currentPath = `/home/${user}`;
  }

  // Tokenize command line with respect to quotes and escapes
  tokenize(commandStr) {
    const tokens = [];
    let current = '';
    let inSingle = false;
    let inDouble = false;
    let escaped = false;

    for (let i = 0; i < commandStr.length; i++) {
      const char = commandStr[i];

      if (escaped) {
        current += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === "'" && !inDouble) {
        inSingle = !inSingle;
        continue;
      }

      if (char === '"' && !inSingle) {
        inDouble = !inDouble;
        continue;
      }

      if (char === ' ' && !inSingle && !inDouble) {
        if (current.length > 0) {
          tokens.push(current);
          current = '';
        }
        continue;
      }

      current += char;
    }

    if (current.length > 0) {
      tokens.push(current);
    }

    return tokens;
  }

  // Execute single pipeline or chained commands
  async execute(inputLine) {
    inputLine = inputLine.trim();
    if (!inputLine) return { stdout: '', stderr: '' };

    this.storage.incrementCommands();

    // Check for redirection into files (e.g. > /tmp/out)
    let redirectFile = null;
    let append = false;

    // Filter out stderr redirect: 2>/dev/null
    inputLine = inputLine.replace(/2>\s*\/dev\/null/g, '').trim();

    if (inputLine.includes('>>')) {
      const parts = inputLine.split('>>');
      inputLine = parts[0].trim();
      redirectFile = parts[1].trim();
      append = true;
    } else if (inputLine.includes('>')) {
      const parts = inputLine.split('>');
      inputLine = parts[0].trim();
      redirectFile = parts[1].trim();
      append = false;
    }

    // Split pipeline by pipe character |
    const pipeCommands = inputLine.split('|').map(cmd => cmd.trim());
    let currentStdin = '';
    let lastResult = { stdout: '', stderr: '' };

    for (let i = 0; i < pipeCommands.length; i++) {
      const rawCmd = pipeCommands[i];
      const tokens = this.tokenize(rawCmd);
      if (tokens.length === 0) continue;

      const cmdName = tokens[0];
      const args = tokens.slice(1);

      lastResult = await this.runCommand(cmdName, args, currentStdin);

      if (lastResult.stderr && !lastResult.stdout) {
        return lastResult;
      }
      currentStdin = lastResult.stdout;
    }

    // Handle redirection file writing
    if (redirectFile && lastResult.stdout) {
      const cleanRedirect = redirectFile.replace(/['"]/g, '');
      const existing = this.vfs.readFile(cleanRedirect);
      let newContent = lastResult.stdout;
      if (append && existing.success) {
        newContent = existing.content + '\n' + newContent;
      }
      this.vfs.writeFile(cleanRedirect, newContent);
      return { stdout: '', stderr: '' };
    }

    return lastResult;
  }

  async runCommand(cmd, args, stdin = '') {
    // Check if executable is in VFS path
    if (cmd.startsWith('./') || cmd.startsWith('/')) {
      const file = this.vfs.readFile(cmd);
      if (file.success) {
        if (file.content.startsWith('#!/bin/bash') || file.content.startsWith('#!/bin/sh')) {
          return this.runShellScript(file.content, args);
        }
        return { stdout: file.content, stderr: '' };
      }
    }

    switch (cmd) {
      case 'help':
        return this.cmdHelp(args);
      case 'hint':
        return this.cmdHint(args);
      case 'submit':
        return this.cmdSubmit(args);
      case 'su':
        return this.cmdSu(args);
      case 'clear':
        this.terminal.clear();
        return { stdout: '', stderr: '' };
      case 'pwd':
        return { stdout: this.vfs.currentPath, stderr: '' };
      case 'whoami':
        return { stdout: this.vfs.currentUser, stderr: '' };
      case 'id':
        return this.cmdId(args);
      case 'ls':
        return this.cmdLs(args);
      case 'cd':
        return this.cmdCd(args);
      case 'cat':
        return this.cmdCat(args, stdin);
      case 'file':
        return this.cmdFile(args);
      case 'find':
        return this.cmdFind(args);
      case 'grep':
        return this.cmdGrep(args, stdin);
      case 'sort':
        return this.cmdSort(args, stdin);
      case 'uniq':
        return this.cmdUniq(args, stdin);
      case 'strings':
        return this.cmdStrings(args, stdin);
      case 'base64':
        return this.cmdBase64(args, stdin);
      case 'tr':
        return this.cmdTr(args, stdin);
      case 'xxd':
      case 'hexdump':
        return this.cmdXxd(args, stdin);
      case 'tar':
        return this.cmdTar(args);
      case 'gzip':
        return this.cmdGzip(args);
      case 'bzip2':
        return this.cmdBzip2(args);
      case 'diff':
        return this.cmdDiff(args);
      case 'wc':
        return this.cmdWc(args, stdin);
      case 'nmap':
        return this.cmdNmap(args);
      case 'nc':
      case 'netcat':
        return this.cmdNc(args, stdin);
      case 'ssh':
        return this.cmdSsh(args);
      case 'openssl':
        return this.cmdOpenssl(args, stdin);
      case 'crontab':
        return this.cmdCrontab(args);
      case 'chmod':
        return this.cmdChmod(args);
      case 'chown':
        return this.cmdChown(args);
      case 'env':
        return this.cmdEnv(args);
      case 'export':
        return this.cmdExport(args);
      case 'echo':
        return this.cmdEcho(args);
      case 'git':
        return this.cmdGit(args);
      case 'getcap':
        return this.cmdGetcap(args);
      case 'history':
        return { stdout: this.terminal.history.map((h, idx) => `  ${idx + 1}  ${h}`).join('\n'), stderr: '' };
      case 'uname':
        return { stdout: 'Linux cyberlab 6.5.0-defsec #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux', stderr: '' };
      case 'mkdir':
        if (args.length === 0) return { stdout: '', stderr: 'mkdir: missing operand' };
        this.vfs.mkdir(args[0]);
        return { stdout: '', stderr: '' };
      case 'rm':
        if (args.length === 0) return { stdout: '', stderr: 'rm: missing operand' };
        this.vfs.removeNode(args[args.length - 1]);
        return { stdout: '', stderr: '' };
      case 'man':
        if (args.length === 0) return { stdout: '', stderr: 'What manual page do you want?' };
        if (window.COMMAND_DOCS && window.COMMAND_DOCS[args[0]]) {
          window.app?.openManualModal(args[0]);
          return { stdout: `Opening manual for '${args[0]}'... (Check the manual inspector modal)`, stderr: '' };
        }
        return { stdout: '', stderr: `No manual entry for ${args[0]}` };
      case 'explain':
        return this.cmdExplain(args);
      case 'assistant':
      case 'ai':
        return this.cmdAssistant(args);
      default: {
        let msg = `bash: ${cmd}: command not found. Type 'help' for available commands.`;
        if (this.assistantEnabled) {
          const known = Object.keys(window.COMMAND_DOCS || {}).concat([
            'submit', 'clear', 'hint', 'explain', 'assistant', 'su', 'history', 'cat', 'ls', 'cd', 'file', 'find', 'grep', 'pwd', 'whoami'
          ]);
          const suggestion = known.find(k => k.startsWith(cmd.slice(0, 2)) || Math.abs(k.length - cmd.length) <= 1);
          if (suggestion) {
            msg += `\n\x1b[1;33m🤖 [Cyber Assistant]:\x1b[0m Did you mean '\x1b[1;32m${suggestion}\x1b[0m'? (Run '\x1b[1;36mexplain ${suggestion}\x1b[0m' to learn its flags)`;
          }
        }
        return { stdout: '', stderr: msg };
      }
    }
  }

  // Built-in scripts
  runShellScript(scriptContent, args) {
    if (scriptContent.includes('suid_checker')) {
      const pwd20 = this.storage.getLevelPassword(19);
      return { stdout: `[+] SUID execution verified as level20!\nLevel 20 Password: ${pwd20}`, stderr: '' };
    }
    if (scriptContent.includes('view_report')) {
      const target = args[0] || '/etc/level21_pass';
      const f = this.vfs.readFile(target);
      return { stdout: `[+] Elevated viewer reading ${target}:\n${f.content || this.storage.getLevelPassword(20)}`, stderr: '' };
    }
    if (scriptContent.includes('restricted_view.sh')) {
      const pwd27 = this.storage.getLevelPassword(26);
      return { stdout: `[+] Displaying credential archive...\nLevel 27 Password: ${pwd27}`, stderr: '' };
    }
    return { stdout: scriptContent, stderr: '' };
  }

  cmdAssistant(args) {
    if (args[0] === 'off' || args[0] === 'disable') {
      this.assistantEnabled = false;
      if (typeof localStorage !== 'undefined') localStorage.setItem('cyber_assistant_enabled', 'false');
      window.app?.updateAssistantUI?.(false);
      return { stdout: '🤖 Cyber Assistant disabled. (Type "assistant on" to re-enable)', stderr: '' };
    } else if (args[0] === 'on' || args[0] === 'enable') {
      this.assistantEnabled = true;
      if (typeof localStorage !== 'undefined') localStorage.setItem('cyber_assistant_enabled', 'true');
      window.app?.updateAssistantUI?.(true);
      return { stdout: '🤖 Cyber Assistant enabled! Smart diagnostics and tips are now active.', stderr: '' };
    }
    return {
      stdout: `🤖 Cyber Assistant is currently ${this.assistantEnabled ? '\x1b[1;32mACTIVE\x1b[0m' : '\x1b[1;31mDISABLED\x1b[0m'}.\nUsage: 'assistant on' | 'assistant off' | 'explain <command>'`,
      stderr: ''
    };
  }

  cmdExplain(args) {
    if (args.length === 0) {
      return {
        stdout: 
`\x1b[1;36m========================================================================\x1b[0m
 \x1b[1;32m🔍 SMART COMMAND EXPLAINER (CYBER SENTINEL DECONSTRUCTOR)\x1b[0m
\x1b[1;36m========================================================================\x1b[0m
Type: \x1b[1;33mexplain <command> [attributes/flags] [arguments]\x1b[0m

Examples:
  • \x1b[1;36mexplain ls -la\x1b[0m                 (Explains long listing & hidden dotfiles)
  • \x1b[1;36mexplain find -size 1033c\x1b[0m       (Explains file size filtering attributes)
  • \x1b[1;36mexplain grep -i "pass" data.txt\x1b[0m(Explains pattern matching flags)
  • \x1b[1;36mexplain xxd -r\x1b[0m                 (Explains reverse hexdump recovery)
  • \x1b[1;36mexplain openssl s_client -connect localhost:30001\x1b[0m
\x1b[1;36m========================================================================\x1b[0m`,
        stderr: ''
      };
    }

    const fullCmd = args.join(' ');
    const targetCmd = args[0];
    const flags = args.slice(1).filter(a => a.startsWith('-'));
    const nonFlags = args.slice(1).filter(a => !a.startsWith('-'));
    const doc = window.COMMAND_DOCS && window.COMMAND_DOCS[targetCmd];

    let out = `\x1b[1;36m┌────────────────────────────────────────────────────────────────────────┐\x1b[0m\n`;
    out += `\x1b[1;36m│\x1b[0m \x1b[1;32m🔍 DECONSTRUCTING COMMAND:\x1b[0m \x1b[1;37m${fullCmd}\x1b[0m\n`;
    out += `\x1b[1;36m├────────────────────────────────────────────────────────────────────────┤\x1b[0m\n`;

    if (doc) {
      out += `\x1b[1;36m│\x1b[0m \x1b[1;33m[1] BASE TOOL:\x1b[0m \x1b[1;32m${doc.command}\x1b[0m (${doc.name})\n`;
      out += `\x1b[1;36m│\x1b[0m     Category: ${doc.category}\n`;
      out += `\x1b[1;36m│\x1b[0m     Purpose: ${doc.description}\n`;
      out += `\x1b[1;36m│\x1b[0m     🛡️ \x1b[1;36mCyber Ops Role:\x1b[0m ${doc.securityNote}\n`;
    } else {
      out += `\x1b[1;36m│\x1b[0m \x1b[1;33m[1] BASE TOOL:\x1b[0m \x1b[1;32m${targetCmd}\x1b[0m (Standard Linux utility)\n`;
    }

    if (flags.length > 0) {
      out += `\x1b[1;36m├────────────────────────────────────────────────────────────────────────┤\x1b[0m\n`;
      out += `\x1b[1;36m│\x1b[0m \x1b[1;33m[2] ATTRIBUTES & FLAGS APPLIED:\x1b[0m\n`;
      flags.forEach(flag => {
        let match = null;
        if (doc && doc.attributes) {
          match = doc.attributes.find(a => 
            a.flag === flag || 
            a.longFlag === flag || 
            a.flag.split(/[\s/]+/).includes(flag) ||
            (flag.startsWith('-') && a.flag.includes(flag))
          );
        }
        if (match) {
          out += `\x1b[1;36m│\x1b[0m   • \x1b[1;32m${flag}\x1b[0m : ${match.meaning}\n`;
          out += `\x1b[1;36m│\x1b[0m     🎯 \x1b[0;36mSecurity Impact:\x1b[0m ${match.securityUse}\n`;
        } else {
          out += `\x1b[1;36m│\x1b[0m   • \x1b[1;32m${flag}\x1b[0m : Flag parameter modifying execution behavior of ${targetCmd}.\n`;
        }
      });
    }

    if (nonFlags.length > 0) {
      out += `\x1b[1;36m├────────────────────────────────────────────────────────────────────────┤\x1b[0m\n`;
      out += `\x1b[1;36m│\x1b[0m \x1b[1;33m[3] OPERANDS & TARGET PATHS:\x1b[0m\n`;
      nonFlags.forEach((nf, idx) => {
        out += `\x1b[1;36m│\x1b[0m   • Target ${idx + 1}: \x1b[1;37m${nf}\x1b[0m (file, directory, or argument operand)\n`;
      });
    }

    out += `\x1b[1;36m└────────────────────────────────────────────────────────────────────────┘\x1b[0m`;
    return { stdout: out, stderr: '' };
  }

  cmdHelp(args) {
    if (args.length > 0) {
      const doc = window.COMMAND_DOCS && window.COMMAND_DOCS[args[0]];
      if (doc) {
        let out = `COMMAND: ${doc.command} - ${doc.name}\n`;
        out += `CATEGORY: ${doc.category}\n`;
        out += `SYNTAX: ${doc.syntax}\n\n`;
        out += `DESCRIPTION:\n${doc.description}\n\n`;
        out += `SECURITY NOTE:\n${doc.securityNote}\n\n`;
        out += `ATTRIBUTES & FLAGS:\n`;
        doc.attributes.forEach(attr => {
          out += `  ${attr.flag.padEnd(16)} : ${attr.meaning}\n`;
          out += `  ${''.padEnd(16)}   Example: ${attr.example}\n`;
        });
        return { stdout: out, stderr: '' };
      }
    }

    // Trigger help modal in UI as requested by user
    if (window.app?.openManualModal) {
      window.app.openManualModal();
    }

    const available = Object.keys(window.COMMAND_DOCS || {}).join(', ');
    const helpMsg = 
`========================================================================
             🛡️ CYBER SECURITY LAB - COMMAND MANUAL & ATTRIBUTES 🛡️
========================================================================
Available Commands:
${available}

Quick Controls:
  help <command>      : View full attribute syntax & cybersecurity flags in terminal
  help                : Open the visual interactive Attribute Inspector modal
  hint                : Reveal clues and recommended commands for current level
  submit <password>   : Submit password token to unlock the next level
  clear               : Clear terminal window

* Pro-tip: In the Command Manual modal, click on any attribute (e.g. 'ls -a')
  to automatically test it in the terminal!
========================================================================`;
    return { stdout: helpMsg, stderr: '' };
  }

  cmdHint(args) {
    const currLvlId = this.storage.state.currentLevel;
    const levelData = window.LEVELS && window.LEVELS[currLvlId];
    if (!levelData) return { stdout: 'No hints available for this level.', stderr: '' };

    if (window.app?.openHintModal) {
      window.app.openHintModal();
    }

    let out = `💡 HINTS FOR ${levelData.title}:\n`;
    levelData.hints.forEach((h, idx) => {
      out += `  [Hint Tier ${idx + 1}] ${h}\n`;
    });
    out += `\nRecommended Commands: ${levelData.commandsUsed.join(', ')}`;
    return { stdout: out, stderr: '' };
  }

  cmdSubmit(args) {
    if (args.length === 0) {
      return { stdout: '', stderr: 'Usage: submit <password_token>' };
    }
    const enteredToken = args[0].trim();
    const currLvlId = this.storage.state.currentLevel;
    const currentLevel = window.LEVELS && window.LEVELS[currLvlId];

    if (!currentLevel) {
      return { stdout: '', stderr: 'Level data not found.' };
    }

    const expectedPassword = this.storage.getLevelPassword(currLvlId);

    if (enteredToken === expectedPassword) {
      const nextLvlId = currLvlId + 1;
      if (nextLvlId < window.LEVELS.length) {
        this.storage.unlockLevel(nextLvlId, enteredToken);
        if (window.app?.loadLevel) {
          window.app.loadLevel(nextLvlId);
        }
        return {
          stdout: 
`\x1b[32m[+] SUCCESS! Password verified for Level ${currLvlId}.\x1b[0m
\x1b[1;36m[+] Level ${nextLvlId} UNLOCKED!\x1b[0m
Switching user context to 'level${nextLvlId}'...
Type 'ls -la' and 'hint' to begin Level ${nextLvlId}!`,
          stderr: ''
        };
      } else {
        const masterFlag = this.storage.getLevelPassword(34);
        return {
          stdout: 
`\x1b[1;32m🎉 CONGRATULATIONS! YOU HAVE COMPLETED ALL 35 LEVELS! 🎉\x1b[0m
You are now certified as a CyberLab Linux Wargame Master!
Master Flag: ${masterFlag}`,
          stderr: ''
        };
      }
    } else {
      return {
        stdout: '',
        stderr: `\x1b[31m[-] Invalid password token '${enteredToken}' for Level ${currLvlId}. Keep hunting!\x1b[0m`
      };
    }
  }

  cmdSu(args) {
    if (args.length === 0) {
      return { stdout: '', stderr: 'Usage: su <levelX>' };
    }
    const targetUser = args[0];
    const match = targetUser.match(/^level(\d+)$/);
    if (!match) {
      return { stdout: '', stderr: `su: user ${targetUser} does not exist` };
    }
    const targetLvl = parseInt(match[1], 10);
    if (!this.storage.state.unlockedLevels.includes(targetLvl)) {
      return { stdout: '', stderr: `su: authentication failure. Level ${targetLvl} is still locked! Submit earlier level passwords first.` };
    }
    if (window.app?.loadLevel) {
      window.app.loadLevel(targetLvl);
    }
    return { stdout: `Switched session to ${targetUser}. Current directory: /home/${targetUser}`, stderr: '' };
  }

  cmdLs(args) {
    let showAll = false;
    let longFormat = false;
    let human = false;
    let timeSort = false;
    let reverse = false;
    let singleCol = false;
    let targetPath = '.';

    // Parse attributes
    for (const arg of args) {
      if (arg.startsWith('-') && arg !== '-') {
        if (arg.includes('a')) showAll = true;
        if (arg.includes('l')) longFormat = true;
        if (arg.includes('h')) human = true;
        if (arg.includes('t')) timeSort = true;
        if (arg.includes('r')) reverse = true;
        if (arg.includes('1')) singleCol = true;
      } else {
        targetPath = arg;
      }
    }

    const res = this.vfs.listDirectory(targetPath);
    if (!res.success) return { stdout: '', stderr: res.error };

    let entries = [...res.entries];

    if (!showAll) {
      entries = entries.filter(e => !e.name.startsWith('.'));
    }

    if (timeSort) {
      entries.sort((a, b) => b.mtime - a.mtime);
    } else {
      entries.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (reverse) {
      entries.reverse();
    }

    if (longFormat) {
      const lines = [`total ${entries.length * 4}`];
      for (const e of entries) {
        const typeChar = e.type === 'dir' ? 'd' : '-';
        const perm = typeChar + e.permissions;
        const owner = e.owner.padEnd(8);
        const group = e.group.padEnd(8);
        const sizeStr = human ? (e.size > 1024 ? Math.round(e.size / 1024) + 'K' : e.size + 'B') : e.size.toString();
        const dateStr = 'Sep 16 12:00';
        lines.push(`${perm} 1 ${owner} ${group} ${sizeStr.padStart(6)} ${dateStr} ${e.name}`);
      }
      return { stdout: lines.join('\n'), stderr: '' };
    }

    if (singleCol) {
      return { stdout: entries.map(e => e.name).join('\n'), stderr: '' };
    }

    if (entries.length === 0 && this.assistantEnabled && this.storage.getCurrentLevel() === 3 && !showAll) {
      return { 
        stdout: '\x1b[1;33m🤖 [Cyber Assistant Tip]:\x1b[0m Standard "ls" hides files starting with a dot (.). Use "\x1b[1;32mls -la\x1b[0m" or "\x1b[1;32mls -a\x1b[0m" to reveal hidden dotfiles!', 
        stderr: '' 
      };
    }

    return { stdout: entries.map(e => e.name).join('  '), stderr: '' };
  }

  cmdCd(args) {
    const target = args[0] || '~';
    const res = this.vfs.changeDirectory(target);
    if (!res.success) return { stdout: '', stderr: res.error };
    return { stdout: '', stderr: '' };
  }

  cmdCat(args, stdin = '') {
    if (args.length === 0) {
      return { stdout: stdin, stderr: '' };
    }

    let numberLines = false;
    let files = [];

    for (const arg of args) {
      if (arg === '-n') {
        numberLines = true;
      } else if (arg === '-A' || arg === '-s' || arg === '-b') {
        // acknowledged flags
      } else {
        files.push(arg);
      }
    }

    let output = [];

    for (let f of files) {
      // Handle special level 1 dash file
      if (f === '-') {
        // If stdin provided, use that; otherwise in Level 1 they might do `cat ./-`
        if (stdin) {
          output.push(stdin);
          continue;
        }
        f = './-';
      }

      const res = this.vfs.readFile(f);
      if (!res.success) {
        let err = res.error;
        if (this.assistantEnabled) {
          if (res.error.includes('Is a directory')) {
            err += `\n\x1b[1;33m🤖 [Cyber Assistant Tip]:\x1b[0m '${f}' is a directory folder! Use '\x1b[1;32mcd ${f}\x1b[0m' to enter it, or '\x1b[1;32mls -la ${f}\x1b[0m' to view files.`;
          } else if (files.length > 1) {
            err += `\n\x1b[1;33m🤖 [Cyber Assistant Tip]:\x1b[0m The shell splits filenames on spaces. Wrap names with spaces in quotes: \x1b[1;32mcat "${args.join(' ')}"\x1b[0m`;
          } else if (f === '-' || args.includes('-')) {
            err += `\n\x1b[1;33m🤖 [Cyber Assistant Tip]:\x1b[0m A leading '-' is treated as a command option or stdin! To read file '-', use relative path: \x1b[1;32mcat ./- \x1b[0m`;
          }
        }
        return { stdout: '', stderr: err };
      }

      if (this.assistantEnabled && this.storage.getCurrentLevel() === 4 && f.includes('-file') && !f.includes('-file07')) {
        output.push(res.content + `\n\x1b[1;33m🤖 [Cyber Assistant Tip]:\x1b[0m Binary file detected! Tip: Use '\x1b[1;36mfile ./*\x1b[0m' to detect file MIME types and find the human-readable ASCII text file.`);
        continue;
      }

      output.push(res.content);
    }

    let combined = output.join('\n');
    if (numberLines) {
      combined = combined.split('\n').map((line, idx) => `${(idx + 1).toString().padStart(6)}  ${line}`).join('\n');
    }

    return { stdout: combined, stderr: '' };
  }

  cmdFile(args) {
    if (args.length === 0) return { stdout: '', stderr: 'file: missing argument' };
    const outputs = [];

    for (const path of args) {
      const node = this.vfs.getNode(path);
      if (!node) {
        outputs.push(`${path}: cannot open \`${path}' (No such file or directory)`);
        continue;
      }
      if (node.type === 'dir') {
        outputs.push(`${path}: directory`);
      } else if (node.binary) {
        if (node.content.startsWith('\x7fELF')) {
          outputs.push(`${path}: ELF 64-bit LSB executable, x86-64, dynamically linked`);
        } else if (node.content.startsWith('\x89PNG')) {
          outputs.push(`${path}: PNG image data, 800 x 600, 8-bit/color RGBA`);
        } else if (node.content.startsWith('\x1f\x8b')) {
          outputs.push(`${path}: gzip compressed data, max compression`);
        } else {
          outputs.push(`${path}: data`);
        }
      } else {
        outputs.push(`${path}: ASCII text, with CRLF line terminators`);
      }
    }
    return { stdout: outputs.join('\n'), stderr: '' };
  }

  cmdFind(args) {
    const searchPath = (args[0] && !args[0].startsWith('-')) ? args[0] : '.';
    let targetSize = null;
    let targetUser = null;
    let targetGroup = null;
    let targetName = null;
    let targetType = null;
    let targetPerm = null;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-size' && args[i + 1]) {
        const szStr = args[i + 1];
        if (szStr.endsWith('c')) targetSize = parseInt(szStr.slice(0, -1), 10);
        else targetSize = parseInt(szStr, 10);
      }
      if (args[i] === '-user' && args[i + 1]) targetUser = args[i + 1];
      if (args[i] === '-group' && args[i + 1]) targetGroup = args[i + 1];
      if (args[i] === '-name' && args[i + 1]) targetName = args[i + 1].replace(/['"]/g, '');
      if (args[i] === '-type' && args[i + 1]) targetType = args[i + 1];
      if (args[i] === '-perm' && args[i + 1]) targetPerm = args[i + 1];
    }

    const matches = [];
    const rootNode = this.vfs.getNode(searchPath);
    if (!rootNode) return { stdout: '', stderr: `find: '${searchPath}': No such file or directory` };

    const traverse = (node, currentPath) => {
      if (!node) return;

      let matched = true;
      if (targetType === 'f' && node.type !== 'file') matched = false;
      if (targetType === 'd' && node.type !== 'dir') matched = false;
      if (targetSize !== null && node.size !== targetSize) matched = false;
      if (targetUser && node.owner !== targetUser) matched = false;
      if (targetGroup && node.group !== targetGroup) matched = false;
      if (targetName) {
        const regex = new RegExp('^' + targetName.replace(/\*/g, '.*') + '$');
        if (!regex.test(node.name)) matched = false;
      }
      if (targetPerm === '-4000' && !node.suid) matched = false;

      if (matched && currentPath !== searchPath) {
        matches.push(currentPath);
      }

      if (node.type === 'dir' && node.children) {
        for (const [name, child] of node.children.entries()) {
          const next = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
          traverse(child, next);
        }
      }
    };

    traverse(rootNode, searchPath);
    return { stdout: matches.join('\n'), stderr: '' };
  }

  cmdGrep(args, stdin = '') {
    let ignoreCase = false;
    let invertMatch = false;
    let lineNum = false;
    let countOnly = false;
    let pattern = '';
    let files = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === '-i') ignoreCase = true;
      else if (arg === '-v') invertMatch = true;
      else if (arg === '-n') lineNum = true;
      else if (arg === '-c') countOnly = true;
      else if (!pattern) pattern = arg.replace(/^['"]|['"]$/g, '');
      else files.push(arg);
    }

    let textToSearch = stdin;
    if (files.length > 0) {
      const fileRes = this.vfs.readFile(files[0]);
      if (!fileRes.success) return { stdout: '', stderr: fileRes.error };
      textToSearch = fileRes.content;
    }

    if (!textToSearch && !pattern) return { stdout: '', stderr: 'Usage: grep [OPTIONS] PATTERN [FILE]' };

    const lines = textToSearch.split('\n');
    const matched = [];

    const flags = ignoreCase ? 'i' : '';
    let regex;
    try {
      regex = new RegExp(pattern, flags);
    } catch {
      regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    }

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const isMatch = regex.test(line);
      if ((isMatch && !invertMatch) || (!isMatch && invertMatch)) {
        if (lineNum) {
          matched.push(`${idx + 1}:${line}`);
        } else {
          matched.push(line);
        }
      }
    }

    if (countOnly) {
      return { stdout: matched.length.toString(), stderr: '' };
    }

    return { stdout: matched.join('\n'), stderr: '' };
  }

  cmdSort(args, stdin = '') {
    let reverse = args.includes('-r');
    let numeric = args.includes('-n');
    let unique = args.includes('-u');

    let text = stdin;
    const fileArg = args.find(a => !a.startsWith('-'));
    if (fileArg) {
      const f = this.vfs.readFile(fileArg);
      if (!f.success) return { stdout: '', stderr: f.error };
      text = f.content;
    }

    let lines = text.split('\n');
    if (numeric) {
      lines.sort((a, b) => parseFloat(a) - parseFloat(b));
    } else {
      lines.sort();
    }
    if (reverse) lines.reverse();
    if (unique) lines = [...new Set(lines)];

    return { stdout: lines.join('\n'), stderr: '' };
  }

  cmdUniq(args, stdin = '') {
    let uniqueOnly = args.includes('-u');
    let duplicatesOnly = args.includes('-d');
    let count = args.includes('-c');

    let text = stdin;
    const fileArg = args.find(a => !a.startsWith('-'));
    if (fileArg) {
      const f = this.vfs.readFile(fileArg);
      if (!f.success) return { stdout: '', stderr: f.error };
      text = f.content;
    }

    const lines = text.split('\n');
    const counts = new Map();
    for (const line of lines) {
      counts.set(line, (counts.get(line) || 0) + 1);
    }

    const res = [];
    for (const [line, cnt] of counts.entries()) {
      if (uniqueOnly && cnt === 1) {
        res.push(count ? `${cnt} ${line}` : line);
      } else if (duplicatesOnly && cnt > 1) {
        res.push(count ? `${cnt} ${line}` : line);
      } else if (!uniqueOnly && !duplicatesOnly) {
        res.push(count ? `${cnt} ${line}` : line);
      }
    }

    return { stdout: res.join('\n'), stderr: '' };
  }

  cmdStrings(args, stdin = '') {
    let text = stdin;
    const fileArg = args.find(a => !a.startsWith('-'));
    if (fileArg) {
      const f = this.vfs.readFile(fileArg);
      if (!f.success) return { stdout: '', stderr: f.error };
      text = f.content;
    }

    const matches = text.match(/[A-Za-z0-9_=+\-/{}[\]:., ]{4,}/g) || [];
    return { stdout: matches.join('\n'), stderr: '' };
  }

  cmdBase64(args, stdin = '') {
    let decode = args.includes('-d') || args.includes('--decode');
    let text = stdin;
    const fileArg = args.find(a => !a.startsWith('-'));
    if (fileArg) {
      const f = this.vfs.readFile(fileArg);
      if (!f.success) return { stdout: '', stderr: f.error };
      text = f.content;
    }

    text = text.trim();
    if (decode) {
      try {
        const decoded = atob(text);
        return { stdout: decoded, stderr: '' };
      } catch (e) {
        return { stdout: '', stderr: 'base64: invalid input' };
      }
    } else {
      return { stdout: btoa(text), stderr: '' };
    }
  }

  cmdTr(args, stdin = '') {
    if (args.length < 2) return { stdout: stdin, stderr: '' };
    const set1 = args[0].replace(/['"]/g, '');
    const set2 = args[1].replace(/['"]/g, '');

    // Check ROT13: 'A-Za-z' 'N-ZA-Mn-za-m'
    if (set1.includes('A-Za-z') && set2.includes('N-ZA-M')) {
      const rot13 = str => str.replace(/[a-zA-Z]/g, c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + 13) % 26) + 65);
        }
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      });
      return { stdout: rot13(stdin), stderr: '' };
    }

    return { stdout: stdin, stderr: '' };
  }

  cmdXxd(args, stdin = '') {
    if (args.includes('-r')) {
      const pwd13 = this.storage.getLevelPassword(12);
      return { stdout: pwd13, stderr: '' };
    }
    return {
      stdout: 
`00000000: 7061 7373 776f 7264 5f64 6174 6120 7465  password_data te
00000010: 7374 5f74 6f6b 656e 0a                    st_token.`,
      stderr: ''
    };
  }

  cmdTar(args) {
    if (args.includes('-xf') || args.includes('-xvf') || args.includes('-xzf') || args.includes('-xjf')) {
      const pwd13 = this.storage.getLevelPassword(12);
      return { stdout: `[+] Extracted archive: password.txt\nLevel 13 Password: ${pwd13}`, stderr: '' };
    }
    return { stdout: 'password.txt', stderr: '' };
  }

  cmdGzip(args) {
    if (args.includes('-d')) {
      const pwd13 = this.storage.getLevelPassword(12);
      return { stdout: `[+] Decompressed gzip stream -> data.tar\nLevel 13 Password: ${pwd13}`, stderr: '' };
    }
    return { stdout: '', stderr: '' };
  }

  cmdBzip2(args) {
    if (args.includes('-d')) {
      const pwd13 = this.storage.getLevelPassword(12);
      return { stdout: `[+] Decompressed bzip2 stream -> data.tar\nLevel 13 Password: ${pwd13}`, stderr: '' };
    }
    return { stdout: '', stderr: '' };
  }

  cmdDiff(args) {
    if (args.length < 2) return { stdout: '', stderr: 'diff: missing operand' };
    const f1 = this.vfs.readFile(args[0]);
    const f2 = this.vfs.readFile(args[1]);
    if (!f1.success) return { stdout: '', stderr: f1.error };
    if (!f2.success) return { stdout: '', stderr: f2.error };

    const l1 = f1.content.split('\n');
    const l2 = f2.content.split('\n');
    const out = [];

    for (let i = 0; i < Math.max(l1.length, l2.length); i++) {
      if (l1[i] !== l2[i]) {
        out.push(`${i + 1}c${i + 1}`);
        out.push(`< ${l1[i] || ''}`);
        out.push('---');
        out.push(`> ${l2[i] || ''}`);
      }
    }
    return { stdout: out.join('\n'), stderr: '' };
  }

  cmdWc(args, stdin = '') {
    let text = stdin;
    const files = args.filter(a => !a.startsWith('-'));
    if (files.length > 0) {
      const f = this.vfs.readFile(files[0]);
      if (f.success) text = f.content;
    }

    const lines = text.length > 0 ? text.split('\n').length : 0;
    const words = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    if (args.includes('-l')) return { stdout: `${lines}`, stderr: '' };
    if (args.includes('-w')) return { stdout: `${words}`, stderr: '' };
    if (args.includes('-c')) return { stdout: `${chars}`, stderr: '' };

    return { stdout: `  ${lines}  ${words}  ${chars}`, stderr: '' };
  }

  cmdNmap(args) {
    return {
      stdout: 
`Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-16 12:00 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00012s latency).

PORT      STATE SERVICE  VERSION
31004/tcp OPEN  ssl/echo OpenSSL TLS Daemon (Level 17 credential dispenser)
31000/tcp closed unknown
31001/tcp closed unknown
31002/tcp closed unknown
31003/tcp closed unknown

Service detection performed. Connect to port 31004 using 'nc localhost 31004'.`,
      stderr: ''
    };
  }

  cmdNc(args, stdin = '') {
    const port = args[args.length - 1];
    if (port === '30000') {
      const pwd15 = this.storage.getLevelPassword(14);
      return { stdout: `[+] Level 14 connection verified!\nLevel 15 Password: ${pwd15}`, stderr: '' };
    }
    if (port === '30001') {
      return { stdout: '', stderr: 'nc: TLS handshake required on port 30001. Use `openssl s_client` instead.' };
    }
    if (port === '31004') {
      const pwd17 = this.storage.getLevelPassword(16);
      return { stdout: `[+] Port 31004 dispenser response:\nLevel 17 Password: ${pwd17}`, stderr: '' };
    }
    if (port === '30002') {
      if (stdin.includes('1004') || args.includes('1004')) {
        const pwd25 = this.storage.getLevelPassword(24);
        return { stdout: `[+] PIN 1004 Correct!\nLevel 25 Password: ${pwd25}`, stderr: '' };
      }
      return { stdout: '[-] Wrong PIN. Connection closed.', stderr: '' };
    }
    return { stdout: `nc: connect to localhost port ${port}: Connection refused`, stderr: '' };
  }

  cmdSsh(args) {
    if (args.includes('-i')) {
      const pwd14 = this.storage.getLevelPassword(13);
      return {
        stdout: 
`Welcome to Level 14 GNU/Linux!
Authenticated successfully via identity key.
Level 14 Password: ${pwd14}`,
        stderr: ''
      };
    }
    return { stdout: '', stderr: 'Permission denied (publickey). Use `ssh -i <private_key>`.' };
  }

  cmdOpenssl(args, stdin = '') {
    if (args.includes('s_client')) {
      const pwd16 = this.storage.getLevelPassword(15);
      return {
        stdout: 
`CONNECTED(00000003)
---
Certificate chain
 0 s:CN = cyberlab-tls-service
---
---
SSL handshake has read 1420 bytes and written 432 bytes
Verification: OK
---
[+] Encrypted TLS handshake established!
Level 16 Password: ${pwd16}`,
        stderr: ''
      };
    }
    return { stdout: 'OpenSSL 3.1.0 14 Mar 2026', stderr: '' };
  }

  cmdCrontab(args) {
    if (args.includes('-l')) {
      return {
        stdout: 
`# Cron jobs for current session
* * * * * /usr/bin/cronjob_level22.sh > /tmp/level22_flag.txt 2>&1`,
        stderr: ''
      };
    }
    return { stdout: '', stderr: 'crontab: usage [ -l | -r | -e ]' };
  }

  cmdChmod(args) {
    return { stdout: '', stderr: '' };
  }

  cmdChown(args) {
    return { stdout: '', stderr: '' };
  }

  cmdId(args) {
    const u = this.vfs.currentUser;
    return {
      stdout: `uid=1000(${u}) gid=1000(${u}) groups=1000(${u}),25(level25),100(users)`,
      stderr: ''
    };
  }

  cmdEnv(args) {
    const list = Object.entries(this.env).map(([k, v]) => `${k}=${v}`);
    return { stdout: list.join('\n'), stderr: '' };
  }

  cmdExport(args) {
    if (args.length === 0) return this.cmdEnv(args);
    const pair = args[0].split('=');
    if (pair.length === 2) {
      this.env[pair[0]] = pair[1];
    }
    return { stdout: '', stderr: '' };
  }

  cmdEcho(args) {
    const joined = args.join(' ');
    // Resolve basic variables
    const resolved = joined.replace(/\$([A-Za-z0-9_]+)/g, (match, varName) => {
      if (varName === '0') return '/bin/bash';
      return this.env[varName] || '';
    });
    return { stdout: resolved, stderr: '' };
  }

  cmdGetcap(args) {
    return {
      stdout: `/usr/bin/cap_reader cap_dac_read_search+ep\n/usr/bin/ping cap_net_raw+ep`,
      stderr: ''
    };
  }

  cmdGit(args) {
    const sub = args[0];
    if (sub === 'log') {
      if (args.includes('-p') || args.includes('--patch')) {
        const pwd28 = this.storage.getLevelPassword(27);
        return {
          stdout: 
`commit 8a93b4ef01192837482019482
Author: DevSec <dev@cyberlab.internal>
Date:   Mon Sep 15 14:02:11 2026 -0400

    Revert secret accidental password commit

diff --git a/config.env b/config.env
--- a/config.env
+++ b/config.env
-PASSWORD=${pwd28}
+PASSWORD=REDACTED

commit 71bca29381029384910293849
Author: DevSec <dev@cyberlab.internal>
Date:   Mon Sep 15 13:45:00 2026 -0400

    Initial commit with config credentials`,
          stderr: ''
        };
      }
      return {
        stdout: 
`commit 8a93b4ef01192837482019482 (HEAD -> master)
Author: DevSec <dev@cyberlab.internal>
Date:   Mon Sep 15 14:02:11 2026 -0400

    Revert secret accidental password commit (use git log -p to inspect diff!)`,
        stderr: ''
      };
    }
    if (sub === 'branch') {
      return {
        stdout: 
`* master
  secret-feature
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev`,
        stderr: ''
      };
    }
    if (sub === 'checkout') {
      const branch = args[1];
      if (branch === 'secret-feature') {
        const pwd29 = this.storage.getLevelPassword(28);
        return {
          stdout: 
`Switched to branch 'secret-feature'
[+] Secret feature branch loaded!
Level 29 Password: ${pwd29}`,
          stderr: ''
        };
      }
    }
    if (sub === 'tag') {
      return {
        stdout: `v1.0-release\nsecret-release\nv0.9-beta`,
        stderr: ''
      };
    }
    if (sub === 'show') {
      const pwd30 = this.storage.getLevelPassword(29);
      return {
        stdout: 
`tag secret-release
Tagger: Security Lead <lead@cyberlab.internal>

Level 30 Password: ${pwd30}`,
        stderr: ''
      };
    }
    if (sub === 'diff') {
      const pwd31 = this.storage.getLevelPassword(30);
      return {
        stdout: 
`diff --git a/settings.json b/settings.json
--- a/settings.json
+++ b/settings.json
@@ -1,3 +1,4 @@
 {
-  "token": "placeholder"
+  "token": "${pwd31}"
 }`,
        stderr: ''
      };
    }
    return { stdout: 'On branch master\nnothing to commit, working tree clean', stderr: '' };
  }
}

window.CommandEngine = CommandEngine;
