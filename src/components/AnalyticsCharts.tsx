import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisResults } from '../types/sensor';

interface AnalyticsChartsProps {
  results: AnalysisResults;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ results }) => {
  const pieData = [
    { name: 'Normal', value: results.normalPredictions, color: '#10B981' },
    { name: 'Failure', value: results.failurePredictions, color: '#EF4444' }
  ];

  // Analyze failure reasons
  const failureReasons: Record<string, number> = {};
  results.predictions
    .filter(p => p.prediction === 'failure')
    .forEach(p => {
      p.failureReasons.forEach(reason => {
        const key = reason.split(':')[0].replace('Critical ', '').replace('High ', '').replace('Low ', '');
        failureReasons[key] = (failureReasons[key] || 0) + 1;
      });
    });

  const barData = Object.entries(failureReasons)
    .map(([reason, count]) => ({
      reason: reason.charAt(0).toUpperCase() + reason.slice(1),
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Analysis Summary</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{results.totalSamples}</div>
            <div className="text-sm text-gray-600">Total Samples</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{results.failurePredictions}</div>
            <div className="text-sm text-gray-600">Predicted Failures</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">
              {((results.normalPredictions / results.totalSamples) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Normal Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{results.processingTime}ms</div>
            <div className="text-sm text-gray-600">Processing Time</div>
          </div>
        </div>
      </div>

      {/* Failure Distribution Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Failure Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Failure Reasons Bar Chart */}
      {barData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Failure Factors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reason" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#EF4444" name="Failure Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};