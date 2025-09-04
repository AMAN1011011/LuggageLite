const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TravelLite Development Environment...\n');

// Start backend server
const backendPath = path.join(__dirname, 'backend');
const backend = spawn('node', ['mongodb-auth-server.js'], {
  cwd: backendPath,
  stdio: 'pipe'
});

// Start frontend server
const frontendPath = path.join(__dirname, 'frontend');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: frontendPath,
  stdio: 'pipe',
  shell: true
});

// Handle backend output
backend.stdout.on('data', (data) => {
  console.log(`[BACKEND] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[BACKEND ERROR] ${data.toString().trim()}`);
});

// Handle frontend output
frontend.stdout.on('data', (data) => {
  const output = data.toString().trim();
  if (output) {
    console.log(`[FRONTEND] ${output}`);
  }
});

frontend.stderr.on('data', (data) => {
  const output = data.toString().trim();
  if (output && !output.includes('(Use `node --trace-warnings`')) {
    console.error(`[FRONTEND ERROR] ${output}`);
  }
});

// Handle process exits
backend.on('close', (code) => {
  console.log(`\n❌ Backend process exited with code ${code}`);
  if (code !== 0) {
    console.log('🔄 Restarting backend...');
    // Could add restart logic here
  }
});

frontend.on('close', (code) => {
  console.log(`\n❌ Frontend process exited with code ${code}`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development environment...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development environment...');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

console.log('📊 Development servers starting...');
console.log('   Backend:  http://localhost:5000');
console.log('   Frontend: http://localhost:5173');
console.log('\n💡 Press Ctrl+C to stop both servers\n');
