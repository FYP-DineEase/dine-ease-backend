import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export default async function runPythonScript(sentence) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.resolve(
      'src/review/sentiments',
      'sentiment_analysis.py',
    );

    if (!fs.existsSync(pythonScriptPath)) {
      reject(`Python script '${pythonScriptPath}' not found`);
      return;
    }

    const pythonProcess = spawn('python', [pythonScriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      try {
        const result = data.toString();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    pythonProcess.stdin.write(sentence + '\n');
    pythonProcess.stdin.end();
  });
}
