/**
 * Virtual File System (VFS) for Cyber Security CLI Lab
 * Supports Unix-like directory hierarchy, permissions, file types, and traversal.
 */

class VFSNode {
  constructor(name, type = 'file', options = {}) {
    this.name = name;
    this.type = type; // 'file', 'dir', 'symlink'
    this.content = options.content || '';
    this.binary = options.binary || false;
    this.size = options.size !== undefined ? options.size : (this.content ? this.content.length : 4096);
    this.owner = options.owner || 'root';
    this.group = options.group || 'root';
    this.permissions = options.permissions || (type === 'dir' ? 'rwxr-xr-x' : 'rw-r--r--');
    this.suid = options.suid || false;
    this.sgid = options.sgid || false;
    this.capabilities = options.capabilities || null;
    this.children = type === 'dir' ? new Map() : null;
    this.target = options.target || null; // for symlinks
    this.mtime = options.mtime || new Date();
  }
}

class VirtualFileSystem {
  constructor() {
    this.root = new VFSNode('', 'dir', { owner: 'root', group: 'root', permissions: 'rwxr-xr-x' });
    this.currentUser = 'level0';
    this.currentGroup = 'level0';
    this.currentPath = '/home/level0';
    this.initDefaultSystem();
  }

  initDefaultSystem() {
    this.mkdir('/bin');
    this.mkdir('/etc');
    this.mkdir('/home');
    this.mkdir('/home/level0', { owner: 'level0', group: 'level0' });
    this.mkdir('/tmp', { permissions: 'rwxrwxrwt' });
    this.mkdir('/var');
    this.mkdir('/var/log');
    this.mkdir('/usr');
    this.mkdir('/usr/bin');
    this.mkdir('/usr/local/bin');

    // /etc/passwd
    this.writeFile('/etc/passwd', [
      'root:x:0:0:root:/root:/bin/bash',
      'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
      'bin:x:2:2:bin:/bin:/usr/sbin/nologin',
      'sys:x:3:3:sys:/dev:/usr/sbin/nologin',
      'level0:x:1000:1000:Level 0 User:/home/level0:/bin/bash',
      ...Array.from({ length: 35 }, (_, i) => `level${i + 1}:x:${1001 + i}:${1001 + i}:Level ${i + 1} User:/home/level${i + 1}:/bin/bash`)
    ].join('\n'), { owner: 'root', group: 'root', permissions: 'rw-r--r--' });

    // /etc/os-release
    this.writeFile('/etc/os-release', [
      'NAME="CyberLab GNU/Linux"',
      'VERSION="2026.1 (Antigravity DefSec)"',
      'ID=cyberlab',
      'PRETTY_NAME="CyberLab Linux Wargame 2026"',
      'HOME_URL="https://cyberlab.antigravity.security/"'
    ].join('\n'));

    // /etc/motd
    this.writeFile('/etc/motd', [
      '===========================================================',
      '       🛡️ WELCOME TO CYBER SECURITY CLI LAB 2026 🛡️         ',
      '===========================================================',
      ' Learn Linux administration, ethical hacking, and CLI tools',
      ' Type "help" for command manual and attribute inspector.',
      ' Type "hint" for current level guidance.',
      ' Type "submit <password>" when you find the next level token.',
      '==========================================================='
    ].join('\n'));
  }

  // Resolve absolute path from relative
  resolvePath(path) {
    if (!path || path === '.') return this.currentPath;
    if (path.startsWith('~')) {
      path = path.replace(/^~/, `/home/${this.currentUser}`);
    }
    let parts;
    if (path.startsWith('/')) {
      parts = path.split('/');
    } else {
      parts = (this.currentPath + '/' + path).split('/');
    }

    const resolved = [];
    for (const part of parts) {
      if (!part || part === '.') continue;
      if (part === '..') {
        if (resolved.length > 0) resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  }

  getNode(path) {
    const absPath = this.resolvePath(path);
    if (absPath === '/') return this.root;

    const parts = absPath.split('/').filter(Boolean);
    let current = this.root;

    for (const part of parts) {
      if (current.type !== 'dir' || !current.children) return null;
      if (!current.children.has(part)) return null;
      current = current.children.get(part);
    }
    return current;
  }

  mkdir(path, options = {}) {
    const absPath = this.resolvePath(path);
    if (absPath === '/') return this.root;

    const parts = absPath.split('/').filter(Boolean);
    let current = this.root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current.children) return null;
      if (!current.children.has(part)) {
        const isLast = i === parts.length - 1;
        const newDir = new VFSNode(part, 'dir', isLast ? options : { owner: 'root', group: 'root' });
        current.children.set(part, newDir);
        current = newDir;
      } else {
        current = current.children.get(part);
        if (current.type !== 'dir') return null;
      }
    }
    return current;
  }

  writeFile(path, content = '', options = {}) {
    const absPath = this.resolvePath(path);
    const lastSlash = absPath.lastIndexOf('/');
    const dirPath = absPath.substring(0, lastSlash) || '/';
    const fileName = absPath.substring(lastSlash + 1);

    const dirNode = this.getNode(dirPath) || this.mkdir(dirPath);
    if (!dirNode || dirNode.type !== 'dir') return false;

    const existing = dirNode.children.get(fileName);
    if (existing && existing.type === 'dir') return false;

    const fileNode = new VFSNode(fileName, 'file', {
      content,
      size: options.size !== undefined ? options.size : content.length,
      binary: options.binary || false,
      owner: options.owner || this.currentUser,
      group: options.group || this.currentGroup,
      permissions: options.permissions || 'rw-r--r--',
      suid: options.suid || false,
      sgid: options.sgid || false,
      capabilities: options.capabilities || null,
      mtime: options.mtime || new Date()
    });

    dirNode.children.set(fileName, fileNode);
    return fileNode;
  }

  removeNode(path) {
    const absPath = this.resolvePath(path);
    if (absPath === '/') return false;

    const lastSlash = absPath.lastIndexOf('/');
    const dirPath = absPath.substring(0, lastSlash) || '/';
    const name = absPath.substring(lastSlash + 1);

    const dirNode = this.getNode(dirPath);
    if (!dirNode || dirNode.type !== 'dir') return false;

    return dirNode.children.delete(name);
  }

  changeDirectory(path) {
    const target = this.resolvePath(path);
    const node = this.getNode(target);
    if (!node) return { success: false, error: `cd: ${path}: No such file or directory` };
    if (node.type !== 'dir') return { success: false, error: `cd: ${path}: Not a directory` };

    this.currentPath = target;
    return { success: true, path: target };
  }

  listDirectory(path = '.') {
    const node = this.getNode(path);
    if (!node) return { success: false, error: `ls: cannot access '${path}': No such file or directory` };
    if (node.type !== 'dir') {
      return { success: true, entries: [node], isSingleFile: true };
    }

    const entries = Array.from(node.children.values());
    return { success: true, entries, isSingleFile: false };
  }

  readFile(path) {
    const node = this.getNode(path);
    if (!node) return { success: false, error: `cat: ${path}: No such file or directory` };
    if (node.type === 'dir') return { success: false, error: `cat: ${path}: Is a directory` };

    return { success: true, content: node.content, binary: node.binary, size: node.size, node };
  }
}

window.VirtualFileSystem = VirtualFileSystem;
