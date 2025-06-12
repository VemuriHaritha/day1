import React, { useCallback, useState } from 'react';
import { Upload, FileText, Download } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUseSampleData: () => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUseSampleData,
  isProcessing
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      onFileSelect(csvFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const downloadSampleCSV = () => {
    const sampleData = `id,timestamp,temperature,pressure,vibration,humidity,voltage,current,speed,load
sample_1,2024-01-15T10:30:00Z,45.2,3.4,2.1,55.8,230.5,8.2,2200,45
sample_2,2024-01-15T10:31:00Z,92.1,11.8,7.9,78.3,245.2,18.5,3400,89
sample_3,2024-01-15T10:32:00Z,38.7,2.9,1.5,42.1,225.8,6.7,1980,32
sample_4,2024-01-15T10:33:00Z,67.3,8.2,4.6,65.9,235.7,12.3,2750,67
sample_5,2024-01-15T10:34:00Z,105.4,14.2,9.8,85.7,252.1,22.1,3800,95`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_sensor_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Sensor Data
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              Choose CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                disabled={isProcessing}
              />
            </label>

            <button
              onClick={onUseSampleData}
              disabled={isProcessing}
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Use Sample Data
            </button>
          </div>

          <button
            onClick={downloadSampleCSV}
            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Download Sample CSV
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Supported format: CSV files with sensor data columns</p>
        <p className="mt-1">
          Expected columns: temperature, pressure, vibration, humidity, voltage, current, speed, load
        </p>
      </div>
    </div>
  );
};