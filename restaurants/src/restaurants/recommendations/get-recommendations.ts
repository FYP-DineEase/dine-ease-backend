import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { Types } from 'mongoose';
import { RestaurantDocument } from '../models/restaurant.entity';

export default async function runPythonScript(
  restaurants: RestaurantDocument[],
  reviewedRestaurantIds: Types.ObjectId[],
  coordinates: number[],
): Promise<RestaurantDocument[]> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.resolve(
      'src/restaurants/recommendations',
      'recommendations.py',
    );

    if (!fs.existsSync(pythonScriptPath)) {
      reject(`Python script '${pythonScriptPath}' not found`);
      return;
    }

    const args = [reviewedRestaurantIds.join(', '), coordinates.join(', ')];
    args.unshift(pythonScriptPath);

    const pythonProcess = spawn('python', args);

    pythonProcess.stdin.write(JSON.stringify(restaurants));
    pythonProcess.stdin.end();

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
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    pythonProcess.stdin.end();
  });
}
