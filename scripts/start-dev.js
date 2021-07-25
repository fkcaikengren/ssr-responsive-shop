
const { spawn } = require('child_process');

function start(){
  const feCodeWatchProcess = spawn('node', ['./scripts/build-dev-client.js'], {
    stdio: 'inherit',
    shell: true,
  });
  
  const svrCodeWatchProcess = spawn('node', ['./scripts/build-dev-server.js'], {
    shell: true,
  });
  
  const killChild = () => {
    svrCodeWatchProcess && svrCodeWatchProcess.kill();
    feCodeWatchProcess && feCodeWatchProcess.kill();
  };
  
  process.on('close', (code) => {
    console.log('main process  close', code);
    killChild();
  });
  process.on('exit', (code) => {
    console.log('main process  exit', code);
    killChild();
  });
}

module.exports = start