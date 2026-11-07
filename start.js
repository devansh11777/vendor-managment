const { spawn, exec, execSync } = require('child_process');
const path = require('path');

console.log('\x1b[33m%s\x1b[0m', '==========================================================');
console.log('\x1b[36m%s\x1b[0m', '      LPU Kart - Development Environment      ');
console.log('\x1b[33m%s\x1b[0m', '==========================================================\n');

// Helper to kill tree on Windows
function killTree(pid) {
  if (!pid) return;
  try {
    execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
  } catch (e) {}
}

// 1. Ensure MongoDB service is running
exec('sc query MongoDB', (err, stdout) => {
  if (stdout && stdout.includes('RUNNING')) {
    console.log('\x1b[32m%s\x1b[0m', '✔ MongoDB Service is RUNNING');
  } else {
    console.log('\x1b[33m%s\x1b[0m', 'ℹ Starting MongoDB Service...');
    exec('net start MongoDB', () => {});
  }
});

// 2. Start Backend Server
console.log('\x1b[35m%s\x1b[0m', '🚀 Launching Backend API (Port 5000)...');
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: false
});

// 3. Start Frontend Client
console.log('\x1b[34m%s\x1b[0m', '⚡ Launching Frontend Vite App (Port 5173)...');
const frontend = spawn('npx.cmd', ['vite'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

// 4. Automatically open browser after 2.5 seconds
setTimeout(() => {
  console.log('\x1b[32m%s\x1b[0m', '\n🌐 Opening LPU Kart in your browser: http://localhost:5173');
  console.log('\x1b[90m%s\x1b[0m', '(Press Ctrl+C anytime to stop all servers)\n');
  const openCmd = process.platform === 'win32' ? 'start http://localhost:5173' : 'xdg-open http://localhost:5173';
  exec(openCmd);
}, 2500);

// Proper Windows Cleanup
let isExiting = false;
function cleanup() {
  if (isExiting) return;
  isExiting = true;
  console.log('\n\x1b[33m%s\x1b[0m', '🛑 Stopping all LPU Kart servers cleanly...');

  if (backend && backend.pid) killTree(backend.pid);
  if (frontend && frontend.pid) killTree(frontend.pid);

  // Extra guarantee: run stop.js logic
  try {
    require('./stop');
  } catch (e) {}

  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Catch Windows console close
if (process.stdin.isTTY) {
  process.stdin.setRawMode(false);
}
