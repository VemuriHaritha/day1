import Papa from 'papaparse';
import { SensorData } from '../types/sensor';

export const parseCSV = (file: File): Promise<SensorData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const data = results.data.map((row: any, index: number) => ({
            id: row.id || `sample_${index + 1}`,
            ...row
          })) as SensorData[];
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse CSV data'));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

export const generateSampleData = (): SensorData[] => {
  const samples: SensorData[] = [];
  
  for (let i = 1; i <= 100; i++) {
    samples.push({
      id: `sample_${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      temperature: Math.random() * 100 + 20,
      pressure: Math.random() * 15 + 1,
      vibration: Math.random() * 10,
      humidity: Math.random() * 60 + 20,
      voltage: Math.random() * 40 + 210,
      current: Math.random() * 25,
      speed: Math.random() * 3000 + 1000,
      load: Math.random() * 100
    });
  }
  
  return samples;
};