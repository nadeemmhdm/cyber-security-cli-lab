# Cyber Security CLI Lab: Complete Solutions & Walkthrough Manual

Welcome to the **Complete Solutions & Walkthrough Manual** for the **Cyber Security CLI Lab (35 Progressive Levels)**. 
This document provides complete, step-by-step solutions, command attribute breakdowns, security concepts, and flag extraction guides for all 35 levels (Level 0 through Level 34).

---

## 📑 Table of Contents

| Level | Title | Category | Difficulty |
| :--- | :--- | :--- | :--- |
| [Level 0](#level-0-level-0-the-readme-first-steps) | Level 0: The Readme & First Steps | Linux Basics | **Beginner** |
| [Level 1](#level-1-level-1-dashes-in-filename) | Level 1: Dashes in Filename | Linux Basics | **Beginner** |
| [Level 2](#level-2-level-2-spaces-in-filenames) | Level 2: Spaces in Filenames | Linux Basics | **Beginner** |
| [Level 3](#level-3-level-3-hidden-files) | Level 3: Hidden Files | Linux Basics | **Beginner** |
| [Level 4](#level-4-level-4-human-readable-file-in-inhere) | Level 4: Human-Readable File in Inhere | Linux Basics | **Beginner** |
| [Level 5](#level-5-level-5-file-properties-size-permissions) | Level 5: File Properties (Size & Permissions) | Linux Basics | **Beginner** |
| [Level 6](#level-6-level-6-finding-files-by-owner-group) | Level 6: Finding Files by Owner & Group | Linux Basics | **Beginner** |
| [Level 7](#level-7-level-7-pattern-matching-with-grep) | Level 7: Pattern Matching with Grep | Data Filtering | **Intermediate** |
| [Level 8](#level-8-level-8-finding-unique-lines-with-sort-uniq) | Level 8: Finding Unique Lines with Sort & Uniq | Data Filtering | **Intermediate** |
| [Level 9](#level-9-level-9-extracting-strings-from-binary-data) | Level 9: Extracting Strings from Binary Data | Data Filtering | **Intermediate** |
| [Level 10](#level-10-level-10-base64-encoded-token) | Level 10: Base64 Encoded Token | Data Filtering | **Intermediate** |
| [Level 11](#level-11-level-11-caesar-cipher-rot13-rotation) | Level 11: Caesar Cipher ROT13 Rotation | Cryptography | **Intermediate** |
| [Level 12](#level-12-level-12-multi-stage-compression-de-archiving) | Level 12: Multi-Stage Compression De-archiving | Cryptography | **Intermediate** |
| [Level 13](#level-13-level-13-ssh-private-key-authentication) | Level 13: SSH Private Key Authentication | Networking | **Intermediate** |
| [Level 14](#level-14-level-14-submitting-password-to-network-port) | Level 14: Submitting Password to Network Port | Networking | **Intermediate** |
| [Level 15](#level-15-level-15-encrypted-ssl-tls-network-connection) | Level 15: Encrypted SSL/TLS Network Connection | Networking | **Intermediate** |
| [Level 16](#level-16-level-16-port-scanning-with-nmap) | Level 16: Port Scanning with Nmap | Reconnaissance | **Advanced** |
| [Level 17](#level-17-level-17-auditing-file-differences-with-diff) | Level 17: Auditing File Differences with Diff | Reconnaissance | **Advanced** |
| [Level 18](#level-18-level-18-modified-login-shell-dotfile-escape) | Level 18: Modified Login Shell & Dotfile Escape | Reconnaissance | **Advanced** |
| [Level 19](#level-19-level-19-setuid-suid-binary-execution) | Level 19: SetUID (SUID) Binary Execution | Privilege Escalation | **Advanced** |
| [Level 20](#level-20-level-20-suid-binary-with-local-tcp-listener) | Level 20: SUID Binary with Local TCP Listener | Privilege Escalation | **Advanced** |
| [Level 21](#level-21-level-21-scheduled-crontab-tasks) | Level 21: Scheduled Crontab Tasks | Crontab & Scripting | **Advanced** |
| [Level 22](#level-22-level-22-cron-script-parameter-extraction) | Level 22: Cron Script Parameter Extraction | Crontab & Scripting | **Advanced** |
| [Level 23](#level-23-level-23-cron-script-wildcard-injection) | Level 23: Cron Script Wildcard Injection | Crontab & Scripting | **Advanced** |
| [Level 24](#level-24-level-24-4-digit-pin-brute-forcing) | Level 24: 4-Digit PIN Brute-Forcing | Crontab & Scripting | **Advanced** |
| [Level 25](#level-25-level-25-escaping-restricted-shell-more-pager) | Level 25: Escaping Restricted Shell / More Pager | Shell Breakouts | **Advanced** |
| [Level 26](#level-26-level-26-setgid-group-privileges) | Level 26: SetGID & Group Privileges | Privilege Escalation | **Advanced** |
| [Level 27](#level-27-level-27-git-repository-commit-forensics) | Level 27: Git Repository Commit Forensics | Git Forensics | **Advanced** |
| [Level 28](#level-28-level-28-git-hidden-branches) | Level 28: Git Hidden Branches | Git Forensics | **Advanced** |
| [Level 29](#level-29-level-29-git-release-tags) | Level 29: Git Release Tags | Git Forensics | **Advanced** |
| [Level 30](#level-30-level-30-git-remote-tracking-branches-branch-diff) | Level 30: Git Remote Tracking Branches & Branch Diff | Git Forensics | **Advanced** |
| [Level 31](#level-31-level-31-leaked-environment-variables) | Level 31: Leaked Environment Variables | Forensics & Flag | **Expert** |
| [Level 32](#level-32-level-32-restricted-shell-breakout) | Level 32: Restricted Shell Breakout | Forensics & Flag | **Expert** |
| [Level 33](#level-33-level-33-linux-file-capabilities) | Level 33: Linux File Capabilities | Forensics & Flag | **Expert** |
| [Level 34](#level-34-level-34-shared-memory-dump-carving-master-flag) | Level 34: Shared Memory Dump Carving & Master Flag | Forensics & Flag | **Master CTF** |

---

## 🛠️ Global Wargame Principles

1. **Dynamic Random Passwords**: Every lab game session generates cryptographically random passwords. You do not submit hardcoded passwords; instead, follow the commands to extract your session's unique token.
2. **One-Click Auto-Copy**: When a token appears in the terminal output, clicking on it automatically copies it to your clipboard and auto-fills the submission input field.
3. **Piping & Redirection**: Many wargame levels require chaining commands with pipes (`|`) or input redirection (`<`, `2>/dev/null`).
4. **Cyber Coins & Hint Economy**:
   - Completing each level grants **+50 Cyber Coins**.
   - Daily practice streak grants **+25 Cyber Coins**.
   - Tier 1 hints are Free, Tier 2 costs 25 Coins, and Tier 3 costs 50 Coins.

---

# 📚 Detailed Level Solutions (0 – 34)

## Level 0: The Readme & First Steps

- **Category**: `Linux Basics`
- **Difficulty**: `Beginner`

### 🎯 Mission Objective
Retrieve the password for Level 1 from the file 'readme' in the home directory.

### 🧠 Security Concept & Theory
In Linux, standard ASCII text files are viewed using utilities like `cat` (concatenate and print) or pagers like `less`. Every user begins in their personal home directory (`/home/<username>` or `~`).

### 💻 Step-by-Step Commands
```bash
# Check your current working directory: `pwd`
# List all visible files in your home directory: `ls`
# Read the content of the 'readme' file: `cat readme`
# Copy the discovered token printed in the output
# Submit the token: `submit <token>` (or paste it in the sidebar submission form)
```

### 🔍 Command Attributes & Flags Breakdown
- `pwd`: Print Working Directory - Displays current absolute path.
- `ls`: List Directory Contents - Lists files and subdirectories.
- `cat <file>`: Concatenate - Outputs whole content of standard files to terminal screen.

### 📤 Expected Terminal Output
> `A welcome banner displaying the generated password for Level 1.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 1: Dashes in Filename

- **Category**: `Linux Basics`
- **Difficulty**: `Beginner`

### 🎯 Mission Objective
Read the file named '-' in the home directory without causing command attribute confusion.

### 🧠 Security Concept & Theory
Most UNIX utilities treat a leading hyphen (`-`) as the start of a command attribute flag or standard input (`stdin`). If you type `cat -`, cat pauses waiting for keyboard input instead of opening a file named `-`.

### 💻 Step-by-Step Commands
```bash
# List files to confirm the '-' file exists: `ls -l`
# Specify the relative directory path prefix `./` so the utility recognizes it as a filepath: `cat ./-`
# (Alternative) Use input redirection: `cat < -`
# Copy the discovered password and submit to advance.
```

### 🔍 Command Attributes & Flags Breakdown
- `./-`: The `./` prefix explicitly denotes the current directory, preventing POSIX argument parsers from interpreting `-` as a flag.
- `< -`: Shell input redirection operator feeds the file descriptor directly into `stdin`.

### 📤 Expected Terminal Output
> `Confirmation banner with Level 2 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 2: Spaces in Filenames

- **Category**: `Linux Basics`
- **Difficulty**: `Beginner`

### 🎯 Mission Objective
Read a file whose name contains whitespace ('spaces in this filename').

### 🧠 Security Concept & Theory
The Bourne and Bash shells split command lines by whitespace (Internal Field Separator, IFS). Without quotes or escapes, `cat spaces in this filename` attempts to read four separate files named `spaces`, `in`, `this`, and `filename`.

### 💻 Step-by-Step Commands
```bash
# List the directory to observe the full name: `ls`
# Option A (Double quotes): `cat "spaces in this filename"`
# Option B (Single quotes): `cat 'spaces in this filename'`
# Option C (Backslash escape): `cat spaces\ in\ this\ filename`
# Copy the output token and advance.
```

### 🔍 Command Attributes & Flags Breakdown
- `"..."`: Double quotes preserve whitespace and treat the string as a single argument.
- `\ `: Escapes the literal space character so the shell tokenizer does not split arguments.

### 📤 Expected Terminal Output
> `Congratulatory message with Level 3 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 3: Hidden Files

- **Category**: `Linux Basics`
- **Difficulty**: `Beginner`

### 🎯 Mission Objective
Find and read the password in a hidden file inside the directory 'inhere'.

### 🧠 Security Concept & Theory
In Linux, files and folders beginning with a dot (`.`) are 'hidden dotfiles' by default convention (like `.bashrc`, `.ssh`). Standard `ls` omits them from listings unless instructed with `-a` or `-A`.

### 💻 Step-by-Step Commands
```bash
# Enter the target directory: `cd inhere`
# List all files including hidden dotfiles: `ls -la`
# Observe the hidden file: `.hidden`
# Read the hidden file: `cat .hidden`
# Submit the password to advance to Level 4.
```

### 🔍 Command Attributes & Flags Breakdown
- `ls -a`: Show **all** entries, including hidden dotfiles starting with `.`, `.`, and `..`.
- `ls -l`: Use a **long** listing format displaying file permissions, owner, group, size, and date.

### 📤 Expected Terminal Output
> `Level 4 password token printed from `.hidden`.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 4: Human-Readable File in Inhere

- **Category**: `Linux Basics`
- **Difficulty**: `Beginner`

### 🎯 Mission Objective
Find the only human-readable ASCII text file among multiple binary files in 'inhere/'.

### 🧠 Security Concept & Theory
File extensions in Linux (`.txt`, `.bin`) are purely decorative. The operating system and security analysts rely on magic numbers and file headers examined by the `file` utility to identify actual MIME types.

### 💻 Step-by-Step Commands
```bash
# Inspect directory files: `cd inhere && ls`
# Scan all files to identify their true encoding: `file ./*`
# Identify the single entry marked as `ASCII text` (e.g. `./-file07`)
# Read that specific file: `cat ./-file07`
# Submit the Level 5 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `file <pattern>`: Inspects file headers to classify files as ASCII text, ELF binary, data, compressed archive, etc.
- `./*`: Glob expansion that prefixes matches with `./` to safeguard against names starting with hyphens.

### 📤 Expected Terminal Output
> `Output showing `ASCII text` for the target file, yielding the Level 5 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 5: File Properties (Size & Permissions)

- **Category**: `Linux Basics`
- **Difficulty**: `Beginner`

### 🎯 Mission Objective
Find a file in 'inhere' that is human-readable, exactly 1033 bytes in size, and non-executable.

### 🧠 Security Concept & Theory
The `find` utility is one of the most powerful system reconnaissance tools in Linux. It recursively traverses directory trees and filters by size (`-size`), file type (`-type`), and permissions (`! -executable`).

### 💻 Step-by-Step Commands
```bash
# Search the `inhere` tree for regular files of exact size 1033 bytes: `find inhere -type f -size 1033c`
# The command returns the exact relative path (e.g. `inhere/maybehere07/.file2`)
# Read the discovered file: `cat inhere/maybehere07/.file2`
# Submit the Level 6 password token.
```

### 🔍 Command Attributes & Flags Breakdown
- `-type f`: Matches regular files only (ignores directories, sockets, symlinks).
- `-size 1033c`: Matches files of exactly 1033 **bytes** (`c` specifies byte unit).
- `! -executable`: Inverts the match to exclude executable files.

### 📤 Expected Terminal Output
> `Clean 1033-byte file output containing Level 6 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 6: Finding Files by Owner & Group

- **Category**: `Linux Basics`
- **Difficulty**: `Beginner`

### 🎯 Mission Objective
Search the entire filesystem for a file owned by user 'level7', group 'level6', and size 33 bytes.

### 🧠 Security Concept & Theory
Privilege escalation and reconnaissance often involve identifying files owned by specific system service accounts or target users across the entire root filesystem (`/`).

### 💻 Step-by-Step Commands
```bash
# Search the root filesystem while suppressing permission errors (`2>/dev/null`): `find / -user level7 -group level6 -size 33c 2>/dev/null`
# Review the discovered path: `/var/lib/bandit_pass/level7.password`
# Display the file content: `cat /var/lib/bandit_pass/level7.password`
# Submit the Level 7 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `-user <name>`: Matches files owned by a specific username.
- `-group <name>`: Matches files belonging to a specific group.
- `2>/dev/null`: Redirects standard error (`stderr`, descriptor 2) to null device, hiding 'Permission denied' clutter.

### 📤 Expected Terminal Output
> `Direct path to the 33-byte password file.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 7: Pattern Matching with Grep

- **Category**: `Data Filtering`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Extract the password stored next to the keyword 'millionth' in a large file named 'data.txt'.

### 🧠 Security Concept & Theory
`grep` (Global Regular Expression Print) searches text files line-by-line for patterns and regular expressions, indispensable for analyzing security logs and massive credential lists.

### 💻 Step-by-Step Commands
```bash
# Run grep to match the target keyword: `grep 'millionth' data.txt`
# Read the paired token from the printed line.
# Submit the password to unlock Level 8.
```

### 🔍 Command Attributes & Flags Breakdown
- `grep <pattern> <file>`: Searches and prints lines containing the specified string.
- `grep -i`: Case-insensitive search.
- `grep -v`: Invert match (prints lines that do not match).

### 📤 Expected Terminal Output
> ``millionth    <level8_password>``

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 8: Finding Unique Lines with Sort & Uniq

- **Category**: `Data Filtering`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Find the only line in 'data.txt' that occurs exactly once (all other lines are duplicated).

### 🧠 Security Concept & Theory
`uniq` removes adjacent duplicate lines from an input stream. Because `uniq` only detects adjacent duplicates, input **must** be pre-sorted using `sort`.

### 💻 Step-by-Step Commands
```bash
# Sort lines alphabetically and pipe to uniq with the unique flag: `sort data.txt | uniq -u`
# Copy the single isolated password string.
# Submit the password to unlock Level 9.
```

### 🔍 Command Attributes & Flags Breakdown
- `sort`: Sorts lines of text alphabetically or numerically.
- `uniq -u`: Unique mode - prints **only** lines that have no duplicates in the sorted stream.
- `|`: Pipe operator - connects standard output of `sort` to standard input of `uniq`.

### 📤 Expected Terminal Output
> `A single unique line containing the Level 9 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 9: Extracting Strings from Binary Data

- **Category**: `Data Filtering`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Extract human-readable password preceded by several '=' characters from a binary blob 'data.txt'.

### 🧠 Security Concept & Theory
Malware analysts and reverse engineers use `strings` to carve printable ASCII/UTF-8 character sequences out of compiled binary files, core dumps, and firmware images.

### 💻 Step-by-Step Commands
```bash
# Extract printable sequences and filter for '=' delimiters: `strings data.txt | grep '==='`
# View the password token following `========== the password is ...`
# Submit to advance to Level 10.
```

### 🔍 Command Attributes & Flags Breakdown
- `strings <file>`: Prints contiguous sequences of printable characters of at least 4 bytes length.
- `grep '==='`: Filters the carved strings for the banner identifier.

### 📤 Expected Terminal Output
> ``========== the password is <level10_password>``

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 10: Base64 Encoded Token

- **Category**: `Data Filtering`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Decode the password token in 'data.txt', which has been encoded in Base64.

### 🧠 Security Concept & Theory
Base64 encodes binary data into 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It is widely used in email headers, HTTP Basic Auth, and obfuscated payloads.

### 💻 Step-by-Step Commands
```bash
# Verify the encoded content: `cat data.txt`
# Decode the Base64 stream: `base64 -d data.txt`
# Copy the decoded plaintext token and submit to unlock Level 11.
```

### 🔍 Command Attributes & Flags Breakdown
- `base64 -d` (or `-decode`): Decodes standard Base64 input into raw plaintext.
- `base64 -w 0`: Disables line wrapping during encoding.

### 📤 Expected Terminal Output
> `Decoded plaintext string containing the Level 11 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 11: Caesar Cipher ROT13 Rotation

- **Category**: `Cryptography`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Decrypt the ROT13 obfuscated text in 'data.txt'.

### 🧠 Security Concept & Theory
ROT13 (Rotate by 13 places) is a Caesar substitution cipher where each letter in the 26-letter alphabet is shifted by 13. Decrypting is identical to encrypting because rotating by 26 returns to the original letter.

### 💻 Step-by-Step Commands
```bash
# Check the scrambled text: `cat data.txt`
# Translate characters using tr: `tr 'A-Za-z' 'N-ZA-Mn-za-m' < data.txt`
# Alternatively pipe cat: `cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'`
# Submit the resulting cleartext Level 12 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `tr 'SET1' 'SET2'`: Translate characters matching SET1 to corresponding positions in SET2.
- `'A-Za-z' 'N-ZA-Mn-za-m'`: Shifts uppercase and lowercase ranges by 13 positions.

### 📤 Expected Terminal Output
> `Decrypted cleartext token for Level 12.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 12: Multi-Stage Compression De-archiving

- **Category**: `Cryptography`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Reverse a hexdump and unpack nested compression layers (gzip, bzip2, tar) to find the secret.

### 🧠 Security Concept & Theory
Incident responders frequently unpack malware droppers wrapped in multiple layers of compression and encoding (hexdumps, tarballs, bzip2, gzip) to obscure contents from basic antivirus signatures.

### 💻 Step-by-Step Commands
```bash
# Create a scratch directory in `/tmp`: `mkdir /tmp/investigate && cp data.txt /tmp/investigate/ && cd /tmp/investigate`
# Revert the ASCII hex dump to raw binary: `xxd -r data.txt unhexed`
# Identify the binary format: `file unhexed` (reveals gzip)
# Rename and decompress gzip: `mv unhexed file.gz && gzip -d file.gz`
# Check new format: `file file` (reveals bzip2)
# Decompress bzip2: `bzip2 -d file`
# Inspect tarball: `tar -xvf file.out`
# Read the extracted plaintext: `cat secret`
# Submit Level 13 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `xxd -r`: Reverse hexdump - converts ASCII hexadecimal representations back into raw bytes.
- `gzip -d`: Decompresses Gzip files (`.gz`).
- `bzip2 -d`: Decompresses Bzip2 archives (`.bz2`).
- `tar -xvf`: Extract (`-x`), verbose output (`-v`), read from file (`-f`).

### 📤 Expected Terminal Output
> `Unpacked file `secret` containing Level 13 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 13: SSH Private Key Authentication

- **Category**: `Networking`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Use the provided private RSA key 'sshkey.private' to log in as user 'level14' on localhost.

### 🧠 Security Concept & Theory
Public-key cryptography enables SSH authentication without passwords. The user presents a private key (`~/.ssh/id_rsa`), and the server verifies it against `authorized_keys`.

### 💻 Step-by-Step Commands
```bash
# Inspect the directory to confirm private key: `ls -la`
# Log in to localhost using the identity key: `ssh -i sshkey.private level14@localhost`
# The server authenticates the key and reveals the Level 14 password.
# Submit the token to advance.
```

### 🔍 Command Attributes & Flags Breakdown
- `ssh -i <identity_file>`: Specifies the private key file for public-key authentication.
- `ssh -p <port>`: Specifies non-standard SSH port.

### 📤 Expected Terminal Output
> `SSH login banner displaying Level 14 credentials.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 14: Submitting Password to Network Port

- **Category**: `Networking`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Submit the current level's password to a local network daemon listening on TCP port 30000.

### 🧠 Security Concept & Theory
`netcat` (`nc`) is the 'Swiss Army Knife' of TCP/IP networking, capable of reading and writing data across network sockets for auditing, banner grabbing, and raw port communications.

### 💻 Step-by-Step Commands
```bash
# Option A (Interactive): Run `nc localhost 30000`, paste the Level 14 password, press Enter.
# Option B (One-liner): `echo "<level14_password>" | nc localhost 30000`
# The daemon checks the password against its database and returns the Level 15 password.
# Submit the token to advance.
```

### 🔍 Command Attributes & Flags Breakdown
- `nc <host> <port>`: Connects to specified hostname and port over TCP.
- `echo <str> | nc ...`: Pushes piped credentials directly into the socket connection.

### 📤 Expected Terminal Output
> ``Correct! Level 15 Password is: <level15_password>``

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 15: Encrypted SSL/TLS Network Connection

- **Category**: `Networking`
- **Difficulty**: `Intermediate`

### 🎯 Mission Objective
Transmit the password to an encrypted SSL/TLS daemon listening on TCP port 30001.

### 🧠 Security Concept & Theory
Unlike plain text netcat connections, TLS/SSL secures communications with transport encryption. The OpenSSL command-line client (`openssl s_client`) acts like netcat over TLS.

### 💻 Step-by-Step Commands
```bash
# Initiate encrypted TLS connection: `openssl s_client -connect localhost:30001`
# Transmit the Level 15 password over the TLS socket: `echo "<level15_password>" | openssl s_client -connect localhost:30001 -quiet`
# Copy the returned Level 16 password from the TLS server stream.
# Submit the password to unlock Level 16.
```

### 🔍 Command Attributes & Flags Breakdown
- `openssl s_client`: Generic SSL/TLS client implementation.
- `-connect <host:port>`: Specifies host and port to initiate TLS handshake.
- `-quiet`: Suppresses verbose SSL session parameters, printing only server payloads.

### 📤 Expected Terminal Output
> `TLS response banner containing Level 16 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 16: Port Scanning with Nmap

- **Category**: `Reconnaissance`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Scan ports 31000 through 31020 on localhost to locate the SSL service that gives credentials.

### 🧠 Security Concept & Theory
`nmap` is the industry-standard network exploration tool and security scanner. It identifies open ports, operating systems, and listening network services.

### 💻 Step-by-Step Commands
```bash
# Scan localhost port range: `nmap -p 31000-31020 localhost`
# Identify the open port supporting SSL (e.g. port 31790 / 31100)
# Connect over SSL using OpenSSL: `echo "<level16_password>" | openssl s_client -connect localhost:31790 -quiet`
# The server returns an RSA private key for Level 17.
# Save key to `/tmp/key.priv`, set permissions `chmod 600 /tmp/key.priv`, and connect: `ssh -i /tmp/key.priv level17@localhost`
# Submit Level 17 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `nmap -p <range>`: Specifies specific port numbers or ranges to scan.
- `chmod 600 <key>`: Secures private key permissions so SSH does not reject it as 'unprotected private key file'.

### 📤 Expected Terminal Output
> `Open SSL service returns SSH key to obtain Level 17 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 17: Auditing File Differences with Diff

- **Category**: `Reconnaissance`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Compare 'passwords.old' and 'passwords.new' to locate the single changed password.

### 🧠 Security Concept & Theory
File integrity monitoring and configuration drift auditing use `diff` to pinpoint additions, deletions, and alterations between two text streams.

### 💻 Step-by-Step Commands
```bash
# Run diff between the previous and updated lists: `diff passwords.old passwords.new`
# Locate the line prefixed with `>` (representing the new entry added in `passwords.new`)
# Copy the distinct token and submit to unlock Level 18.
```

### 🔍 Command Attributes & Flags Breakdown
- `diff <file1> <file2>`: Compares two files line by line.
- `<`: Denotes lines present only in file1.
- `>`: Denotes lines present only in file2 (the new password).

### 📤 Expected Terminal Output
> ``> <level18_password>``

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 18: Modified Login Shell & Dotfile Escape

- **Category**: `Reconnaissance`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Retrieve the password from 'readme' when the login shell terminates automatically upon connection.

### 🧠 Security Concept & Theory
Administrators may configure login scripts (`.bashrc`) that execute `exit` or disconnect users immediately upon interactive shell creation. Running a non-interactive command bypasses interactive startup scripts.

### 💻 Step-by-Step Commands
```bash
# In standard SSH setups: `ssh level18@localhost 'cat readme'`
# In the CLI wargame terminal: `cat ~/readme`
# Copy the revealed token and submit to advance to Level 19.
```

### 🔍 Command Attributes & Flags Breakdown
- `ssh user@host '<command>'`: Executes command directly on remote host without allocating a full interactive tty shell, bypassing `.bashrc` exit traps.

### 📤 Expected Terminal Output
> `Level 19 password token displayed from readme.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 19: SetUID (SUID) Binary Execution

- **Category**: `Privilege Escalation`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Execute the provided SetUID binary 'bandit20-do' to read the protected Level 20 password file.

### 🧠 Security Concept & Theory
SetUID (SUID) is a special Linux file permission bit (`chmod u+s`). When executed, the process inherits the permissions of the file's owner (here, `level20`) rather than the calling user (`level19`).

### 💻 Step-by-Step Commands
```bash
# Verify file permissions: `ls -la bandit20-do` (shows `-rwsr-x--- ... level20 level19`)
# Execute the SUID wrapper to read the root-restricted file: `./bandit20-do cat /etc/level20_pass`
# Copy the Level 20 password and submit.
```

### 🔍 Command Attributes & Flags Breakdown
- `-rwsr-x---`: The `s` bit in owner execute position signifies SUID execution privileges.
- `./bandit20-do <command>`: Executes any command as the higher-privileged user `level20`.

### 📤 Expected Terminal Output
> `Cleartext Level 20 password output.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 20: SUID Binary with Local TCP Listener

- **Category**: `Privilege Escalation`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Run the SUID binary './suconnect' while supplying the current password through a local TCP listener.

### 🧠 Security Concept & Theory
Privilege escalation often involves multi-process coordination where a privileged binary connects back to a localhost network port to validate current credentials before dropping privilege.

### 💻 Step-by-Step Commands
```bash
# Listen on a custom port in the background: `echo "<level20_password>" | nc -l 32000 &`
# Run the SUID binary pointing to your listener: `./suconnect 32000`
# The binary sends credentials over socket and prints the Level 21 password upon verification.
# Submit the Level 21 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `nc -l <port>`: Binds and listens on local TCP port.
- `&`: Puts the process into the background, returning terminal control immediately.

### 📤 Expected Terminal Output
> `Successful authentication handshake returning Level 21 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 21: Scheduled Crontab Tasks

- **Category**: `Crontab & Scripting`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Inspect system crontab configuration to discover a scheduled job that writes credentials.

### 🧠 Security Concept & Theory
Crontabs (`/etc/cron.d/`, `/var/spool/cron/crontabs`) schedule automated recurring jobs executed by the `cron` daemon, frequently running under elevated user privileges.

### 💻 Step-by-Step Commands
```bash
# List scheduled cron configurations: `ls -la /etc/cron.d/`
# Inspect the cronjob entry: `cat /etc/cron.d/cronjob_level22`
# Read the script referenced by the job: `cat /usr/bin/cronjob_level22.sh`
# The script copies `/etc/level22_pass` to a world-readable file in `/tmp/`
# Read that output file: `cat /tmp/<target_file>`
# Submit Level 22 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `/etc/cron.d/`: System-wide cron job configuration directory.
- `* * * * *`: Cron schedule indicating execution every minute.

### 📤 Expected Terminal Output
> `Discovered password file in `/tmp/` containing Level 22 token.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 22: Cron Script Parameter Extraction

- **Category**: `Crontab & Scripting`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Reverse-engineer a shell script executed by cron that generates dynamic hashed output paths.

### 🧠 Security Concept & Theory
Scripts often use dynamic variables like `$(whoami)` or MD5 hashes to compute file storage locations. Understanding the algorithm allows an attacker to compute the path for a different user.

### 💻 Step-by-Step Commands
```bash
# Inspect cron definition: `cat /etc/cron.d/cronjob_level23`
# Analyze the shell script: `cat /usr/bin/cronjob_level23.sh`
# Observe that the script computes target path as: `echo I am user level23 | md5sum | cut -d ' ' -f 1`
# Execute the calculation for `level23`: `echo I am user level23 | md5sum | cut -d ' ' -f 1`
# Read the resulting hashed file from `/tmp`: `cat /tmp/<calculated_hash>`
# Submit the Level 23 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `md5sum`: Computes MD5 cryptographic message digest.
- `cut -d ' ' -f 1`: Splits output by space delimiter and extracts first field (the hash string).

### 📤 Expected Terminal Output
> `Target hash file in `/tmp` containing Level 23 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 23: Cron Script Wildcard Injection

- **Category**: `Crontab & Scripting`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Exploit a cron script that executes all scripts placed in '/var/spool/level24/'.

### 🧠 Security Concept & Theory
If a privileged root/service cron job executes `*` inside a world-writable spool directory, non-privileged users can drop custom executable shell scripts that run under the target user's context.

### 💻 Step-by-Step Commands
```bash
# Inspect the cron schedule: `cat /etc/cron.d/cronjob_level24`
# Inspect script logic: `cat /usr/bin/cronjob_level24.sh` (executes all files in `/var/spool/level24/` and deletes them)
# Create an exploit script in `/tmp`: `echo 'cat /etc/level24_pass > /tmp/pass24 && chmod 666 /tmp/pass24' > /tmp/run.sh`
# Make it executable: `chmod +x /tmp/run.sh`
# Copy script into the spool directory: `cp /tmp/run.sh /var/spool/level24/`
# Read the dumped password: `cat /tmp/pass24`
# Submit Level 24 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `chmod +x`: Sets execute permission bit on script.
- `chmod 666`: Sets read/write permissions for all users so current account can read the output.

### 📤 Expected Terminal Output
> `Password dump `/tmp/pass24` with Level 24 credentials.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 24: 4-Digit PIN Brute-Forcing

- **Category**: `Crontab & Scripting`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Brute-force a daemon listening on port 30002 by sending Level 24 password followed by 0000-9999.

### 🧠 Security Concept & Theory
Weak authentication mechanisms that lack rate limiting or account lockouts can be defeated with fast automated brute-force scripting across local network sockets.

### 💻 Step-by-Step Commands
```bash
# Create a bash loop to generate all 10,000 combinations (0000 to 9999) prefixed by current password:
# `for pin in {0000..9999}; do echo "<level24_password> $pin"; done | nc localhost 30002 > /tmp/brute.out`
# Filter the server responses to isolate the successful unlock: `grep -v 'Wrong' /tmp/brute.out`
# Copy the Level 25 password.
# Submit the password to unlock Level 25.
```

### 🔍 Command Attributes & Flags Breakdown
- `{0000..9999}`: Bash brace expansion generating 4-digit zero-padded numbers.
- `grep -v 'Wrong'`: Eliminates all rejection lines to highlight the single success response.

### 📤 Expected Terminal Output
> `Success response: `Correct! Level 25 Password is: <level25_password>``

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 25: Escaping Restricted Shell / More Pager

- **Category**: `Shell Breakouts`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Escape a restricted shell or terminal pager to view the Level 26 password.

### 🧠 Security Concept & Theory
When a terminal height is smaller than file length, programs like `more` pause output. From `more`, typing `v` invokes `vi`/`vim`, from which arbitrary commands can be spawned using `:!sh`.

### 💻 Step-by-Step Commands
```bash
# Inspect directory: `ls -la`
# Read the secret file directly: `cat ~/secret_pass`
# (Alternative Breakout): In narrow terminal, run pager `more`, type `v` to enter vi, type `:r /etc/level26_pass`.
# Copy the revealed token and advance to Level 26.
```

### 🔍 Command Attributes & Flags Breakdown
- `:!sh`: Vi/Vim escape command that spawns an unrestricted subshell.
- `:r <file>`: Vi command to read external file into buffer.

### 📤 Expected Terminal Output
> `Level 26 password token.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 26: SetGID & Group Privileges

- **Category**: `Privilege Escalation`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Leverage group membership and SetGID permissions to access protected files.

### 🧠 Security Concept & Theory
Linux supports group-based access control. SetGID files (`chmod g+s`) execute with group ownership privileges, allowing members of authorized groups to read protected resources.

### 💻 Step-by-Step Commands
```bash
# Inspect your current user and group memberships: `id`
# Search for files accessible to your group: `ls -l /etc/level27_pass`
# Display file content: `cat /etc/level27_pass`
# Submit Level 27 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `id`: Prints current user (uid), primary group (gid), and supplementary groups.
- `groups`: Displays all group names the current user belongs to.

### 📤 Expected Terminal Output
> `Password content from group-accessible file.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 27: Git Repository Commit Forensics

- **Category**: `Git Forensics`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Inspect the commit history of a local Git repository to recover an accidentally committed password.

### 🧠 Security Concept & Theory
Developers frequently commit sensitive tokens, API keys, and credentials, then make a subsequent commit deleting the file. The secret remains permanently in Git commit history.

### 💻 Step-by-Step Commands
```bash
# Enter the git repository: `cd repo`
# Inspect the commit log with full patch diffs: `git log -p`
# Locate the commit where the password was initially committed or modified.
# Copy the revealed token and submit to unlock Level 28.
```

### 🔍 Command Attributes & Flags Breakdown
- `git log`: Displays commit history.
- `git log -p`: Shows full patch/diff changes introduced in each commit.
- `git log --stat`: Summarizes files changed in each commit.

### 📤 Expected Terminal Output
> `Diff output showing `+ Level 28 password: <level28_password>`.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 28: Git Hidden Branches

- **Category**: `Git Forensics`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Discover credentials stored in an alternative Git branch.

### 🧠 Security Concept & Theory
Production code repositories maintain multiple development, feature, and staging branches. Sensitive data removed from `main` often lingers in unmerged branches.

### 💻 Step-by-Step Commands
```bash
# Navigate to repository: `cd repo`
# List all local and remote branches: `git branch -a`
# Switch to the feature branch: `git checkout dev`
# Read the updated README or secret file: `cat README.md`
# Submit the Level 29 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `git branch -a`: Lists all branches, including remote tracking branches.
- `git checkout <branch>`: Switches the working tree to the specified branch.

### 📤 Expected Terminal Output
> `Level 29 password revealed in the branch working copy.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 29: Git Release Tags

- **Category**: `Git Forensics`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Locate credentials preserved in an old Git release tag.

### 🧠 Security Concept & Theory
Git tags mark specific points in repository history (such as release milestones `v1.0`). Even if subsequent commits overwrite a file, tagged commits remain immutable.

### 💻 Step-by-Step Commands
```bash
# Navigate to repository: `cd repo`
# List all tags with annotations: `git tag -n`
# Inspect the tagged release commit: `git show v1.0.1`
# Copy the password preserved in that version.
# Submit to advance to Level 30.
```

### 🔍 Command Attributes & Flags Breakdown
- `git tag -n`: Lists all tags with their commit messages.
- `git show <tag>`: Inspects commit metadata and diffs for a specific tag.

### 📤 Expected Terminal Output
> `Tagged commit contents revealing Level 30 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 30: Git Remote Tracking Branches & Branch Diff

- **Category**: `Git Forensics`
- **Difficulty**: `Advanced`

### 🎯 Mission Objective
Compare differences between the local master branch and an unmerged remote tracking branch.

### 🧠 Security Concept & Theory
Security auditors compare differences between upstream branches and local forks using `git diff` to identify unreviewed commits and accidental credential leaks.

### 💻 Step-by-Step Commands
```bash
# Enter repo directory: `cd repo`
# Compare local master against remote branch: `git diff master origin/secret-leak`
# Review the added lines displaying the password.
# Submit Level 31 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `git diff <branch1> <branch2>`: Displays differences between two Git trees.
- `origin/<branch>`: References remote tracking branch.

### 📤 Expected Terminal Output
> `Unified diff showing the leaked Level 31 token.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 31: Leaked Environment Variables

- **Category**: `Forensics & Flag`
- **Difficulty**: `Expert`

### 🎯 Mission Objective
Extract secret tokens passed into processes via environment variables.

### 🧠 Security Concept & Theory
Modern containerized environments (Docker, Kubernetes) pass database credentials, API keys, and tokens via environment variables, accessible via `/proc/<pid>/environ` or `env`.

### 💻 Step-by-Step Commands
```bash
# Print all active environment variables: `env`
# Filter for keywords: `env | grep -i 'SECRET\|PASS\|TOKEN'`
# Copy the token value stored in `LEVEL32_SECRET_TOKEN`.
# Submit to advance to Level 32.
```

### 🔍 Command Attributes & Flags Breakdown
- `env`: Prints all exported environment variables.
- `printenv <var>`: Prints value of a specific environment variable.
- `grep -i`: Case-insensitive search.

### 📤 Expected Terminal Output
> ``LEVEL32_SECRET_TOKEN=<level32_password>``

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 32: Restricted Shell Breakout

- **Category**: `Forensics & Flag`
- **Difficulty**: `Expert`

### 🎯 Mission Objective
Break out of a restricted shell (`rbash`) where PATH and directory changes are locked.

### 🧠 Security Concept & Theory
Restricted shells limit users by preventing `cd`, variable assignment, and commands containing `/`. Attackers escape restricted shells using scripting language interpreters, ssh commands, or parameter expansion.

### 💻 Step-by-Step Commands
```bash
# Check current shell: `echo $0` (shows `rbash` or uppercase wrapper)
# Spawn standard shell: `/bin/bash` (or execute `sh` if permitted)
# Read the Level 33 password: `cat /etc/level33_pass`
# Submit the token to advance.
```

### 🔍 Command Attributes & Flags Breakdown
- `$0`: Evaluates to the name of the running shell or script.
- `/bin/bash`: Launches full interactive Bourne-Again Shell.

### 📤 Expected Terminal Output
> `Unrestricted shell access yielding Level 33 password.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 33: Linux File Capabilities

- **Category**: `Forensics & Flag`
- **Difficulty**: `Expert`

### 🎯 Mission Objective
Identify binaries with extended POSIX capabilities (`cap_dac_read_search`) to bypass file read permissions.

### 🧠 Security Concept & Theory
Linux Capabilities divide root privileges into discrete units. The `cap_dac_read_search` capability allows a process to bypass file read permission checks, enabling unauthorized access to protected credential files.

### 💻 Step-by-Step Commands
```bash
# Scan filesystem for binaries with assigned capabilities: `getcap -r / 2>/dev/null`
# Identify the vulnerable binary (e.g. `/usr/bin/python3` or custom utility with `=ep`)
# Use the binary to read `/etc/level34_pass`: `python3 -c "print(open('/etc/level34_pass').read())"`
# Submit the Level 34 password.
```

### 🔍 Command Attributes & Flags Breakdown
- `getcap -r <dir>`: Recursively queries file capability attributes across directory trees.
- `cap_dac_read_search=ep`: Effective and Permitted capability allowing read-access to all files.

### 📤 Expected Terminal Output
> `Level 34 password read through capability bypass.`

### 🚀 Advancement Command
```bash
submit <token>
```

---

## Level 34: Shared Memory Dump Carving & Master Flag

- **Category**: `Forensics & Flag`
- **Difficulty**: `Master CTF`

### 🎯 Mission Objective
Perform live memory forensics on `/dev/shm/memory_dump.raw` to carve out the final Cyber Security Lab Master Flag!

### 🧠 Security Concept & Theory
In volatile memory forensics, residual secrets, plaintext encryption keys, and session tokens persist in RAM (`/dev/shm`, `/dev/mem`). Analysts carve strings to recover flags and indicators of compromise (IoCs).

### 💻 Step-by-Step Commands
```bash
# Inspect the shared memory directory: `ls -la /dev/shm`
# Extract printable strings from the memory dump: `strings /dev/shm/memory_dump.raw`
# Filter for the master flag format: `strings /dev/shm/memory_dump.raw | grep 'CYB3R_M4ST3R'`
# Copy the master flag: `CYB3R_M4ST3R_<token>_2026`
# Submit the flag to complete the entire 35-level curriculum!
```

### 🔍 Command Attributes & Flags Breakdown
- `/dev/shm`: Shared memory temporary filesystem in RAM.
- `strings <file>`: Carves ASCII/printable string blocks out of raw binary dumps.
- `grep 'CYB3R_M4ST3R'`: Isolates the master competition flag.

### 📤 Expected Terminal Output
> ``[🏆 FLAG CARVED FROM MEMORY]: CYB3R_M4ST3R_<hash>_2026``

### 🚀 Advancement Command
```bash
submit CYB3R_M4ST3R_<hash>_2026
```

---

