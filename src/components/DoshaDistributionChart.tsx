import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Activity, TrendingUp, Users } from 'lucide-react';

export interface QuizCompletion {
  date: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha';
}

interface DoshaDistributionChartProps {
  history: QuizCompletion[];
}

export default function DoshaDistributionChart({ history }: DoshaDistributionChartProps) {
  const [activeTab, setActiveTab] = useState<'pie' | 'bar'>('pie');

  // Compute counts and distribution data
  const stats = useMemo(() => {
    let vataCount = 0;
    let pittaCount = 0;
    let kaphaCount = 0;

    history.forEach((h) => {
      if (h.dosha === 'Vata') vataCount++;
      else if (h.dosha === 'Pitta') pittaCount++;
      else if (h.dosha === 'Kapha') kaphaCount++;
    });

    const total = history.length || 1;

    return {
      vata: vataCount,
      pitta: pittaCount,
      kapha: kaphaCount,
      total,
      data: [
        {
          name: 'Vata',
          value: vataCount,
          percentage: Math.round((vataCount / total) * 100),
          elements: 'Air & Space',
          color: '#d97706', // Warm amber
          colorLight: '#fef3c7',
          description: 'Dry, light, erratic energy representing activity and nerve signals.'
        },
        {
          name: 'Pitta',
          value: pittaCount,
          percentage: Math.round((pittaCount / total) * 100),
          elements: 'Fire & Water',
          color: '#f43f5e', // Hot rose/red
          colorLight: '#ffe4e6',
          description: 'Hot, sharp, acidic energy representing digestion and metabolic heat.'
        },
        {
          name: 'Kapha',
          value: kaphaCount,
          percentage: Math.round((kaphaCount / total) * 100),
          elements: 'Earth & Water',
          color: '#10b981', // Moist emerald
          colorLight: '#d1fae5',
          description: 'Heavy, stable, cool energy representing cellular structure and balance.'
        }
      ]
    };
  }, [history]);

  // Render a custom label for the Pie chart slices
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.08 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-mono text-[10px] font-black"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-amber-900/10 p-3.5 rounded-lg shadow-md text-left max-w-[240px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color || payload[0].color }} />
            <span className="font-serif font-black text-sm text-stone-900 uppercase">
              {data.name}
            </span>
          </div>
          <p className="text-[10.5px] font-mono font-bold text-stone-500 mb-2 uppercase">
            {data.elements} • {data.value} Users ({data.percentage}%)
          </p>
          <p className="text-[10px] leading-relaxed text-stone-600 font-serif">
            {data.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="dosha-stats-container" className="bg-[#faf8f4]/60 rounded-xl border border-amber-900/10 p-5 space-y-4">
      
      {/* Header section with tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/5 pb-3">
        <div className="text-left">
          <div className="flex items-center gap-1.5 text-amber-900 mb-0.5">
            <Activity className="w-4 h-4" />
            <h4 className="font-serif font-black text-xs md:text-sm uppercase tracking-wide">
              Ayurvedic Constitutional Trends
            </h4>
          </div>
          <p className="text-[10px] text-stone-500 font-mono tracking-wide">
            Real-time analytics of {stats.total} total digital pulse assessments completed
          </p>
        </div>

        {/* Chart View Selection Tabs */}
        <div className="flex items-center gap-1 bg-stone-250/20 bg-stone-100 p-1 rounded-lg border border-stone-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pie')}
            className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold flex items-center gap-1 transition-all ${
              activeTab === 'pie'
                ? 'bg-amber-900 text-amber-50 shadow-3xs'
                : 'text-stone-500 hover:text-stone-850 hover:bg-stone-50'
            }`}
          >
            <PieIcon className="w-3 h-3" /> PIE CHART
          </button>
          <button
            onClick={() => setActiveTab('bar')}
            className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold flex items-center gap-1 transition-all ${
              activeTab === 'bar'
                ? 'bg-amber-900 text-amber-50 shadow-3xs'
                : 'text-stone-500 hover:text-stone-850 hover:bg-stone-50'
            }`}
          >
            <BarChart3 className="w-3 h-3" /> BAR CHART
          </button>
        </div>
      </div>

      {/* Main visualization row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Actual Chart Visual */}
        <div className="md:col-span-7 h-[180px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'pie' ? (
              <PieChart>
                <Pie
                  data={stats.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={75}
                  innerRadius={30}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart
                data={stats.data}
                margin={{ top: 15, right: 10, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#a8a29e" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#a8a29e" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(120, 53, 4, 0.04)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend / Info Panels with gorgeous colors */}
        <div className="md:col-span-5 space-y-2 text-left">
          {stats.data.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-2.5 p-2 rounded-lg border transition-all duration-200"
              style={{
                borderColor: `${item.color}15`,
                backgroundColor: `${item.color}04`
              }}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-black text-xs text-stone-900">
                    {item.name}
                  </span>
                  <span className="text-[8.5px] font-mono text-stone-400 font-bold uppercase">
                    ({item.elements})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs font-black text-stone-850" style={{ color: item.color }}>
                    {item.percentage}%
                  </span>
                  <span className="text-[9px] font-mono text-stone-400 font-semibold">
                    • {item.value} {item.value === 1 ? 'taker' : 'takers'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meta indicators at the bottom */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-[#4a3525] border-t border-amber-900/5 text-left">
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-orange-50/15 border border-amber-900/5">
          <Users className="w-3.5 h-3.5 text-amber-800 shrink-0" />
          <div>
            <p className="text-[8px] font-mono font-bold uppercase text-stone-400 leading-none">
              Most Active State
            </p>
            <p className="font-serif font-black text-[11px] text-amber-900 mt-1 leading-none">
              {stats.pitta >= stats.vata && stats.pitta >= stats.kapha ? 'PITTA' : stats.vata >= stats.kapha ? 'VATA' : 'KAPHA'} 🔥
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-orange-50/15 border border-amber-900/5">
          <TrendingUp className="w-3.5 h-3.5 text-amber-800 shrink-0" />
          <div>
            <p className="text-[8px] font-mono font-bold uppercase text-stone-400 leading-none">
              Community Health Sync
            </p>
            <p className="font-serif font-black text-[11px] text-stone-850 mt-1 leading-none">
              Tridosha Ratio Sync
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
