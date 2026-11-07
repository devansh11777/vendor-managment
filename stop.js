const { execSync } = require('child_process');

console.log('\x1b[33m%s\x1b[0m', 'Stopping LPU Kart servers (ports 5000 & 5173)...');

function killPort(port) {
  try {
    const stdout = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const lines = stdout.trim().split('\n');
    const killedPids = new Set();
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const state = parts[parts.length - 2];
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid) && pid !== '0' && !killedPids.has(pid)) {
        killedPids.add(pid);
        try {
          execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
          console.log('\x1b[32m%s\x1b[0m', `✔ Stopped process on port ${port} (PID ${pid})`);
        } catch (e) {}
      }
    });
  } catch (e) {
    console.log(`ℹ Port ${port} is already free.`);
  }
}

killPort(5000);
killPort(5173);
console.log('\x1b[32m%s\x1b[0m', '✔ All LPU Kart servers have been completely stopped!\n');
