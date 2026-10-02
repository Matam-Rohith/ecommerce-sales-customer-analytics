import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface RevenueChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string | string[];
      fill?: boolean;
      tension?: number;
      borderRadius?: number;
      type?: 'line' | 'bar';
    }>;
  };
  type?: 'line' | 'bar';
  height?: number;
  formatAsLakhs?: boolean;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  type = 'line',
  height = 280,
  formatAsLakhs = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  const formatINR = (val: number) => {
    if (formatAsLakhs) {
      return '₹' + (val / 100000).toFixed(2) + 'L';
    }
    return '₹' + Math.round(val).toLocaleString();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new ChartJS(ctx, {
      type: type,
      data: data as any,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#cbd5e1',
              font: { size: 11, weight: 'bold' },
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#94a3b8',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            callbacks: {
              label: (ctx) => {
                const label = ctx.dataset.label || '';
                const val = ctx.raw as number;
                return ` ${label}: ${formatINR(val)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(51, 65, 85, 0.4)'
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 10 }
            }
          },
          y: {
            grid: {
              color: 'rgba(51, 65, 85, 0.4)'
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 10 },
              callback: (value) => formatINR(value as number)
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, formatAsLakhs]);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
