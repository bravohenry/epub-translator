const { spawn } = require('child_process');
const path = require('path');

console.log('开始测试spawn...');

const pythonScript = path.join(__dirname, 'test_env.py');
const env = {
    ...process.env,
    TRANSLATOR_API_KEY: 'test-key',
    TRANSLATOR_TARGET_LANG: 'zh'
};

console.log('启动Python进程...');
const python = spawn('python3', [pythonScript], { 
    env: env,
    stdio: ['pipe', 'pipe', 'pipe']
});

python.stdout.on('data', (data) => {
    console.log('输出:', data.toString());
});

python.stderr.on('data', (data) => {
    console.log('错误:', data.toString());
});

python.on('close', (code) => {
    console.log('进程退出码:', code);
});

python.on('error', (err) => {
    console.log('启动错误:', err);
}); 