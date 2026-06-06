/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatRupiah } from '@/lib/utils';

export interface LineChartProps {
  history: { date: string; price: number }[];
}

export function LineChart({ history }: LineChartProps) {
  const prices = history.map((h) => h.price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;

  const width = 340;
  const height = 150;
  const padding = 20;

  const points = history.map((entry, idx) => {
    const x = padding + (idx / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - ((entry.price - min) / range) * (height - padding * 2);
    return { x, y, entry };
  });

  const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="text-label-md font-bold font-jakarta text-on-surface uppercase tracking-wider">
          Tren Bulanan (30 Hari Terakhir)
        </span>
        <span className="text-body-sm font-bold text-secondary bg-secondary-fixed px-2 py-0.5 rounded">
          Rerata: {formatRupiah(Math.round(prices.reduce((a, b) => a + b, 0) / prices.length))}
        </span>
      </div>

      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible font-jakarta"
        >
          {/* Horizontal Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="var(--color-surface-container-high)"
            strokeDasharray="3"
          />
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="var(--color-surface-container-high)"
            strokeDasharray="3"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="var(--color-surface-container-high)"
            strokeDasharray="3"
          />

          {/* Sparkline gradient fill */}
          <path
            d={`${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`}
            fill="url(#chart-gradient)"
            opacity="0.1"
          />

          {/* Real Line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Price node circles */}
          {points.map((p, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill={idx === points.length - 1 ? '#b22a16' : '#082717'}
                stroke="var(--color-on-primary)"
                strokeWidth={1.5}
              />
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                className="text-[9px] font-bold fill-primary font-jakarta text-center hidden group-hover:block"
              >
                {p.entry.price / 1000}k
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, idx) => {
            if (idx % 2 !== 0 && idx !== points.length - 1) return null;
            return (
              <text
                key={idx}
                x={p.x}
                y={height - 2}
                textAnchor="middle"
                className="text-[9px] font-semibold fill-on-surface-variant font-jakarta"
              >
                {p.entry.date}
              </text>
            );
          })}

          {/* Y Axis upper/lower bounds */}
          <text
            x={padding - 15}
            y={padding + 4}
            className="text-[8px] font-bold fill-on-surface-variant font-jakarta"
          >
            {Math.round(max / 1000)}k
          </text>
          <text
            x={padding - 15}
            y={height - padding + 2}
            className="text-[8px] font-bold fill-on-surface-variant font-jakarta"
          >
            {Math.round(min / 1000)}k
          </text>

          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-surface)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
