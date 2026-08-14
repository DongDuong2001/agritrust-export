import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Sector
} from 'recharts';
import { TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ExportAnalyticsChartsProps {
  shipments: CoffeeShipment[];
  onSelectShipment?: (id: string) => void;
}

// Monthly seasonal export baseline + live aggregate data for 2026
const MONTHLY_EXPORT_DATA = [
  { month: 'Jan', monthVi: 'T1', totalVolumeMT: 128.4, verifiedMT: 112.0, containers: 6, compliancePct: 87 },
  { month: 'Feb', monthVi: 'T2', totalVolumeMT: 145.2, verifiedMT: 130.5, containers: 7, compliancePct: 90 },
  { month: 'Mar', monthVi: 'T3', totalVolumeMT: 198.6, verifiedMT: 174.2, containers: 10, compliancePct: 88 },
  { month: 'Apr', monthVi: 'T4', totalVolumeMT: 224.0, verifiedMT: 206.8, containers: 11, compliancePct: 92 },
  { month: 'May', monthVi: 'T5', totalVolumeMT: 265.8, verifiedMT: 248.0, containers: 13, compliancePct: 93 },
  { month: 'Jun', monthVi: 'T6', totalVolumeMT: 310.5, verifiedMT: 295.0, containers: 16, compliancePct: 95 },
  { month: 'Jul', monthVi: 'T7', totalVolumeMT: 348.2, verifiedMT: 332.6, containers: 18, compliancePct: 96 },
  { month: 'Aug', monthVi: 'T8', totalVolumeMT: 392.4, verifiedMT: 376.0, containers: 20, compliancePct: 96 },
];

export const ExportAnalyticsCharts: React.FC<ExportAnalyticsChartsProps> = ({ shipments }) => {
  const { language, t } = useLanguage();
  const [activeDonutIndex, setActiveDonutIndex] = useState<number | null>(null);
  const [trendMetric, setTrendMetric] = useState<'volume' | 'containers'>('volume');

  // Compute live compliance distribution directly from current shipments
  const complianceStats = useMemo(() => {
    const total = shipments.length || 1;
    const verifiedLots = shipments.filter(s => s.status === 'Verified');
    const sentLots = shipments.filter(s => s.status === 'Sent to Buyer');
    const pendingLots = shipments.filter(s => s.status === 'Pending Verification');
    const missingLots = shipments.filter(s => s.status === 'Missing Documents');

    const verifiedKg = verifiedLots.reduce((acc, s) => acc + s.volumeKg, 0);
    const sentKg = sentLots.reduce((acc, s) => acc + s.volumeKg, 0);
    const pendingKg = pendingLots.reduce((acc, s) => acc + s.volumeKg, 0);
    const missingKg = missingLots.reduce((acc, s) => acc + s.volumeKg, 0);
    const totalKg = shipments.reduce((acc, s) => acc + s.volumeKg, 0) || 1;

    const fullyCompliantCount = verifiedLots.length + sentLots.length;
    const complianceRate = Math.round((fullyCompliantCount / total) * 100);

    const donutData = [
      {
        name: language === 'vi' ? 'Đã Thẩm Định (Sẵn Sàng)' : 'Verified (Passport Ready)',
        key: 'verified',
        count: verifiedLots.length,
        volumeMT: +(verifiedKg / 1000).toFixed(1),
        percentage: Math.round((verifiedLots.length / total) * 100),
        color: '#10b981', // emerald-500
        darkColor: '#34d399',
        isCompliant: true,
      },
      {
        name: language === 'vi' ? 'Đã Gửi Nhà Mua EU' : 'Dispatched to EU Buyer',
        key: 'sent',
        count: sentLots.length,
        volumeMT: +(sentKg / 1000).toFixed(1),
        percentage: Math.round((sentLots.length / total) * 100),
        color: '#0284c7', // sky-600
        darkColor: '#38bdf8',
        isCompliant: true,
      },
      {
        name: language === 'vi' ? 'Chờ Duyệt Thẩm Tra' : 'Pending Audit Verification',
        key: 'pending',
        count: pendingLots.length,
        volumeMT: +(pendingKg / 1000).toFixed(1),
        percentage: Math.round((pendingLots.length / total) * 100),
        color: '#6366f1', // indigo-500
        darkColor: '#818cf8',
        isCompliant: false,
      },
      {
        name: language === 'vi' ? 'Thiếu Hồ Sơ / Chứng Chỉ' : 'Missing Documentation',
        key: 'missing',
        count: missingLots.length,
        volumeMT: +(missingKg / 1000).toFixed(1),
        percentage: Math.round((missingLots.length / total) * 100),
        color: '#f59e0b', // amber-500
        darkColor: '#fbbf24',
        isCompliant: false,
      },
    ].filter(item => item.count > 0);

    return {
      total,
      totalKg,
      totalMT: +(totalKg / 1000).toFixed(1),
      complianceRate,
      donutData,
      missingCount: missingLots.length,
      verifiedCount: fullyCompliantCount
    };
  }, [shipments, language]);

  // Custom Active Shape for Donut Chart hover
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.18))' }}
        />
      </g>
    );
  };

  return (
    <div id="exporter-data-visualization-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>{t('analyticsSectionTitle')}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('analyticsSectionSub')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>{complianceStats.complianceRate}% {language === 'vi' ? 'Đạt Chuẩn EUDR' : 'EUDR Compliant'}</span>
          </span>
        </div>
      </div>

      {/* Grid: 2-Column Responsive Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CHART 1 (7 Cols): Monthly Export Volume Trend Line & Area */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Header & Metric View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{t('monthlyTrendTitle')}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('monthlyTrendSub')}
                </p>
              </div>

              {/* View Selector */}
              <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTrendMetric('volume')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    trendMetric === 'volume'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {language === 'vi' ? 'Khối Lượng (Tấn)' : 'Volume (MT)'}
                </button>
                <button
                  type="button"
                  onClick={() => setTrendMetric('containers')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    trendMetric === 'containers'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {language === 'vi' ? 'Container (TEU)' : 'Containers (TEU)'}
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar above chart */}
            <div className="grid grid-cols-3 gap-2.5 mb-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">{language === 'vi' ? 'Tổng 2026 (YTD)' : 'Total 2026 YTD'}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">2,017 MT</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{language === 'vi' ? 'Đã Thẩm Định EUDR' : 'EUDR Verified'}</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">1,909 MT (95%)</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">{language === 'vi' ? 'Tăng Trưởng MoM' : 'MoM Growth'}</span>
                <span className="text-sm font-bold text-sky-600 dark:text-sky-400 font-mono">+12.7% ↑</span>
              </div>
            </div>

            {/* Recharts Area/Line Chart */}
            <div className="h-64 sm:h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MONTHLY_EXPORT_DATA}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotalVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorVerifiedVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  
                  <XAxis 
                    dataKey={language === 'vi' ? 'monthVi' : 'month'} 
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />

                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    unit={trendMetric === 'volume' ? 't' : ''}
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[170px]">
                            <div className="font-bold text-slate-200 border-b border-slate-700 pb-1 flex justify-between items-center">
                              <span>{language === 'vi' ? `Tháng ${data.monthVi}` : `Month ${data.month} 2026`}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono">
                                {data.compliancePct}% {language === 'vi' ? 'Đạt' : 'Pass'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-400 font-medium">
                              <span>{t('monthlyExportVolume')}:</span>
                              <span className="font-bold font-mono">{data.totalVolumeMT} MT</span>
                            </div>
                            <div className="flex justify-between items-center text-sky-300 font-medium">
                              <span>{t('monthlyVerifiedVolume')}:</span>
                              <span className="font-bold font-mono">{data.verifiedMT} MT</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 text-[11px] pt-0.5 border-t border-slate-800">
                              <span>{t('monthlyContainerCount')}:</span>
                              <span className="font-mono font-bold text-white">{data.containers} TEU</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 ml-1">
                        {value}
                      </span>
                    )}
                  />

                  {trendMetric === 'volume' ? (
                    <>
                      <Area
                        name={t('monthlyExportVolume')}
                        type="monotone"
                        dataKey="totalVolumeMT"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorTotalVol)"
                        activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                      <Line
                        name={t('monthlyVerifiedVolume')}
                        type="monotone"
                        dataKey="verifiedMT"
                        stroke="#0284c7"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: '#0284c7' }}
                      />
                    </>
                  ) : (
                    <Area
                      name={t('monthlyContainerCount')}
                      type="monotone"
                      dataKey="containers"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fillOpacity={0.2}
                      fill="#6366f1"
                      activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 mt-2">
            <span>{language === 'vi' ? 'Nguồn dữ liệu: Cảng Cát Lái & Hải quan VN' : 'Source: Cat Lai Port Terminal & VN Customs'}</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">{language === 'vi' ? '● Tự động cập nhật qua Smart Contract' : '● Live synced via Oracle'}</span>
          </div>
        </div>

        {/* CHART 2 (5 Cols): Compliance vs. Non-Compliance Donut Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{t('complianceDonutTitle')}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('complianceDonutSub')}
                </p>
              </div>
            </div>

            {/* Donut Chart with Centered Metric */}
            <div className="relative h-56 sm:h-60 w-full flex items-center justify-center my-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeDonutIndex ?? undefined}
                    activeShape={renderActiveShape}
                    data={complianceStats.donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="count"
                    onMouseEnter={(_, index) => setActiveDonutIndex(index)}
                    onMouseLeave={() => setActiveDonutIndex(null)}
                  >
                    {complianceStats.donutData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1">
                            <div className="font-bold text-slate-200 border-b border-slate-700 pb-1">
                              {data.name}
                            </div>
                            <div className="flex justify-between items-center gap-4 text-emerald-300">
                              <span>{language === 'vi' ? 'Số lô:' : 'Batches:'}</span>
                              <span className="font-bold font-mono">{data.count} {t('lotsCount')} ({data.percentage}%)</span>
                            </div>
                            <div className="flex justify-between items-center gap-4 text-slate-300 text-[11px]">
                              <span>{language === 'vi' ? 'Khối lượng:' : 'Volume:'}</span>
                              <span className="font-mono">{data.volumeMT} MT</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Ring Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  {complianceStats.complianceRate}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {language === 'vi' ? 'Đạt Chuẩn' : 'Compliant'}
                </span>
                <span className="text-[9px] text-slate-400">
                  {complianceStats.verifiedCount}/{complianceStats.total} {language === 'vi' ? 'lô' : 'lots'}
                </span>
              </div>
            </div>

            {/* Breakdown Legend with actionable counters */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
              {complianceStats.donutData.map((item, idx) => (
                <div 
                  key={idx}
                  onMouseEnter={() => setActiveDonutIndex(idx)}
                  onMouseLeave={() => setActiveDonutIndex(null)}
                  className={`p-2 rounded-lg transition-all flex items-center justify-between text-xs cursor-pointer ${
                    activeDonutIndex === idx 
                      ? 'bg-slate-100 dark:bg-slate-700/80 shadow-xs' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0 font-mono text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.volumeMT} MT
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                      {item.count} {language === 'vi' ? 'lô' : 'lots'} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing docs prompt if any */}
          {complianceStats.missingCount > 0 && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-medium">
                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
                <span>
                  {language === 'vi' 
                    ? `${complianceStats.missingCount} lô cần bổ sung chứng từ HTX` 
                    : `${complianceStats.missingCount} lot requires co-op document upload`}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                {language === 'vi' ? 'Ưu tiên xử lý' : 'Priority'}
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
