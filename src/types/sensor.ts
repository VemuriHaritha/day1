export interface SensorData {
  id: string;
  timestamp?: string;
  temperature?: number;
  pressure?: number;
  vibration?: number;
  humidity?: number;
  voltage?: number;
  current?: number;
  speed?: number;
  load?: number;
  [key: string]: any;
}

export interface PredictionResult {
  id: string;
  prediction: 'failure' | 'normal';
  confidence: number;
  riskScore: number;
  failureReasons: string[];
  originalData: SensorData;
}

export interface AnalysisResults {
  totalSamples: number;
  failurePredictions: number;
  normalPredictions: number;
  predictions: PredictionResult[];
  processingTime: number;
}