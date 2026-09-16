/**
 * Comprehensive Linux Command Manual & Interactive Attributes Inspector
 * Provides documentation, flag explanations, security contexts, and clickable examples.
 */

const COMMAND_DOCS = {
  ls: {
    command: 'ls',
    name: 'List Directory Contents',
    category: 'Filesystem Navigation',
    syntax: 'ls [ATTRIBUTES...] [PATH]',
    description: 'List information about files and directories in the Unix filesystem. Essential for directory reconnaissance, finding hidden files, and inspecting file permissions.',
    securityNote: 'Used in recon to discover hidden configuration files (.bashrc, .ssh), identify SUID/SGID binaries with -l, and detect unusual modification timestamps with -t.',
    attributes: [
      {
        flag: '-a',
        longFlag: '--all',
        meaning: 'Do not ignore entries starting with . (includes hidden files & directories).',
        securityUse: 'Crucial for finding hidden dotfiles like .bash_history, .ssh/id_rsa, or hidden password tokens.',
        example: 'ls -a'
      },
      {
        flag: '-l',
        longFlag: '--long',
        meaning: 'Use a long listing format displaying permissions, owner, group, file size, and timestamp.',
        securityUse: 'Audits file permissions (rwx), identifies SUID/SGID bits, and checks file ownership.',
        example: 'ls -l'
      },
      {
        flag: '-la / -al',
        longFlag: '-l -a',
        meaning: 'Combine long listing format with hidden file display.',
        securityUse: 'The standard pentester recon command upon gaining initial shell access.',
        example: 'ls -la'
      },
      {
        flag: '-h',
        longFlag: '--human-readable',
        meaning: 'Print file sizes in human readable format (e.g., 1K, 234M, 2G).',
        securityUse: 'Quickly spot unusually large files (memory dumps, logs, database exports).',
        example: 'ls -lh'
      },
      {
        flag: '-t',
        longFlag: '--sort=time',
        meaning: 'Sort entries by modification time, newest first.',
        securityUse: 'Detect newly dropped adversary scripts, modified configurations, or recent log writes.',
        example: 'ls -lt'
      },
      {
        flag: '-r',
        longFlag: '--reverse',
        meaning: 'Reverse the sorting order.',
        securityUse: 'Combined with -lt (-ltr) to print the most recently modified files at the bottom of the terminal.',
        example: 'ls -ltr'
      },
      {
        flag: '-R',
        longFlag: '--recursive',
        meaning: 'List subdirectories recursively.',
        securityUse: 'Enumerate all nested files across deep directory structures quickly.',
        example: 'ls -R'
      },
      {
        flag: '-S',
        longFlag: '--sort=size',
        meaning: 'Sort files by file size, largest first.',
        securityUse: 'Locate massive files suitable for data exfiltration or denial-of-service analysis.',
        example: 'ls -lS'
      },
      {
        flag: '-1',
        longFlag: '--single-column',
        meaning: 'List one file per line.',
        securityUse: 'Optimal for piping directory contents to automated scripting or grep loops.',
        example: 'ls -1'
      }
    ]
  },

  cd: {
    command: 'cd',
    name: 'Change Directory',
    category: 'Filesystem Navigation',
    syntax: 'cd [DIRECTORY]',
    description: 'Change the current working directory in the terminal environment.',
    securityNote: 'Navigating restricted or system directories like /etc, /var/log, /dev/shm, or user home directories.',
    attributes: [
      {
        flag: '..',
        longFlag: 'parent directory',
        meaning: 'Navigate one level up into the parent folder.',
        securityUse: 'Used in path traversal techniques and moving through nested directory trees.',
        example: 'cd ..'
      },
      {
        flag: '~',
        longFlag: 'home directory',
        meaning: 'Navigate directly to current user home directory (/home/username).',
        securityUse: 'Quickly return to user personal directory from anywhere.',
        example: 'cd ~'
      },
      {
        flag: '-',
        longFlag: 'previous directory',
        meaning: 'Return to the previous working directory (OLDPWD).',
        securityUse: 'Toggle back and forth between two directories during privilege escalation tasks.',
        example: 'cd -'
      },
      {
        flag: '/',
        longFlag: 'root directory',
        meaning: 'Navigate to root directory of the operating system.',
        securityUse: 'Start top-down filesystem enumeration from the root node.',
        example: 'cd /'
      }
    ]
  },

  cat: {
    command: 'cat',
    name: 'Concatenate & Display Files',
    category: 'File Inspection',
    syntax: 'cat [ATTRIBUTES...] [FILE...]',
    description: 'Concatenate files and print on the standard output. Commonly used to view plain text files and flags.',
    securityNote: 'Inspects password hashes (/etc/shadow), sensitive configs, credentials, or scripts.',
    attributes: [
      {
        flag: '-n',
        longFlag: '--number',
        meaning: 'Number all output lines starting from 1.',
        securityUse: 'Helps correlate specific error lines in code audits or security configuration files.',
        example: 'cat -n /etc/passwd'
      },
      {
        flag: '-b',
        longFlag: '--number-nonblank',
        meaning: 'Number nonempty output lines only.',
        securityUse: 'Cleans up numbered line output when analyzing sparse logs or sparse configs.',
        example: 'cat -b file.txt'
      },
      {
        flag: '-A',
        longFlag: '--show-all',
        meaning: 'Show non-printing characters (tabs as ^I, end of line as $).',
        securityUse: 'Reveals hidden whitespace steganography or carriage-return line-ending manipulation.',
        example: 'cat -A script.sh'
      },
      {
        flag: '-s',
        longFlag: '--squeeze-blank',
        meaning: 'Suppress repeated empty output lines.',
        securityUse: 'Condensed viewing of messy log files.',
        example: 'cat -s access.log'
      }
    ]
  },

  pwd: {
    command: 'pwd',
    name: 'Print Working Directory',
    category: 'Filesystem Navigation',
    syntax: 'pwd [ATTRIBUTES]',
    description: 'Print the full filename of the current working directory.',
    securityNote: 'Essential situational awareness check when breaking out of chroot jails or restricted shells.',
    attributes: [
      {
        flag: '-P',
        longFlag: '--physical',
        meaning: 'Avoid all symlinks and print the absolute physical path.',
        securityUse: 'Unmasks symlink deception during folder auditing and path restriction evaluations.',
        example: 'pwd -P'
      },
      {
        flag: '-L',
        longFlag: '--logical',
        meaning: 'Display the logical path including symbolic links.',
        securityUse: 'Shows the path as navigated through virtual links.',
        example: 'pwd -L'
      }
    ]
  },

  file: {
    command: 'file',
    name: 'Determine File Type',
    category: 'File Inspection',
    syntax: 'file [ATTRIBUTES] [FILENAME...]',
    description: 'Tests each argument in an attempt to classify it using magic bytes rather than file extensions.',
    securityNote: 'Identifies polyglots, spoofed extensions (e.g. .jpg that is really an ELF binary), and distinguishes ASCII from binary data.',
    attributes: [
      {
        flag: '-b',
        longFlag: '--brief',
        meaning: 'Do not prepend filenames to output lines (brief mode).',
        securityUse: 'Ideal for automated loops checking file types without extra string parsing.',
        example: 'file -b secret.dat'
      },
      {
        flag: '-i',
        longFlag: '--mime',
        meaning: 'Causes the file command to output mime type strings rather than human-readable text.',
        securityUse: 'Accurate categorization for content validation and payload triage.',
        example: 'file -i payload'
      },
      {
        flag: '-L',
        longFlag: '--dereference',
        meaning: 'Follow symlinks and inspect the target file type.',
        securityUse: 'Reveals true destination file format behind deceptive symbolic links.',
        example: 'file -L /usr/bin/python'
      }
    ]
  },

  find: {
    command: 'find',
    name: 'Search Files in Directory Hierarchy',
    category: 'Data Search & Filtering',
    syntax: 'find [PATH] [EXPRESSIONS/ATTRIBUTES...]',
    description: 'Search for files in a directory hierarchy based on arbitrary criteria like size, user, group, permissions, or name.',
    securityNote: 'Primary tool for local privilege escalation enumeration: finding SUID binaries (-perm -4000), world-writable files (-perm -002), or orphan files.',
    attributes: [
      {
        flag: '-name',
        longFlag: '-name pattern',
        meaning: 'Base of file name matches shell pattern (case-sensitive).',
        securityUse: 'Locate sensitive files: id_rsa, *.conf, passwords.txt, backup.tar.gz.',
        example: 'find . -name "*.txt"'
      },
      {
        flag: '-iname',
        longFlag: '-iname pattern',
        meaning: 'Like -name, but case-insensitive.',
        securityUse: 'Find files regardless of case obfuscation (e.g. PassWord.txt).',
        example: 'find . -iname "*pass*"'
      },
      {
        flag: '-size',
        longFlag: '-size n[cwbkMG]',
        meaning: 'File uses n units of space (c = bytes, k = kilobytes, M = megabytes).',
        securityUse: 'Locate specific size files matching known CTF hints or pinpoint huge memory dumps.',
        example: 'find inhere -size 1033c'
      },
      {
        flag: '-user',
        longFlag: '-user uname',
        meaning: 'File is owned by user uname.',
        securityUse: 'Find files belonging to a specific target user (e.g. level7, root).',
        example: 'find / -user level7 2>/dev/null'
      },
      {
        flag: '-group',
        longFlag: '-group gname',
        meaning: 'File belongs to group gname.',
        securityUse: 'Enumerate shared group resources and files accessible to specific teams.',
        example: 'find . -group level6'
      },
      {
        flag: '-type',
        longFlag: '-type [f/d/l]',
        meaning: 'File is of type f (regular file), d (directory), or l (symbolic link).',
        securityUse: 'Filter out noisy directories and focus strictly on actionable files.',
        example: 'find inhere -type f'
      },
      {
        flag: '-perm',
        longFlag: '-perm [/|-]mode',
        meaning: 'Search files matching exact or masked permission bits (e.g. -4000 for SUID).',
        securityUse: 'CRITICAL privesc attribute: find / -perm -4000 -type f searches all SUID binaries.',
        example: 'find / -perm -4000 -type f'
      },
      {
        flag: '-maxdepth',
        longFlag: '-maxdepth levels',
        meaning: 'Descend at most levels directories below starting-point.',
        securityUse: 'Limits search scope to avoid hanging on slow network shares or deeply nested trees.',
        example: 'find . -maxdepth 2 -type f'
      }
    ]
  },

  grep: {
    command: 'grep',
    name: 'Search Text Using Patterns & Regex',
    category: 'Data Search & Filtering',
    syntax: 'grep [ATTRIBUTES...] PATTERN [FILE...]',
    description: 'Print lines that match patterns. One of the most powerful text processing and log analysis utilities.',
    securityNote: 'Used for password hunting, log forensic analysis, detecting failed login attempts, and extracting API keys or tokens.',
    attributes: [
      {
        flag: '-i',
        longFlag: '--ignore-case',
        meaning: 'Ignore case distinctions in patterns and input data.',
        securityUse: 'Match terms like password, Password, and PASSWORD without missing variations.',
        example: 'grep -i "password" data.txt'
      },
      {
        flag: '-v',
        longFlag: '--invert-match',
        meaning: 'Invert the sense of matching, to select non-matching lines.',
        securityUse: 'Filter out noisy log entries (e.g., exclude healthcheck pings to see suspicious requests).',
        example: 'grep -v "127.0.0.1" access.log'
      },
      {
        flag: '-r',
        longFlag: '--recursive',
        meaning: 'Read all files under each directory, recursively.',
        securityUse: 'Search entire web application source code or /etc for hardcoded credentials.',
        example: 'grep -r "API_KEY" /var/www/'
      },
      {
        flag: '-n',
        longFlag: '--line-number',
        meaning: 'Prefix each line of output with the 1-based line number within its input file.',
        securityUse: 'Pinpoint exact line location of vulnerabilities or credentials.',
        example: 'grep -n "secret" data.txt'
      },
      {
        flag: '-c',
        longFlag: '--count',
        meaning: 'Suppress normal output; instead print a count of matching lines.',
        securityUse: 'Quantify brute-force attempts: count Failed password lines in auth.log.',
        example: 'grep -c "Failed password" /var/log/auth.log'
      },
      {
        flag: '-E',
        longFlag: '--extended-regexp',
        meaning: 'Interpret PATTERNS as extended regular expressions (ERE).',
        securityUse: 'Match complex patterns like IP addresses, email addresses, or specific token formats.',
        example: 'grep -E "[0-9]{1,3}\\.[0-9]{1,3}" logs.txt'
      },
      {
        flag: '-o',
        longFlag: '--only-matching',
        meaning: 'Print only the matched (non-empty) parts of a matching line.',
        securityUse: 'Extract pure tokens or IP addresses without surrounding log clutter.',
        example: 'grep -o "level[0-9]*" data.txt'
      }
    ]
  },

  sort: {
    command: 'sort',
    name: 'Sort Lines of Text Files',
    category: 'Data Search & Filtering',
    syntax: 'sort [ATTRIBUTES...] [FILE...]',
    description: 'Write sorted concatenation of all FILE(s) to standard output.',
    securityNote: 'Required prerequisite for running `uniq` to spot outliers, unique strings, or rogue connections.',
    attributes: [
      {
        flag: '-r',
        longFlag: '--reverse',
        meaning: 'Reverse the result of comparisons.',
        securityUse: 'List highest frequency IP addresses or largest numbers at the top.',
        example: 'sort -r data.txt'
      },
      {
        flag: '-n',
        longFlag: '--numeric-sort',
        meaning: 'Compare according to string numerical value.',
        securityUse: 'Properly sort port numbers, request counts, or timestamp values.',
        example: 'sort -n ports.txt'
      },
      {
        flag: '-u',
        longFlag: '--unique',
        meaning: 'Output only the first of an equal run (deduplicate).',
        securityUse: 'Generate unique lists of attacked endpoints or logged usernames.',
        example: 'sort -u usernames.txt'
      }
    ]
  },

  uniq: {
    command: 'uniq',
    name: 'Report or Omit Repeated Lines',
    category: 'Data Search & Filtering',
    syntax: 'uniq [ATTRIBUTES...] [INPUT [OUTPUT]]',
    description: 'Filter adjacent matching lines from INPUT, writing to OUTPUT. Note: input must be sorted first!',
    securityNote: 'Unmask needle-in-a-haystack anomalies: find the single unique password among thousands of repeated lines.',
    attributes: [
      {
        flag: '-u',
        longFlag: '--unique',
        meaning: 'Only print unique lines (lines that appear exactly once).',
        securityUse: 'Classic CTF challenge technique: sort data.txt | uniq -u to find the hidden token.',
        example: 'sort data.txt | uniq -u'
      },
      {
        flag: '-d',
        longFlag: '--repeated',
        meaning: 'Only print duplicate lines, one for each group.',
        securityUse: 'Detect repeat offenders in brute-force attack logs.',
        example: 'sort ips.txt | uniq -d'
      },
      {
        flag: '-c',
        longFlag: '--count',
        meaning: 'Prefix lines by the number of occurrences.',
        securityUse: 'Build frequency tables: see which IP requested your server most often.',
        example: 'sort access.log | uniq -c | sort -nr'
      },
      {
        flag: '-i',
        longFlag: '--ignore-case',
        meaning: 'Ignore differences in case when comparing.',
        securityUse: 'Group case-mismatched strings together.',
        example: 'uniq -i -c words.txt'
      }
    ]
  },

  strings: {
    command: 'strings',
    name: 'Print Strings of Printable Characters',
    category: 'Binary & Forensics',
    syntax: 'strings [ATTRIBUTES...] [FILE...]',
    description: 'Prints strings of printable characters in files. Useful for inspecting binary files, core dumps, or compiled executables.',
    securityNote: 'Essential reverse engineering and forensics tool: reveals hardcoded passwords, IP addresses, URLs, and debug strings inside binaries.',
    attributes: [
      {
        flag: '-n',
        longFlag: '-n min-len',
        meaning: 'Locate & print any sequence that is at least min-len characters long (default is 4).',
        securityUse: 'Filter out 4-character garbage to find longer sentences or specific tokens.',
        example: 'strings -n 8 binary_app'
      },
      {
        flag: '-t',
        longFlag: '-t [d/o/x]',
        meaning: 'Print the offset within the file before each string (d=decimal, x=hex).',
        securityUse: 'Calculate exact file byte offsets for patching or hex editor inspection.',
        example: 'strings -t x binary_app'
      }
    ]
  },

  base64: {
    command: 'base64',
    name: 'Base64 Encode or Decode Data',
    category: 'Cryptography & Encoding',
    syntax: 'base64 [ATTRIBUTES...] [FILE]',
    description: 'Base64 encode or decode standard input or file to standard output.',
    securityNote: 'Base64 is omnipresent in web exploitation (JWT tokens, Basic Auth headers, reverse shell payloads, obfuscated malware scripts).',
    attributes: [
      {
        flag: '-d',
        longFlag: '--decode',
        meaning: 'Decode data from base64 encoding back to plain text/binary.',
        securityUse: 'Decode intercepted payloads, encoded credentials, or CTF flags.',
        example: 'base64 -d data.txt'
      },
      {
        flag: '-w',
        longFlag: '--wrap=COLS',
        meaning: 'Wrap encoded lines after COLS character (default 76, 0 to disable).',
        securityUse: 'Disable wrapping (-w 0) to generate single-line one-liners for shell injection.',
        example: 'echo "payload" | base64 -w 0'
      }
    ]
  },

  tr: {
    command: 'tr',
    name: 'Translate or Delete Characters',
    category: 'Cryptography & Encoding',
    syntax: 'tr [ATTRIBUTES...] SET1 [SET2]',
    description: 'Translate, squeeze, and/or delete characters from standard input, writing to standard output.',
    securityNote: 'Used for ROT13 / Caesar cipher decoding, case transformation, and stripping malicious or null bytes.',
    attributes: [
      {
        flag: 'ROT13',
        longFlag: "'A-Za-z' 'N-ZA-Mn-za-m'",
        meaning: 'Rotate alphabet by 13 positions (Caesar cipher).',
        securityUse: 'Decodes obfuscated scripts, malware strings, and wargame challenge tokens.',
        example: "cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'"
      },
      {
        flag: '-d',
        longFlag: '--delete',
        meaning: 'Delete characters in SET1, do not translate.',
        securityUse: 'Strip carriage returns (\\r) from Windows files or remove dangerous delimiters.',
        example: "tr -d '\\r' < winfile.txt"
      },
      {
        flag: '-s',
        longFlag: '--squeeze-repeats',
        meaning: 'Replace each sequence of repeated characters with a single occurrence.',
        securityUse: 'Normalize irregular whitespace in scraped tables.',
        example: "tr -s ' ' < spaced.txt"
      }
    ]
  },

  tar: {
    command: 'tar',
    name: 'Archive Utility',
    category: 'Archive & Compression',
    syntax: 'tar [ATTRIBUTES...] [ARCHIVE_NAME] [FILES...]',
    description: 'An archiving utility that stores multiple files into a single archive tape or file, with optional compression.',
    securityNote: 'Archive inspection, extracting backup files, and analyzing malicious tar archives for directory traversal (tar slip).',
    attributes: [
      {
        flag: '-x',
        longFlag: '--extract',
        meaning: 'Extract files from an archive.',
        securityUse: 'Extract archived evidence or challenge files.',
        example: 'tar -xf archive.tar'
      },
      {
        flag: '-f',
        longFlag: '--file=ARCHIVE',
        meaning: 'Use archive file or device ARCHIVE.',
        securityUse: 'Specifies target archive name rather than tape drive.',
        example: 'tar -tf backup.tar'
      },
      {
        flag: '-v',
        longFlag: '--verbose',
        meaning: 'Verbosely list files processed.',
        securityUse: 'See every file extracted to detect overwritten or stealthy files.',
        example: 'tar -xvf bundle.tar'
      },
      {
        flag: '-z',
        longFlag: '--gzip',
        meaning: 'Filter the archive through gzip.',
        securityUse: 'Extract or create .tar.gz or .tgz files directly.',
        example: 'tar -xzf bundle.tar.gz'
      },
      {
        flag: '-j',
        longFlag: '--bzip2',
        meaning: 'Filter the archive through bzip2.',
        securityUse: 'Extract or create .tar.bz2 archives.',
        example: 'tar -xjf bundle.tar.bz2'
      },
      {
        flag: '-t',
        longFlag: '--list',
        meaning: 'List the contents of an archive without extracting.',
        securityUse: 'Safe inspection of untrusted archives to prevent zip-bomb or tar-slip attacks.',
        example: 'tar -tf untrusted.tar'
      }
    ]
  },

  gzip: {
    command: 'gzip',
    name: 'Compress or Decompress Files (LZ77)',
    category: 'Archive & Compression',
    syntax: 'gzip [ATTRIBUTES...] [FILE...]',
    description: 'Reduces the size of the named files using Lempel-Ziv coding (LZ77).',
    securityNote: 'Unpacking compressed log bundles or multi-layered CTF forensic challenge artifacts.',
    attributes: [
      {
        flag: '-d',
        longFlag: '--decompress',
        meaning: 'Decompress gzipped files.',
        securityUse: 'Extract .gz files to recover original payload or password.',
        example: 'gzip -d data.gz'
      },
      {
        flag: '-k',
        longFlag: '--keep',
        meaning: 'Keep (do not delete) input files during compression/decompression.',
        securityUse: 'Preserves original forensic artifact before transformation.',
        example: 'gzip -dk data.gz'
      }
    ]
  },

  bzip2: {
    command: 'bzip2',
    name: 'Block-Sorting File Compressor',
    category: 'Archive & Compression',
    syntax: 'bzip2 [ATTRIBUTES...] [FILE...]',
    description: 'Compresses files using the Burrows-Wheeler block sorting text compression algorithm.',
    securityNote: 'Decompressing forensic packages or CTF puzzle layers.',
    attributes: [
      {
        flag: '-d',
        longFlag: '--decompress',
        meaning: 'Force decompression of .bz2 file.',
        securityUse: 'Extract .bz2 layers in nested decompression challenges.',
        example: 'bzip2 -d data.bz2'
      }
    ]
  },

  xxd: {
    command: 'xxd',
    name: 'Make Hexdump or Reverse Hexdump',
    category: 'Binary & Forensics',
    syntax: 'xxd [ATTRIBUTES...] [INFILE [OUTFILE]]',
    description: 'Creates a hex dump of a given file or standard input. It can also convert a hex dump back to its original binary form.',
    securityNote: 'Crucial for firmware analysis, shellcode inspection, payload carving, and rebuilding binary files from hex representations.',
    attributes: [
      {
        flag: '-r',
        longFlag: '-revert',
        meaning: 'Reverse operation: convert hex dump back into binary/text.',
        securityUse: 'Reconstruct binaries or files from raw hex dumps.',
        example: 'xxd -r data.txt > data.bin'
      },
      {
        flag: '-p',
        longFlag: '-plain',
        meaning: 'Plain hexdump style: continuous hex digits without column formatting.',
        securityUse: 'Extract raw hex strings for feeding into cryptographic algorithms or exploit buffers.',
        example: 'xxd -p payload.bin'
      },
      {
        flag: '-c',
        longFlag: '-cols cols',
        meaning: 'Format by <cols> octets per line (default 16).',
        securityUse: 'Adjust view width for memory alignment analysis.',
        example: 'xxd -c 32 memory.dump'
      }
    ]
  },

  chmod: {
    command: 'chmod',
    name: 'Change File Mode Bits (Permissions)',
    category: 'System & Security',
    syntax: 'chmod [ATTRIBUTES...] MODE[,MODE]... FILE...',
    description: 'Changes the file mode bits of each given file according to mode (numeric or symbolic).',
    securityNote: 'Securing private keys (chmod 600 id_rsa), granting executable rights (+x), or identifying dangerous SUID (u+s / 4000) permissions.',
    attributes: [
      {
        flag: 'u+s / 4755',
        longFlag: 'SUID Bit',
        meaning: 'Set User ID bit: file executes with the permissions of the file owner (e.g. root).',
        securityUse: 'One of the most critical privilege escalation vectors in Linux security.',
        example: 'chmod u+s /usr/local/bin/backup'
      },
      {
        flag: '600',
        longFlag: 'rw-------',
        meaning: 'Owner can read/write, nobody else has any access.',
        securityUse: 'Strict requirement for SSH private keys; ssh will reject keys with looser permissions.',
        example: 'chmod 600 id_rsa'
      },
      {
        flag: '+x',
        longFlag: 'executable',
        meaning: 'Add execute permissions for users.',
        securityUse: 'Make exploit scripts, payload binaries, or bash tools executable.',
        example: 'chmod +x exploit.sh'
      },
      {
        flag: '-R',
        longFlag: '--recursive',
        meaning: 'Change files and directories recursively.',
        securityUse: 'Apply permission changes across entire trees.',
        example: 'chmod -R 700 /home/user/.ssh'
      }
    ]
  },

  nmap: {
    command: 'nmap',
    name: 'Network Exploration & Port Scanner',
    category: 'Networking & Reconnaissance',
    syntax: 'nmap [SCAN TYPE...] [ATTRIBUTES...] {TARGET}',
    description: 'Network exploration tool and security / port scanner. Discovers open ports, running services, and versions.',
    securityNote: 'The gold standard network reconnaissance tool used by security professionals to audit network perimeters.',
    attributes: [
      {
        flag: '-sV',
        longFlag: '--version-intensity',
        meaning: 'Probe open ports to determine service/version info.',
        securityUse: 'Identifies exact software versions (e.g. Apache 2.4.49) to look up CVE exploits.',
        example: 'nmap -sV localhost'
      },
      {
        flag: '-p',
        longFlag: '-p <port ranges>',
        meaning: 'Only scan specified ports or port ranges.',
        securityUse: 'Target specific ports (e.g. 30000-30010) quickly and quietly.',
        example: 'nmap -p 31000-31010 localhost'
      },
      {
        flag: '-v',
        longFlag: '--verbose',
        meaning: 'Increase verbosity level (shows open ports as they are found).',
        securityUse: 'Provides real-time feedback during long reconnaissance scans.',
        example: 'nmap -v localhost'
      }
    ]
  },

  nc: {
    command: 'nc / netcat',
    name: 'Arbitrary TCP and UDP Connections & Listens',
    category: 'Networking & Reconnaissance',
    syntax: 'nc [ATTRIBUTES...] HOST PORT',
    description: 'The Swiss Army knife of networking: read and write data across network connections using TCP or UDP.',
    securityNote: 'Banner grabbing, port checking, reverse shells, raw protocol testing, and data piping over network sockets.',
    attributes: [
      {
        flag: '-z',
        longFlag: 'zero-I/O mode',
        meaning: 'Zero-I/O mode (used for scanning open ports without sending data).',
        securityUse: 'Quick check if a daemon port is accepting connections.',
        example: 'nc -zv localhost 30000-30005'
      },
      {
        flag: '-v',
        longFlag: 'verbose',
        meaning: 'Produce verbose output showing connection status.',
        securityUse: 'Confirms whether connection succeeded or was refused.',
        example: 'nc -v localhost 30001'
      },
      {
        flag: '-l',
        longFlag: 'listen mode',
        meaning: 'Listen for an incoming connection rather than initiating.',
        securityUse: 'Spawns netcat listener to catch incoming reverse shells.',
        example: 'nc -lvnp 4444'
      }
    ]
  },

  ssh: {
    command: 'ssh',
    name: 'OpenSSH Remote Login Client',
    category: 'Networking & Reconnaissance',
    syntax: 'ssh [ATTRIBUTES...] [USER@]HOSTNAME',
    description: 'Connects and logs into the specified hostname using encrypted SSH protocol.',
    securityNote: 'Remote administration, tunneling, key-based authentication, and pivoting through compromised jump-boxes.',
    attributes: [
      {
        flag: '-i',
        longFlag: '-i identity_file',
        meaning: 'Selects a file from which the identity (private key) for public key authentication is read.',
        securityUse: 'Authenticate using a stolen or discovered private key (e.g., id_rsa).',
        example: 'ssh -i id_rsa level14@localhost'
      },
      {
        flag: '-p',
        longFlag: '-p port',
        meaning: 'Port to connect to on the remote host.',
        securityUse: 'Connect to non-standard SSH service ports.',
        example: 'ssh -p 2222 localhost'
      }
    ]
  },

  openssl: {
    command: 'openssl',
    name: 'OpenSSL Command Line Tool',
    category: 'Cryptography & Encoding',
    syntax: 'openssl COMMAND [ATTRIBUTES...]',
    description: 'Cryptography toolkit implementing SSL and TLS protocols as well as a full-strength general-purpose cryptography library.',
    securityNote: 'Auditing SSL/TLS certificates, interacting with encrypted services, banner grabbing on HTTPS/TLS ports, and encrypting files.',
    attributes: [
      {
        flag: 's_client',
        longFlag: 's_client command',
        meaning: 'Implements a generic SSL/TLS client connecting to a remote host using SSL/TLS.',
        securityUse: 'Directly speak to encrypted services, inspect certificates, and send plaintext requests over TLS.',
        example: 'openssl s_client -connect localhost:30001'
      },
      {
        flag: '-quiet',
        longFlag: '-quiet',
        meaning: 'Inhibit printing of session and certificate information.',
        securityUse: 'Clean output showing only application data for easy scripting.',
        example: 'openssl s_client -quiet -connect localhost:30001'
      }
    ]
  },

  diff: {
    command: 'diff',
    name: 'Compare Files Line by Line',
    category: 'Data Search & Filtering',
    syntax: 'diff [ATTRIBUTES...] FROM-FILE TO-FILE',
    description: 'Compare files line by line and print differences.',
    securityNote: 'Detect configuration drift, identify unauthorized code changes, compare old vs new password dumps.',
    attributes: [
      {
        flag: '-u',
        longFlag: '--unified',
        meaning: 'Output unified context diff with + and - markers.',
        securityUse: 'Standard format for code reviews and vulnerability patches.',
        example: 'diff -u old.conf new.conf'
      },
      {
        flag: '-y',
        longFlag: '--side-by-side',
        meaning: 'Output differences in two side-by-side columns.',
        securityUse: 'Visually scan altered lines in parallel.',
        example: 'diff -y file1 file2'
      }
    ]
  },

  wc: {
    command: 'wc',
    name: 'Print Newline, Word, and Byte Counts',
    category: 'Data Search & Filtering',
    syntax: 'wc [ATTRIBUTES...] [FILE...]',
    description: 'Print newline, word, and byte counts for each FILE, and a total line if more than one FILE is specified.',
    securityNote: 'Log volume verification, sizing data leaks, and counting attack vectors in forensic analysis.',
    attributes: [
      {
        flag: '-l',
        longFlag: '--lines',
        meaning: 'Print only the newline/line counts.',
        securityUse: 'Quantify occurrences: `grep "Failed" auth.log | wc -l`.',
        example: 'wc -l /etc/passwd'
      },
      {
        flag: '-c',
        longFlag: '--bytes',
        meaning: 'Print only the byte counts.',
        securityUse: 'Verify precise file byte lengths matching target specifications.',
        example: 'wc -c secret.txt'
      }
    ]
  },

  git: {
    command: 'git',
    name: 'Fast Distributed Version Control System',
    category: 'Forensics & Source Code',
    syntax: 'git [ATTRIBUTES/SUBCOMMANDS...]',
    description: 'Version control system tracking changes in source code. Repositories often accidentally leak passwords, keys, and tokens.',
    securityNote: 'Source code secrets hunting: inspecting past commit histories, checkout out dangling branches, and checking diffs for removed API keys.',
    attributes: [
      {
        flag: 'log -p',
        longFlag: 'git log --patch',
        meaning: 'Show commit history along with the full diff of each commit.',
        securityUse: 'Find passwords that a developer accidentally committed and then deleted in a later commit.',
        example: 'git log -p'
      },
      {
        flag: 'branch -a',
        longFlag: 'git branch --all',
        meaning: 'List both local and remote-tracking branches.',
        securityUse: 'Discover hidden development or test branches containing unsecured features.',
        example: 'git branch -a'
      },
      {
        flag: 'diff',
        longFlag: 'git diff [branch1] [branch2]',
        meaning: 'Show changes between commits, commit and working tree, etc.',
        securityUse: 'Inspect what changed between production and developer branch.',
        example: 'git diff master origin/dev'
      },
      {
        flag: 'tag -n',
        longFlag: 'git tag --list -n',
        meaning: 'List tags with annotation lines.',
        securityUse: 'Find release versions or secret release tags.',
        example: 'git tag -n'
      }
    ]
  },

  crontab: {
    command: 'crontab',
    name: 'Maintain Crontab Files for Individual Users',
    category: 'System & Security',
    syntax: 'crontab [ATTRIBUTES...]',
    description: 'Crontab is the program used to install, deinstall or list the tables used to serve the cron daemon.',
    securityNote: 'Prime privilege escalation target: inspect scheduled jobs running as root or high-privilege accounts to hijack their scripts.',
    attributes: [
      {
        flag: '-l',
        longFlag: 'list',
        meaning: 'Displays the current crontab on standard output.',
        securityUse: 'Audit scheduled jobs running under the current user account.',
        example: 'crontab -l'
      }
    ]
  },

  id: {
    command: 'id',
    name: 'Print Real and Effective User and Group IDs',
    category: 'System & Security',
    syntax: 'id [ATTRIBUTES...] [USER]',
    description: 'Print user and group information for the specified USER, or for the current process.',
    securityNote: 'Always run immediately upon getting a shell to see UID, GID, and special groups (e.g. docker, lxd, sudo, disk).',
    attributes: [
      {
        flag: '-u',
        longFlag: '--user',
        meaning: 'Print only the effective user ID.',
        securityUse: 'Check if current UID is 0 (root).',
        example: 'id -u'
      },
      {
        flag: '-g',
        longFlag: '--group',
        meaning: 'Print only the effective group ID.',
        securityUse: 'Check current primary group membership.',
        example: 'id -g'
      },
      {
        flag: '-Gn',
        longFlag: '--groups --name',
        meaning: 'Print group names instead of numeric GIDs.',
        securityUse: 'Readable list of all security groups the current user belongs to.',
        example: 'id -Gn'
      }
    ]
  },

  whoami: {
    command: 'whoami',
    name: 'Print Effective User Name',
    category: 'System & Security',
    syntax: 'whoami',
    description: 'Print the user name associated with the current effective user ID.',
    securityNote: 'Quick check of current identity after running privilege escalation exploits.',
    attributes: []
  },

  env: {
    command: 'env',
    name: 'Run a Program in a Modified Environment / Print Env',
    category: 'System & Security',
    syntax: 'env [ATTRIBUTES...] [NAME=VALUE...] [COMMAND]',
    description: 'Set environment variables for command execution or print all current environment variables.',
    securityNote: 'Detect exposed API keys, database credentials, AWS secrets, or SECRET_TOKEN environment variables.',
    attributes: []
  },

  getcap: {
    command: 'getcap',
    name: 'Examine File Capabilities',
    category: 'System & Security',
    syntax: 'getcap [ATTRIBUTES...] FILENAME...',
    description: 'Displays the name and capabilities of each specified file. Linux capabilities divide root privileges into distinct units.',
    securityNote: 'Look for cap_setuid, cap_net_raw, or cap_dac_read_search that permit privilege escalation without standard SUID bits.',
    attributes: [
      {
        flag: '-r',
        longFlag: '--recursive',
        meaning: 'Recursively search directory trees.',
        securityUse: 'Find all binaries with special capabilities across the entire OS: getcap -r / 2>/dev/null.',
        example: 'getcap -r / 2>/dev/null'
      }
    ]
  }
};

window.COMMAND_DOCS = COMMAND_DOCS;
