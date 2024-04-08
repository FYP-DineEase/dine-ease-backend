import { spawn } from 'child_process';
import { Sentiments } from '@dine_ease/common';
import * as path from 'path';
import * as fs from 'fs';

export default async function runPythonScript(
  sentence: string,
): Promise<Sentiments> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.resolve(
      'src/review/sentiments',
      'sentiment_analysis.py',
    );

    if (!fs.existsSync(pythonScriptPath)) {
      reject(`Python script '${pythonScriptPath}' not found`);
      return;
    }

    const args = [sentence];
    args.unshift(pythonScriptPath);

    const pythonProcess = spawn('python', args);

    let dataBuffer = '';

    pythonProcess.stdout.on('data', (data) => {
      dataBuffer += data;
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    pythonProcess.stdout.on('end', () => {
      try {
        const result = JSON.parse(dataBuffer);
        resolve(result.label);
      } catch (error) {
        reject(error);
      }
    });

    pythonProcess.stdin.write(sentence + '\n');
    pythonProcess.stdin.end();
  });
}
