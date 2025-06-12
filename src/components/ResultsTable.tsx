import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { PredictionResult } from '../types/sensor';

interface ResultsTableProps {
  predictions: PredictionResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ predictions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'failure' | 'normal'>('all');
  const itemsPerPage = 10;

  const filteredPredictions = predictions.filter(p => 
    filter === 'all' || p.prediction === filter
  );

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPredictions = filteredPredictions.slice(startIndex, endIndex);

  const getSensorValues = (data: any) => {
    const sensors = ['temperature', 'pressure', 'vibration', 'humidity', 'voltage', 'current', 'speed', 'load'];
    return sensors
      .filter(sensor => typeof data[sensor] === 'number')
      .map(sensor => `${sensor}: ${data[sensor].toFixed(1)}`)
      .join(', ');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Prediction Results</h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({predictions.length})
            </button>
            <button
              onClick={() => setFilter('failure')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'failure'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Failures ({predictions.filter(p => p.prediction === 'failure').length})
            </button>
            <button
              onClick={() => setFilter('normal')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'normal'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Normal ({predictions.filter(p => p.prediction === 'normal').length})
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prediction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sensor Values
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Failure Reasons
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPredictions.map((prediction) => (
              <tr key={prediction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {prediction.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {prediction.prediction === 'failure' ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-red-700">Failure</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                        <span className="text-sm font-medium text-emerald-700">Normal</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {(prediction.confidence * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${
                          prediction.riskScore > 0.7
                            ? 'bg-red-500'
                            : prediction.riskScore > 0.4
                            ? 'bg-yellow-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${prediction.riskScore * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {(prediction.riskScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {getSensorValues(prediction.originalData)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {prediction.failureReasons.length > 0 ? (
                    <div className="max-w-xs">
                      {prediction.failureReasons.slice(0, 2).map((reason, idx) => (
                        <div key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded mb-1">
                          {reason}
                        </div>
                      ))}
                      {prediction.failureReasons.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{prediction.failureReasons.length - 2} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">No issues detected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPredictions.length)} of{' '}
              {filteredPredictions.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};