const { PythonShell } = require('python-shell');
const path = require('path');

async function predictTaskPriority(taskDesc, tags, modelType = 'rf') {

  const { exec } = require('child_process');

  const pythonPath = '"C:/Users/namit/Desktop/SIT753_professional_practise/task_management/venv/Scripts/python.exe"';
  const scriptPath = '"C:/Users/namit/Desktop/SIT753_professional_practise/task_management/python/predict_model.py"';
  const args = [taskDesc, tags, modelType].map(arg => `"${arg}"`).join(' ');
  const command = `${pythonPath} ${scriptPath} ${args}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Exec error:', error);
        return reject(error);
      }
      if (stderr) {
        console.error('⚠️ Python STDERR:', stderr);
      }
      console.log('📦 Python STDOUT:', stdout.trim());
      const predictedPriority = stdout.trim().split(': ')[1];
      resolve(predictedPriority);
    });
  });


 }

module.exports = { predictTaskPriority };
