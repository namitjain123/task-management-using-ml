const { PythonShell } = require('python-shell');

async function predictTaskPriority(taskDesc, tags, modelType = 'rf') {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'text',
      pythonPath: 'python3',  // Ensure you have Python 3 installed
      scriptPath: './python', // Path to your Python scripts
      args: [taskDesc, tags, modelType] // Arguments to pass to the script
    };

    PythonShell.run('predict_model.py', options, function (err, results) {
      if (err) reject(err);
      resolve(results[0]);  // Return the prediction result (e.g., Low, Medium, High)
    });
  });
}

module.exports = { predictTaskPriority };
