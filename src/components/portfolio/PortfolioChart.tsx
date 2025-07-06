'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PortfolioChartProps {
  dailyPerformance: Array<{
    date: string;
    value: number;
  }>;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ dailyPerformance }) => {
  const chartData = {
    datasets: [
      {
        label: '포트폴리오 가치',
        data: dailyPerformance.map(item => ({
          x: new Date(item.date),
          y: item.value
        })),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return new Date(context[0].parsed.x).toLocaleDateString('ko-KR');
          },
          label: function(context: any) {
            return `포트폴리오 가치: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MM/dd'
          }
        },
        title: {
          display: true,
          text: '날짜',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        title: {
          display: true,
          text: '포트폴리오 가치 ($)',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        },
        beginAtZero: false
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  // Calculate performance metrics
  const firstValue = dailyPerformance[0]?.value || 0;
  const lastValue = dailyPerformance[dailyPerformance.length - 1]?.value || 0;
  const totalReturn = lastValue - firstValue;
  const totalReturnPercent = firstValue > 0 ? (totalReturn / firstValue) * 100 : 0;
  const isPositive = totalReturn >= 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">포트폴리오 성과</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              ${lastValue.toLocaleString()}
            </span>
          </div>
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">
              {isPositive ? '+' : ''}${Math.abs(totalReturn).toLocaleString()} 
              ({isPositive ? '+' : ''}{totalReturnPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PortfolioChart; 