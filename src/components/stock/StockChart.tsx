import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

interface StockChartProps {
  symbol: string;
}

const timeRanges = [
  { label: '1시간', value: '1H' },
  { label: '1일', value: '1D' },
  { label: '1주', value: '1W' },
  { label: '1달', value: '1M' }
];

function getFromTo(range: string) {
  const now = new Date();
  let from: Date;
  let to: Date = new Date(now);
  switch (range) {
    case '1H':
      from = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '1D':
      from = new Date(now);
      from.setHours(0, 0, 0, 0);
      break;
    case '1W':
      from = new Date(now);
      from.setDate(now.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      break;
    case '1M':
      from = new Date(now);
      from.setDate(now.getDate() - 30);
      from.setHours(0, 0, 0, 0);
      break;
    default:
      from = new Date(now);
  }
  // to는 항상 내일 00:00:00
  to = new Date(now);
  to.setDate(now.getDate() + 1);
  to.setHours(0, 0, 0, 0);
  return {
    from: from.toISOString().slice(0, 19),
    to: to.toISOString().slice(0, 19)
  };
}

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [selectedRange, setSelectedRange] = useState('1D');
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      const { from, to } = getFromTo(selectedRange);
      try {
        const res = await fetch(
          `http://localhost:8080/api/trades/history?from=${from}&to=${to}&symbol=${symbol}`
        );
        if (res.ok) {
          const data = await res.json();
          const prices = (data.data || []).map((item: any) => ({
            x: new Date(item.timestamp),
            y: item.price
          }));
          setChartData({
            datasets: [
              {
                label: `${symbol} Price`,
                data: prices,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.1)',
                tension: 0.2,
                pointRadius: 0
              }
            ]
          });
        } else {
          setChartData(null);
        }
      } catch (e) {
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };
    if (symbol) fetchChartData();
  }, [symbol, selectedRange]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-300 pb-2">
        <h2 className="text-xl font-bold text-black">Stock Price Chart</h2>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              className={`px-3 py-1 rounded text-sm ${selectedRange === range.value ? 'bg-blue-100 text-blue-600 font-medium' : 'text-black hover:bg-gray-100'}`}
              onClick={() => setSelectedRange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
        {loading ? (
          <span className="text-gray-400">Loading chart...</span>
        ) : chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false }
              },
              scales: {
                x: {
                  type: 'time',
                  time: { unit: selectedRange === '1H' ? 'minute' : 'day' },
                  title: { display: true, text: 'Time' }
                },
                y: {
                  title: { display: true, text: 'Price' },
                  beginAtZero: false
                }
              }
            }}
          />
        ) : (
          <span className="text-gray-400">No chart data</span>
        )}
      </div>
    </div>
  );
};

export default StockChart; 