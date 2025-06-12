import React, { useState } from 'react';
import { Brain, Database, TrendingUp } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ProgressBar } from './components/ProgressBar';
import { ResultsTable } from './components/ResultsTable';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { parseCSV, generateSampleData } from './utils/csvParser';
import { MockRandomForestClassifier } from './utils/mlPredictor';
import { AnalysisResults, SensorData } from './types/sensor';

type AppState = 'upload' | 'processing' | 'results';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const processData = async (data: SensorData[]) => {
    setState('processing');
    setProgress(0);
    
    const startTime = Date.now();
    const classifier = new MockRandomForestClassifier();
    
    // Simulate processing steps
    const steps = [
      { message: 'Validating data format...', progress: 20 },
      { message: 'Preprocessing sensor data...', progress: 40 },
      { message: 'Loading Random Forest model...', progress: 60 },
      { message: 'Running predictions...', progress: 80 },
      { message: 'Generating analysis report...', progress: 100 }
    ];
    
    for (const step of steps) {
      setStatus(step.message);
      setProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const predictions = classifier.predict(data);
    const processingTime = Date.now() - startTime;
    
    const analysisResults: AnalysisResults = {
      totalSamples: data.length,
      failurePredictions: predictions.filter(p => p.prediction === 'failure').length,
      normalPredictions: predictions.filter(p => p.prediction === 'normal').length,
      predictions,
      processingTime
    };
    
    setResults(analysisResults);
    setState('results');
  };

  const handleFileSelect = async (file: File) => {
    try {
      const data = await parseCSV(file);
      await processData(data);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the format and try again.');
    }
  };

  const handleUseSampleData = async () => {
    const sampleData = generateSampleData();
    await processData(sampleData);
  };

  const handleReset = () => {
    setState('upload');
    setProgress(0);
    setStatus('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Predictive Maintenance</h1>
                <p className="text-sm text-gray-600">Sensor Failure Prediction System</p>
              </div>
            </div>
            
            {state === 'results' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state === 'upload' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Predict Equipment Failures Before They Happen
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your sensor data and let our AI-powered Random Forest classifier 
                analyze potential equipment failures with detailed insights and recommendations.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Processing</h3>
                <p className="text-gray-600">Advanced CSV parsing and data validation for sensor readings</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Prediction</h3>
                <p className="text-gray-600">Random Forest machine learning model for failure prediction</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Analytics</h3>
                <p className="text-gray-600">Interactive charts and detailed analysis reports</p>
              </div>
            </div>

            <FileUpload
              onFileSelect={handleFileSelect}
              onUseSampleData={handleUseSampleData}
              isProcessing={false}
            />
          </div>
        )}

        {state === 'processing' && (
          <div className="flex items-center justify-center min-h-[400px]">
            <ProgressBar progress={progress} status={status} />
          </div>
        )}

        {state === 'results' && results && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
              <p className="text-gray-600">
                Processed {results.totalSamples} samples in {results.processingTime}ms
              </p>
            </div>

            <AnalyticsCharts results={results} />
            <ResultsTable predictions={results.predictions} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;