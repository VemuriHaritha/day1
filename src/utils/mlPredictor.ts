import { SensorData, PredictionResult } from '../types/sensor';

export class MockRandomForestClassifier {
  private thresholds = {
    temperature: { min: 20, max: 80, critical: 90 },
    pressure: { min: 1, max: 10, critical: 12 },
    vibration: { min: 0, max: 5, critical: 8 },
    humidity: { min: 30, max: 70, critical: 85 },
    voltage: { min: 220, max: 240, critical: 250 },
    current: { min: 0, max: 15, critical: 20 },
    speed: { min: 1000, max: 3000, critical: 3500 },
    load: { min: 0, max: 80, critical: 95 }
  };

  predict(data: SensorData[]): PredictionResult[] {
    return data.map((sample, index) => {
      const riskFactors: string[] = [];
      let riskScore = 0;

      // Analyze each sensor parameter
      Object.entries(this.thresholds).forEach(([param, limits]) => {
        const value = sample[param];
        if (typeof value === 'number') {
          if (value > limits.critical) {
            riskScore += 0.4;
            riskFactors.push(`Critical ${param}: ${value.toFixed(2)}`);
          } else if (value > limits.max) {
            riskScore += 0.2;
            riskFactors.push(`High ${param}: ${value.toFixed(2)}`);
          } else if (value < limits.min) {
            riskScore += 0.15;
            riskFactors.push(`Low ${param}: ${value.toFixed(2)}`);
          }
        }
      });

      // Add some randomness to simulate ML uncertainty
      const randomFactor = (Math.random() - 0.5) * 0.2;
      riskScore = Math.max(0, Math.min(1, riskScore + randomFactor));

      const prediction: 'failure' | 'normal' = riskScore > 0.5 ? 'failure' : 'normal';
      const confidence = prediction === 'failure' ? riskScore : (1 - riskScore);

      return {
        id: sample.id || `sample_${index + 1}`,
        prediction,
        confidence: Math.round(confidence * 100) / 100,
        riskScore: Math.round(riskScore * 100) / 100,
        failureReasons: riskFactors,
        originalData: sample
      };
    });
  }
}