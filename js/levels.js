/**
 * 35 Progressive Cyber Security CLI Levels (Level 0 - Level 34)
 * Dynamic random passwords support: Each level receives its random password
 * at setup time from the StorageManager.
 */

function rot13Encode(str) {
  return str.replace(/[a-zA-Z]/g, c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + 13) % 26) + 65);
    }
    return String.fromCharCode(((code - 97 + 13) % 26) + 97);
  });
}

const LEVELS = [
  // ==========================================
  // LEVELS 0 - 5: Linux Basics & Navigation
  // ==========================================
  {
    id: 0,
    title: "Level 0: The Readme & First Steps",
    category: "Linux Basics",
    difficulty: "Beginner",
    objective: "The password for Level 1 is stored in a file called 'readme' located in your home directory. Read this file to retrieve the password token.",
    commandsUsed: ["ls", "pwd", "cat", "help"],
    hints: [
      "Use 'ls' to see what files are in your current directory.",
      "The 'cat' command is used to display contents of a text file.",
      "Run: 'cat readme' to view the secret password."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level0');
      vfs.writeFile('/home/level0/readme', 
`[+] Welcome to Level 0!
You have successfully connected to the terminal.
The password you need to access Level 1 is:
${password}

To proceed, run:
submit ${password}
(or enter the token in the sidebar submission box!)`
      );
    }
  },

  {
    id: 1,
    title: "Level 1: Dashes in Filename",
    category: "Linux Basics",
    difficulty: "Beginner",
    objective: "The password for Level 2 is stored in a file named '-' located in the home directory. Linux commands often confuse a leading dash with an attribute/flag!",
    commandsUsed: ["cat", "ls"],
    hints: [
      "If you type 'cat -', cat thinks you are specifying standard input or an option flag.",
      "You can specify a file's relative path starting with './' so it doesn't look like an attribute.",
      "Run: 'cat ./-' or 'cat < -' to view the file content."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level1');
      vfs.writeFile('/home/level1/-', 
`[+] Congratulations! You bypassed the command-line flag parser.
Level 2 Password: ${password}`
      );
    }
  },

  {
    id: 2,
    title: "Level 2: Spaces in Filenames",
    category: "Linux Basics",
    difficulty: "Beginner",
    objective: "The password for Level 3 is stored in a file named 'spaces in this filename' located in the home directory. Handle unescaped shell whitespace.",
    commandsUsed: ["cat", "ls"],
    hints: [
      "The shell uses whitespace to separate command arguments.",
      "Enclose the filename in quotes or escape every space character using a backslash '\\'.",
      "Run: cat \"spaces in this filename\" or cat spaces\\ in\\ this\\ filename"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level2');
      vfs.writeFile('/home/level2/spaces in this filename',
`[+] Great job quoting or escaping spaces!
Level 3 Password: ${password}`
      );
    }
  },

  {
    id: 3,
    title: "Level 3: Hidden Files",
    category: "Linux Basics",
    difficulty: "Beginner",
    objective: "The password for Level 4 is stored in a hidden file inside the directory 'inhere'. In Linux, hidden files start with a dot ('.').",
    commandsUsed: ["ls", "cd", "cat"],
    hints: [
      "Running plain 'ls' hides files that start with a period.",
      "Check the 'ls' command attributes. Which flag displays hidden files?",
      "Run: 'cd inhere' followed by 'ls -a' (or 'ls -la inhere'), then cat the hidden dotfile."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level3');
      vfs.mkdir('/home/level3/inhere');
      vfs.writeFile('/home/level3/inhere/.hidden_pass',
`[+] You uncovered the hidden dotfile!
Level 4 Password: ${password}`
      );
      vfs.writeFile('/home/level3/inhere/decoy.txt', 'Nothing here, keep looking for hidden entries!');
    }
  },

  {
    id: 4,
    title: "Level 4: File Type Magic & Human-Readable Data",
    category: "File Inspection",
    difficulty: "Beginner",
    objective: "The password for Level 5 is stored in the only human-readable file in the 'inhere' directory. Inspect the files to identify which one contains ASCII text.",
    commandsUsed: ["file", "ls", "cat"],
    hints: [
      "There are several files named -file00, -file01, -file02, etc. Most are raw binary data.",
      "Use the 'file' command to inspect magic headers: file inhere/* or file inhere/.*",
      "Run: 'file inhere/*' then 'cat' the one identified as 'ASCII text'."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level4');
      vfs.mkdir('/home/level4/inhere');
      vfs.writeFile('/home/level4/inhere/-file00', '\x7fELF\x02\x01\x01\x00\x00\x00', { binary: true });
      vfs.writeFile('/home/level4/inhere/-file01', '\x89PNG\r\n\x1a\n\x00\x00', { binary: true });
      vfs.writeFile('/home/level4/inhere/-file02', '\x1f\x8b\x08\x00\x00\x00', { binary: true });
      vfs.writeFile('/home/level4/inhere/-file03', 
`[+] File magic verification complete!
Level 5 Password: ${password}`
      );
      vfs.writeFile('/home/level4/inhere/-file04', '\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1', { binary: true });
    }
  },

  {
    id: 5,
    title: "Level 5: Searching by Size & Attributes",
    category: "Data Search & Filtering",
    difficulty: "Intermediate",
    objective: "The password for Level 6 is stored somewhere in the 'inhere' directory under a file with all of the following properties: human-readable, exactly 1033 bytes in size, and not executable.",
    commandsUsed: ["find", "ls", "cat", "file"],
    hints: [
      "The 'find' command has a '-size' attribute. In find, 'c' stands for bytes (e.g. 1033c).",
      "Use 'find inhere -type f -size 1033c' to locate the exact file matching this criterion.",
      "Once you find the file path (e.g. inhere/maybehere07/.file2), use 'cat' to read it."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level5');
      vfs.mkdir('/home/level5/inhere');
      for (let i = 1; i <= 10; i++) {
        const dir = `/home/level5/inhere/dir${i < 10 ? '0' + i : i}`;
        vfs.mkdir(dir);
        vfs.writeFile(`${dir}/test.dat`, 'X'.repeat(500));
      }
      // Target file: exactly 1033 bytes
      const header = `Level 6 Password: ${password}\n[+] Found 1033 bytes secret!\n`;
      const paddingLength = Math.max(0, 1033 - header.length);
      const targetContent = header + 'A'.repeat(paddingLength);
      vfs.writeFile('/home/level5/inhere/dir07/.target_pass', targetContent, { size: 1033 });
    }
  },

  // ==========================================
  // LEVELS 6 - 10: Data Filtering & Text Processing
  // ==========================================
  {
    id: 6,
    title: "Level 6: System-Wide File Search",
    category: "Data Search & Filtering",
    difficulty: "Intermediate",
    objective: "The password for Level 7 is stored on the system, with all properties: owned by user 'level7', owned by group 'level6', and exactly 33 bytes in size.",
    commandsUsed: ["find", "grep", "cat"],
    hints: [
      "Search from the root directory '/' using 'find'.",
      "Attributes to use: -user level7 -group level6 -size 33c",
      "Run: find / -user level7 -group level6 -size 33c 2>/dev/null"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level6');
      vfs.mkdir('/var/lib/cyberlab');
      const base = `${password}\n`;
      const pad = '#'.repeat(Math.max(0, 33 - base.length));
      vfs.writeFile('/var/lib/cyberlab/.token_level7', base + pad, {
        size: 33,
        owner: 'level7',
        group: 'level6'
      });
    }
  },

  {
    id: 7,
    title: "Level 7: Pattern Matching with Grep",
    category: "Data Search & Filtering",
    difficulty: "Intermediate",
    objective: "The password for Level 8 is stored in the file 'data.txt' next to the keyword 'millionth'.",
    commandsUsed: ["grep", "cat"],
    hints: [
      "The 'data.txt' file contains thousands of lines of noisy text.",
      "The 'grep' command filters lines matching a specific string or pattern.",
      "Run: grep \"millionth\" data.txt"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level7');
      const lines = [];
      for (let i = 0; i < 200; i++) {
        lines.push(`word_${i} random_noise_${Math.random().toString(36).substring(2, 9)}`);
      }
      lines.splice(145, 0, `millionth\t${password}`);
      vfs.writeFile('/home/level7/data.txt', lines.join('\n'));
    }
  },

  {
    id: 8,
    title: "Level 8: Unique Line Filtering (Sort & Uniq)",
    category: "Data Search & Filtering",
    difficulty: "Intermediate",
    objective: "The password for Level 9 is stored in the file 'data.txt' and is the ONLY line of text that occurs exactly once. All other lines are duplicated.",
    commandsUsed: ["sort", "uniq", "cat"],
    hints: [
      "'uniq' only removes adjacent duplicates, so the file must be sorted first!",
      "Pipe the output of 'sort' to 'uniq' using the '|' character.",
      "Run: sort data.txt | uniq -u (the '-u' attribute specifies unique lines)."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level8');
      const repeated = [
        'apple_seed_token_duplicated_3892',
        'charlie_bravo_duplicate_line_9011',
        'echo_foxtrot_duplicate_line_4412',
        'golf_hotel_duplicate_entry_8812',
        'kilo_lima_reused_entry_9981'
      ];
      const allLines = [];
      for (let i = 0; i < 30; i++) {
        allLines.push(repeated[i % repeated.length]);
      }
      allLines.push(password);
      for (let i = 0; i < 30; i++) {
        allLines.push(repeated[(i + 2) % repeated.length]);
      }
      vfs.writeFile('/home/level8/data.txt', allLines.join('\n'));
    }
  },

  {
    id: 9,
    title: "Level 9: Extracting Strings from Binary Data",
    category: "Binary & Forensics",
    difficulty: "Intermediate",
    objective: "The password for Level 10 is stored in 'data.txt' in one of the few human-readable strings, preceded by several '=' characters.",
    commandsUsed: ["strings", "grep"],
    hints: [
      "'data.txt' contains raw binary unreadable characters mixed with text.",
      "The 'strings' command filters out binary noise and extracts printable ASCII.",
      "Run: strings data.txt | grep '==='"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level9');
      const binaryBlob = '\x00\x01\x02\xff\xfe\xca\xfe\xba\xbe' +
        'junk_binary_code\x00\x00\x1f\x8b\x08' +
        `========== the password is ${password} ==========` +
        '\x00\xff\xaa\xbb\xcc\xdd';
      vfs.writeFile('/home/level9/data.txt', binaryBlob, { binary: true });
    }
  },

  {
    id: 10,
    title: "Level 10: Base64 Decryption",
    category: "Cryptography & Encoding",
    difficulty: "Intermediate",
    objective: "The password for Level 11 is stored in 'data.txt', which contains base64 encoded data. Decode it to reveal the password.",
    commandsUsed: ["base64", "cat"],
    hints: [
      "Base64 is a common encoding scheme used in web data and payload transmission.",
      "Look at the 'base64' command attributes. What flag decodes data?",
      "Run: base64 -d data.txt (or cat data.txt | base64 -d)"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level10');
      const plain = `The password for level 11 is ${password}`;
      // In browser btoa
      const encoded = (typeof btoa === 'function') ? btoa(plain) : Buffer.from(plain).toString('base64');
      vfs.writeFile('/home/level10/data.txt', encoded);
    }
  },

  // ==========================================
  // LEVELS 11 - 15: Cryptography & Archives
  // ==========================================
  {
    id: 11,
    title: "Level 11: Caesar Cipher & ROT13 Rotation",
    category: "Cryptography & Encoding",
    difficulty: "Intermediate",
    objective: "The password for Level 12 is stored in 'data.txt', where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions (ROT13).",
    commandsUsed: ["tr", "cat"],
    hints: [
      "ROT13 is a simple substitution cipher that shifts characters by 13 positions.",
      "The 'tr' command translates characters from SET1 to SET2.",
      "Run: cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level11');
      const plain = `The password is ${password}`;
      const rot13Text = rot13Encode(plain);
      vfs.writeFile('/home/level11/data.txt', rot13Text);
    }
  },

  {
    id: 12,
    title: "Level 12: Reverse Hex Dump & Multi-Compression",
    category: "Archive & Compression",
    difficulty: "Advanced",
    objective: "The password for Level 13 is stored in 'data.txt', which is a hexdump of a file that has been repeatedly compressed with gzip, bzip2, and tar.",
    commandsUsed: ["xxd", "file", "gzip", "bzip2", "tar"],
    hints: [
      "First, use 'xxd -r data.txt > data.bin' to revert the hex dump into binary.",
      "Next, use 'file data.bin' to see what compression algorithm was used (gzip, bzip2, or tar).",
      "Decompress step-by-step: gzip -d, bzip2 -d, or tar -xf until you reach the password text file!"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level12');
      const hexSample = 
`00000000: 1f8b 0800 0000 0000 0003 4bce 4cc9 335f  ..........K.L.3_
00000010: 6330 6d70 7233 7373 5f75 6e70 3463 6b0a  c0mpr3ss_unp4ck.
00000020: 0300 c835 12bc 1a00 0000                  ...5......`;
      vfs.writeFile('/home/level12/data.txt', hexSample);
      vfs.writeFile('/home/level12/compressed_flag.txt', password);
    }
  },

  {
    id: 13,
    title: "Level 13: SSH Private Key Authentication",
    category: "Networking & Reconnaissance",
    difficulty: "Intermediate",
    objective: "The password for Level 14 can be found by logging into level14 via SSH on localhost using the private key 'sshkey.private' provided in your home directory.",
    commandsUsed: ["ssh", "ls -l", "chmod"],
    hints: [
      "SSH uses the '-i' attribute to designate a private key identity file.",
      "If SSH complains about permissions, private keys must have permissions 600 (chmod 600 sshkey.private).",
      "Run: ssh -i sshkey.private level14@localhost"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level13');
      vfs.writeFile('/home/level13/sshkey.private',
`-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACDH8u9z8NqLw5571b...[Level 14 Identity Key]...
-----END OPENSSH PRIVATE KEY-----`
      );
      vfs.mkdir('/etc/ssh_keys');
      vfs.writeFile('/etc/ssh_keys/level14_token', password);
    }
  },

  {
    id: 14,
    title: "Level 14: Network Port Communication",
    category: "Networking & Reconnaissance",
    difficulty: "Intermediate",
    objective: "The password for Level 15 can be retrieved by submitting the current level's password to port 30000 on localhost using netcat.",
    commandsUsed: ["nc", "cat"],
    hints: [
      "Use 'nc' (netcat) to connect to network sockets: nc [host] [port].",
      "Pipe or type the current level password into the netcat connection.",
      "Run: nc localhost 30000"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level14');
      vfs.writeFile('/home/level14/service_info.txt', 'Local daemon listening on port 30000. Send level 14 password to receive level 15 token.');
    }
  },

  {
    id: 15,
    title: "Level 15: Encrypted TLS/SSL Socket Connection",
    category: "Cryptography & Encoding",
    difficulty: "Intermediate",
    objective: "The password for Level 16 is retrieved by submitting the current level's password to port 30001 on localhost using an SSL/TLS encrypted connection.",
    commandsUsed: ["openssl", "nc"],
    hints: [
      "Plain netcat will fail because this service enforces TLS encryption!",
      "The 'openssl' command has an 's_client' attribute for connecting to SSL/TLS services.",
      "Run: openssl s_client -connect localhost:30001 (or openssl s_client -quiet -connect localhost:30001)"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level15');
      vfs.writeFile('/home/level15/service_tls.txt', 'Service on port 30001 requires TLS/SSL handshake. Use openssl s_client.');
    }
  },

  // ==========================================
  // LEVELS 16 - 20: Recon, Diff & SUID Escalation
  // ==========================================
  {
    id: 16,
    title: "Level 16: Port Scanning with Nmap",
    category: "Networking & Reconnaissance",
    difficulty: "Intermediate",
    objective: "The credentials for Level 17 are being served on a port between 31000 and 31010 on localhost. Scan the port range to discover which port is listening, then connect.",
    commandsUsed: ["nmap", "nc", "openssl"],
    hints: [
      "Use 'nmap' with the '-p' attribute to specify a port range.",
      "Run: nmap -p 31000-31010 localhost to find which port is OPEN.",
      "Port 31004 is open! Connect to it with 'nc localhost 31004' to claim the token."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level16');
      vfs.writeFile('/home/level16/scan_brief.txt', 'Scan range 31000-31010 on localhost to discover active service.');
    }
  },

  {
    id: 17,
    title: "Level 17: File Diff & Configuration Auditing",
    category: "Data Search & Filtering",
    difficulty: "Beginner",
    objective: "There are two files in your home directory: 'passwords.old' and 'passwords.new'. The password for Level 18 is the only line that was changed in passwords.new.",
    commandsUsed: ["diff", "cat"],
    hints: [
      "Comparing files manually line by line is slow and prone to errors.",
      "The 'diff' command compares two files and highlights changes.",
      "Run: diff passwords.old passwords.new (or diff -u passwords.old passwords.new)"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level17');
      const lines = [
        "account_alpha: 9812491240",
        "account_bravo: 7129481924",
        "account_charlie: 1029481029",
        "account_delta: 9948201948",
        "account_echo: 1192849102"
      ];
      vfs.writeFile('/home/level17/passwords.old', lines.join('\n'));
      const newLines = [...lines];
      newLines[2] = `account_charlie: ${password}`;
      vfs.writeFile('/home/level17/passwords.new', newLines.join('\n'));
    }
  },

  {
    id: 18,
    title: "Level 18: Log Analysis & Metrics",
    category: "Data Search & Filtering",
    difficulty: "Intermediate",
    objective: "The password for Level 19 is hidden in '/var/log/auth.log'. Find the line recording the 42nd failed login attempt by user 'intruder'.",
    commandsUsed: ["grep", "wc", "cat"],
    hints: [
      "Combine grep with line counting or pattern extraction.",
      "Check the lines matching 'intruder' inside /var/log/auth.log.",
      "Run: grep 'intruder' /var/log/auth.log | grep 'FLAG'"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level18');
      const logLines = [];
      for (let i = 1; i <= 60; i++) {
        if (i === 42) {
          logLines.push(`Sep 16 10:14:02 auth sshd[${2000 + i}]: Failed password for intruder from 192.168.1.50 port ${40000 + i} ssh2 [FLAG: ${password}]`);
        } else {
          logLines.push(`Sep 16 10:14:02 auth sshd[${2000 + i}]: Failed password for intruder from 192.168.1.50 port ${40000 + i} ssh2`);
        }
      }
      vfs.writeFile('/var/log/auth.log', logLines.join('\n'));
    }
  },

  {
    id: 19,
    title: "Level 19: Finding SUID Binaries",
    category: "System & Security",
    difficulty: "Advanced",
    objective: "To access Level 20, inspect the system for SetUID (SUID) binaries. Find the SUID executable owned by 'level20' and run it to read the password.",
    commandsUsed: ["find", "ls -l", "chmod"],
    hints: [
      "SUID binaries run with the permissions of the file owner rather than the executor.",
      "Search for SUID binaries using find: find / -perm -4000 -user level20 2>/dev/null",
      "Run the discovered binary '/usr/bin/suid_checker' to print the token."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level19');
      vfs.writeFile('/usr/bin/suid_checker', 
`#!/bin/bash
# SUID Checker Utility
echo "[+] SUID execution verified as level20!"
echo "Level 20 Password: ${password}"`, {
        owner: 'level20',
        group: 'level19',
        permissions: 'rwsr-xr-x',
        suid: true
      });
    }
  },

  {
    id: 20,
    title: "Level 20: Setuid Shell Breakout",
    category: "System & Security",
    difficulty: "Advanced",
    objective: "There is an SUID executable in your home directory called 'view_report' that executes a viewer. Exploit the command invocation to read /etc/level21_pass.",
    commandsUsed: ["cat", "ls -la"],
    hints: [
      "Check permissions with 'ls -la view_report'. Notice the 's' in rwsr-xr-x.",
      "Running './view_report /etc/level21_pass' invokes a reader that operates with level21 privileges.",
      "Execute: ./view_report /etc/level21_pass"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level20');
      vfs.writeFile('/etc/level21_pass', password, {
        owner: 'level21',
        group: 'level21',
        permissions: 'r--------'
      });
      vfs.writeFile('/home/level20/view_report',
`#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: ./view_report <filepath>"
  exit 1
fi
echo "[+] Elevated viewer reading $1:"
cat "$1"`, {
        owner: 'level21',
        group: 'level20',
        permissions: 'rwsr-xr-x',
        suid: true
      });
    }
  },

  // ==========================================
  // LEVELS 21 - 25: Scheduled Cron & Scripting
  // ==========================================
  {
    id: 21,
    title: "Level 21: Scheduled Tasks & Cron Inspection",
    category: "System & Security",
    difficulty: "Intermediate",
    objective: "A scheduled job runs automatically on the system via cron. Inspect '/etc/cron.d/' to discover what script is running periodically and extract the Level 22 token.",
    commandsUsed: ["ls", "cat", "crontab"],
    hints: [
      "System cron configuration files are placed in '/etc/cron.d/'.",
      "List the directory contents using 'ls /etc/cron.d/' and cat the entry for level22.",
      "Check the target shell script mentioned inside the cron definition."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level21');
      vfs.mkdir('/etc/cron.d');
      vfs.writeFile('/etc/cron.d/cronjob_level22',
`# Cron task for Level 22 backup
* * * * * level22 /usr/bin/cronjob_level22.sh &> /dev/null`
      );
      vfs.writeFile('/usr/bin/cronjob_level22.sh',
`#!/bin/bash
# Copies password to /tmp for verification
echo "${password}" > /tmp/level22_flag.txt
chmod 644 /tmp/level22_flag.txt`
      );
      vfs.writeFile('/tmp/level22_flag.txt', password);
    }
  },

  {
    id: 22,
    title: "Level 22: Cron Script Path & MD5 Target",
    category: "System & Security",
    difficulty: "Advanced",
    objective: "A cronjob runs '/usr/local/bin/croncmd.sh' periodically as level23. Inspect the script to understand where it stores the password token.",
    commandsUsed: ["cat", "ls -l"],
    hints: [
      "Read the script: cat /usr/local/bin/croncmd.sh",
      "Notice how it derives the output location in /tmp using an md5 hash of the username.",
      "Check the output file directly in /tmp/target_level23."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level22');
      vfs.writeFile('/usr/local/bin/croncmd.sh',
`#!/bin/bash
# Backup level23 password to temporary cache
mytarget=$(echo I am user level23 | md5sum | cut -d ' ' -f 1)
echo "${password}" > /tmp/target_level23`
      );
      vfs.writeFile('/tmp/target_level23', password);
    }
  },

  {
    id: 23,
    title: "Level 23: Script Injection via Wildcard Directory",
    category: "System & Security",
    difficulty: "Advanced",
    objective: "A cron daemon executes all scripts placed in '/var/spool/level24/scripts/' every minute as user level24. Check the directory and read the script logs.",
    commandsUsed: ["ls", "cat"],
    hints: [
      "List the contents of '/var/spool/level24/scripts/'.",
      "Inspect the recent output log '/tmp/script_output.log'.",
      "Run: cat /tmp/script_output.log to read the executed token."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level23');
      vfs.mkdir('/var/spool/level24/scripts');
      vfs.writeFile('/var/spool/level24/scripts/fetch_pass.sh',
`#!/bin/bash
cat /etc/level24_pass > /tmp/script_output.log`
      );
      vfs.writeFile('/tmp/script_output.log', `Level 24 Password: ${password}`);
    }
  },

  {
    id: 24,
    title: "Level 24: PIN Brute-force Daemon",
    category: "Networking & Reconnaissance",
    difficulty: "Advanced",
    objective: "A daemon is listening on localhost port 30002. It expects the current level password followed by a 4-digit PIN (e.g. '<level24_pass> 1004'). Send the correct PIN to claim the password.",
    commandsUsed: ["nc", "cat"],
    hints: [
      "The target PIN is between 1000 and 1010.",
      "The secret PIN for this challenge is 1004.",
      "Send: echo '<level24_pass> 1004' | nc localhost 30002"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level24');
      vfs.writeFile('/home/level24/pin_instructions.txt', 'Daemon at localhost:30002. Format: <level24_pass> <4-digit PIN>');
    }
  },

  {
    id: 25,
    title: "Level 25: SGID & Group Permissions",
    category: "System & Security",
    difficulty: "Intermediate",
    objective: "The password for Level 26 is in '/var/shared/level26_token'. Notice its group ownership and file permissions.",
    commandsUsed: ["ls -l", "id", "cat"],
    hints: [
      "Run 'id' to see which supplementary groups you belong to.",
      "Check permissions with 'ls -la /var/shared/level26_token'.",
      "Run: cat /var/shared/level26_token"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level25');
      vfs.mkdir('/var/shared');
      vfs.writeFile('/var/shared/level26_token', password, {
        owner: 'level26',
        group: 'level25',
        permissions: 'r--r-----'
      });
    }
  },

  // ==========================================
  // LEVELS 26 - 30: Shell Breakouts & Git Secrets
  // ==========================================
  {
    id: 26,
    title: "Level 26: Pager / Shell Escape",
    category: "System & Security",
    difficulty: "Advanced",
    objective: "A custom restricted shell script 'restricted_view.sh' displays the password file through a pager command. Find the token contained within.",
    commandsUsed: ["cat", "ls"],
    hints: [
      "Programs like 'more' or 'less' can view files or spawn shells when terminal windows are small.",
      "Read the script in your directory: cat restricted_view.sh",
      "Run: cat /etc/level27_creds"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level26');
      vfs.writeFile('/home/level26/restricted_view.sh',
`#!/bin/bash
echo "[+] Displaying credential archive..."
cat /etc/level27_creds`
      );
      vfs.writeFile('/etc/level27_creds', `Level 27 Password: ${password}`);
    }
  },

  {
    id: 27,
    title: "Level 27: Git Repository - Commit History",
    category: "Forensics & Source Code",
    difficulty: "Intermediate",
    objective: "There is a git repository in '/home/level27/repo'. A developer made a commit with a secret password and then tried to hide it in a later commit. Find the secret in the commit history.",
    commandsUsed: ["git", "cd"],
    hints: [
      "Navigate to the repository: cd repo",
      "Use 'git log' with the '-p' (patch/diff) attribute to see what was changed in every commit.",
      "Run: cd repo && git log -p"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level27');
      vfs.mkdir('/home/level27/repo');
      vfs.mkdir('/home/level27/repo/.git');
      vfs.writeFile('/home/level27/repo/README.md', '# Security Project\nInitial commit.');
      vfs.writeFile('/home/level27/repo/config.env', 'DATABASE_URL=postgres://localhost:5432');
    }
  },

  {
    id: 28,
    title: "Level 28: Git Branches - Hidden Branch",
    category: "Forensics & Source Code",
    difficulty: "Intermediate",
    objective: "There is a git repository in '/home/level28/repo'. The secret token was committed to a separate development branch. Find and inspect that branch.",
    commandsUsed: ["git", "cd"],
    hints: [
      "Enter the repository with 'cd repo'.",
      "Use 'git branch -a' to list all branches.",
      "Check the branch 'secret-feature' using: git checkout secret-feature (or git diff master..secret-feature)."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level28');
      vfs.mkdir('/home/level28/repo');
      vfs.mkdir('/home/level28/repo/.git');
      vfs.writeFile('/home/level28/repo/README.md', '# Project repository');
    }
  },

  {
    id: 29,
    title: "Level 29: Git Tags - Release Artifact",
    category: "Forensics & Source Code",
    difficulty: "Intermediate",
    objective: "There is a git repository in '/home/level29/repo'. The password was tagged in a release. Find the git tag and view the tagged commit.",
    commandsUsed: ["git", "cd"],
    hints: [
      "Enter the repository: cd repo",
      "Use 'git tag' to list all release tags.",
      "View the tag contents with 'git show secret-release' or 'git tag -n'."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level29');
      vfs.mkdir('/home/level29/repo');
      vfs.mkdir('/home/level29/repo/.git');
      vfs.writeFile('/home/level29/repo/app.js', '// Production release v1.0');
    }
  },

  {
    id: 30,
    title: "Level 30: Git Remote & Diff Analysis",
    category: "Forensics & Source Code",
    difficulty: "Intermediate",
    objective: "There is a git repository in '/home/level30/repo'. Check the differences between the local branch and the remote tracking branch 'origin/dev'.",
    commandsUsed: ["git", "diff"],
    hints: [
      "Navigate to the repo: cd repo",
      "Run 'git diff master origin/dev' to see what changes exist on the remote branch.",
      "The diff reveals the added credentials!"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level30');
      vfs.mkdir('/home/level30/repo');
      vfs.mkdir('/home/level30/repo/.git');
      vfs.writeFile('/home/level30/repo/settings.json', '{"debug": false}');
    }
  },

  // ==========================================
  // LEVELS 31 - 34: Forensics, Capabilities & Final CTF
  // ==========================================
  {
    id: 31,
    title: "Level 31: Environment Variable Leakage",
    category: "System & Security",
    difficulty: "Beginner",
    objective: "The password for Level 32 has been leaked into the system environment variables under the variable name 'LEVEL32_SECRET_TOKEN'. Find it.",
    commandsUsed: ["env", "grep"],
    hints: [
      "The 'env' command prints all exported environment variables.",
      "Combine 'env' with 'grep' to quickly spot the secret key.",
      "Run: env | grep LEVEL32 (or simply type 'env')"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level31');
      vfs.writeFile('/home/level31/.bashrc', `# Exported session vars\nexport LEVEL32_SECRET_TOKEN=${password}`);
    }
  },

  {
    id: 32,
    title: "Level 32: Upper/Lower Restricted Shell Jailbreak",
    category: "System & Security",
    difficulty: "Advanced",
    objective: "You are placed in an uppercase restricted shell wrapper. Find the bypass to execute standard lowercase commands and read the level 33 password.",
    commandsUsed: ["cat", "pwd"],
    hints: [
      "In restricted shells, built-in variables or shell parameters like '$0' can spawn an unrestricted shell.",
      "Check '/etc/level33_token.txt'.",
      "Run: cat /etc/level33_token.txt"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level32');
      vfs.writeFile('/etc/level33_token.txt', password);
    }
  },

  {
    id: 33,
    title: "Level 33: Linux POSIX File Capabilities",
    category: "System & Security",
    difficulty: "Advanced",
    objective: "Linux capabilities grant granular root privileges to executables. Use 'getcap' to find binaries with special capabilities and read the Level 34 password.",
    commandsUsed: ["getcap", "cat"],
    hints: [
      "The 'getcap' command audits file capabilities.",
      "Search the filesystem recursively with: getcap -r / 2>/dev/null",
      "Notice '/usr/bin/cap_reader' with 'cap_dac_read_search+ep'. Read the protected token with it."
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level33');
      vfs.writeFile('/usr/bin/cap_reader', '#!/bin/bash\ncat /etc/shadow_level34', {
        capabilities: 'cap_dac_read_search+ep',
        permissions: 'rwxr-xr-x'
      });
      vfs.writeFile('/etc/shadow_level34', `Level 34 Password: ${password}`, {
        permissions: 'r--------',
        owner: 'root'
      });
    }
  },

  {
    id: 34,
    title: "Level 34: The Master CTF Flag (Memory Dump)",
    category: "Forensics & Mastery",
    difficulty: "Expert",
    objective: "Final Championship Level! The master flag has been stored inside the shared memory dump '/dev/shm/memory_dump.raw'. Carve out the human-readable master token to complete the entire lab!",
    commandsUsed: ["strings", "grep", "cat"],
    hints: [
      "Shared memory in Linux is mounted at '/dev/shm'.",
      "Use 'strings' to extract printable sequences from '/dev/shm/memory_dump.raw'.",
      "Run: strings /dev/shm/memory_dump.raw | grep -i 'CHAMPION'"
    ],
    setup: (vfs, password) => {
      vfs.mkdir('/home/level34');
      vfs.mkdir('/dev');
      vfs.mkdir('/dev/shm');
      const memoryNoise = '\x00\x11\x22\x33\x44' +
        'MEMORY_CHUNK_0x892019482019\x00\x00' +
        'PROCESS_PID_4891_KERNEL_STACK_DUMP' +
        '\x00\x00\x00\x00' +
        `[*] FLAG_FOUND: ${password} [*]` +
        '\x00\xff\xee\xdd\xcc\xbb';
      vfs.writeFile('/dev/shm/memory_dump.raw', memoryNoise, { binary: true });
    }
  }
];

window.LEVELS = LEVELS;
