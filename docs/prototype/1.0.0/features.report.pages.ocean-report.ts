import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  Wallet,
  PieChart,
  ArrowRight,
  ChevronLeft,
  Filter,
  TrendingUp,
  LayoutGrid,
  User,
  FlaskConical,
  Waves,
  Trophy,
  History,
  CalendarDays,
  Target,
  ArrowUpRight,
  Coins,
  Medal,
  X
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('income'); // income: 收益, duration: 时长
  const [timeRange, setTimeRange] = useState('week'); // day, week, month, year
  
  // 编辑相关状态
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editH, setEditH] = useState(0);
  const [editM, setEditM] = useState(0);
  const [editS, setEditS] = useState(0);

  // 模拟数据：生成本月 30 天的数据
  const dailyData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      amount: Math.floor(Math.random() * 80) + 20,
      hours: (Math.random() * 4 + 1).toFixed(1),
    }));
  }, []);

  // 计算最大值用于比例缩放
  const maxValues = useMemo(() => {
    return {
      income: Math.max(...dailyData.map(d => d.amount)) || 100,
      duration: Math.max(...dailyData.map(d => parseFloat(d.hours))) || 8
    };
  }, [dailyData]);

  // 计算汇总数据
  const totalIncome = dailyData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalHours = dailyData.reduce((acc, curr) => acc + parseFloat(curr.hours), 0).toFixed(1);

  // 7日明细状态化
  const [historyDetails, setHistoryDetails] = useState([
    { date: '09-18', duration: '02:15:20', income: 42.5 },
    { date: '09-17', duration: '01:45:10', income: 33.2 },
    { date: '09-16', duration: '03:10:00', income: 58.8 },
    { date: '09-15', duration: '00:55:30', income: 15.4 },
    { date: '09-14', duration: '02:30:15', income: 48.0 },
  ]);

  const statsMapping = {
    day: { work: 75, moyu: 25 },
    week: { work: 68, moyu: 32 },
    month: { work: 60, moyu: 40 },
    year: { work: 82, moyu: 18 },
  };

  const currentStats = statsMapping[timeRange];

  const handleEditClick = (idx) => {
    const [h, m, s] = historyDetails[idx].duration.split(':').map(Number);
    setEditingIdx(idx);
    setEditH(h);
    setEditM(m);
    setEditS(s);
    setIsEditModalOpen(true);
  };

  const handleSaveTime = () => {
    const newHistory = [...historyDetails];
    const formattedTime = `${editH.toString().padStart(2, '0')}:${editM.toString().padStart(2, '0')}:${editS.toString().padStart(2, '0')}`;
    newHistory[editingIdx].duration = formattedTime;
    setHistoryDetails(newHistory);
    setIsEditModalOpen(false);
  };

  // 格式化日期为中文
  const formatChineseDate = (dateStr) => {
    const [month, day] = dateStr.split('-');
    return `${parseInt(month)}月${parseInt(day)}日`;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative">
      
      {/* Header */}
      <header className="pt-12 px-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-100">
              <BarChart3 size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">洋流战报</h1>
          </div>
          <button className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
             <Filter size={16} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-32">
        
        {/* Section 1: 趋势图表 */}
        <section className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800">收益趋势</h3>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3.5">9月·每日航行概览</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('income')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'income' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                收益
              </button>
              <button 
                onClick={() => setActiveTab('duration')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'duration' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400'}`}
              >
                时长
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm">
            <div className="relative h-44 mt-4 overflow-x-auto no-scrollbar">
              <div className="flex items-end gap-2 px-1 min-w-max h-32">
                {dailyData.map((item, idx) => {
                  const val = activeTab === 'income' ? item.amount : parseFloat(item.hours);
                  const max = activeTab === 'income' ? maxValues.income : maxValues.duration;
                  const heightPercent = Math.max((val / max) * 100, 10);
                  const isIndigo = activeTab === 'income';

                  return (
                    <div key={idx} className="w-4 flex flex-col items-center gap-2 group flex-shrink-0 h-full justify-end">
                      <div className="relative w-full h-full flex flex-col justify-end">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-bold pointer-events-none">
                          {isIndigo ? `¥${item.amount}` : `${item.hours}h`}
                        </div>
                        <div className={`absolute inset-0 ${isIndigo ? 'bg-indigo-50' : 'bg-amber-50'} rounded-full w-full opacity-40 group-hover:opacity-80 transition-opacity`}></div>
                        <div 
                          className={`relative w-full ${isIndigo ? 'bg-indigo-500 shadow-[0_4px_12px_rgba(99,102,241,0.3)]' : 'bg-amber-500 shadow-[0_4px_12px_rgba(245,158,11,0.3)]'} rounded-full transition-all duration-700 ease-out`}
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-[8px] font-bold text-slate-300 group-hover:text-slate-600 tabular-nums">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">本月总计</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-black tabular-nums ${activeTab === 'income' ? 'text-indigo-600' : 'text-amber-600'}`}>
                      {activeTab === 'income' ? `¥${totalIncome.toLocaleString()}` : `${totalHours}h`}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {activeTab === 'income' ? 'RMB' : 'Hours'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                <TrendingUp size={12} className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-600">+12.5%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 年度航行成就 */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-amber-500 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800">年度航行成就</h3>
            </div>
            <ArrowUpRight size={16} className="text-slate-300" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-indigo-100 transition-all hover:-translate-y-1">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3">
                <Coins size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">年度摸鱼收入</p>
              <h4 className="text-lg font-black text-slate-900 mt-1 tracking-tight">¥12,480.50</h4>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-amber-100 transition-all hover:-translate-y-1">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3">
                <CalendarDays size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">摸鱼打卡天数</p>
              <h4 className="text-lg font-black text-slate-900 mt-1 tracking-tight">248 天</h4>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-blue-100 transition-all hover:-translate-y-1">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3">
                <TrendingUp size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">月均摸鱼收益</p>
              <h4 className="text-lg font-black text-slate-900 mt-1 tracking-tight">¥1,040.00</h4>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm group hover:border-rose-100 transition-all hover:-translate-y-1">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl w-fit mb-3">
                <Trophy size={16} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">击败全国社畜</p>
              <h4 className="text-lg font-black text-slate-900 mt-1 tracking-tight text-rose-600">98.5%</h4>
            </div>
          </div>
        </section>

        {/* Section 3: 时长占比统计 */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800">时长占比统计</h3>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['day', 'week', 'month', 'year'].map((r) => (
                <button 
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${timeRange === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  {r === 'day' ? '日' : r === 'week' ? '周' : r === 'month' ? '月' : '年'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-around gap-8">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56" cy="56" r="48"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-50"
                />
                <circle
                  cx="56" cy="56" r="48"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${(currentStats.moyu / 100) * 301.59} 301.59`}
                  className="text-blue-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 tracking-tighter">{currentStats.moyu}%</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase">摸鱼占比</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-slate-400">工作时间</span>
                  <span className="text-slate-900">{currentStats.work}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-200 transition-all duration-500" style={{ width: `${currentStats.work}%` }}></div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-blue-400">摸鱼时间</span>
                  <span className="text-blue-600">{currentStats.moyu}%</span>
                </div>
                <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${currentStats.moyu}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: 近7日摸鱼明细 - 已按要求调整 */}
        <section className="space-y-4 pb-12">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-slate-900 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800">近7日摸鱼明细</h3>
            </div>
          </div>

          <div className="space-y-3">
            {historyDetails.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleEditClick(idx)}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-100 transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* 改为中文日期标识 */}
                  <div className="min-w-[70px]">
                    <span className="text-sm font-black text-slate-800">{formatChineseDate(item.date)}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-100"></div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={10} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-800 tabular-nums">{item.duration}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium">点击修正时长</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="text-sm font-black text-emerald-600 tabular-nums">+¥{item.income.toFixed(1)}</span>
                    <p className="text-[9px] text-slate-300 mt-0.5 font-bold uppercase leading-none text-right">Income</p>
                  </div>
                  <ChevronLeft size={14} className="text-slate-200 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative w-full bg-white rounded-t-[2rem] sm:rounded-[1.5rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 border border-slate-200">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">修正摸鱼时长</h3>
                <p className="text-xs text-slate-500 mt-1">手动校准今日摸鱼港停留的时间</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <input 
                    type="number" 
                    value={editH.toString().padStart(2, '0')}
                    onChange={(e) => setEditH(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16 h-16 text-3xl font-black text-center bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all tabular-nums"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">时</span>
                </div>
                <span className="text-2xl font-black text-slate-300 mb-6">:</span>
                <div className="flex flex-col items-center gap-2">
                  <input 
                    type="number" 
                    value={editM.toString().padStart(2, '0')}
                    onChange={(e) => setEditM(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16 h-16 text-3xl font-black text-center bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all tabular-nums"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">分</span>
                </div>
                <span className="text-2xl font-black text-slate-300 mb-6">:</span>
                <div className="flex flex-col items-center gap-2">
                  <input 
                    type="number" 
                    value={editS.toString().padStart(2, '0')}
                    onChange={(e) => setEditS(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16 h-16 text-3xl font-black text-center bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all tabular-nums"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">秒</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveTime}
                  className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                  确认保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-10 z-20 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center px-2">
          <NavItem icon={<LayoutGrid size={22} />} label="领潮中心" />
          <NavItem icon={<BarChart3 size={22} />} label="洋流战报" active />
          <NavItem icon={<FlaskConical size={22} />} label="动力室" />
          <NavItem icon={<User size={22} />} label="个人基地" />
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? '' : 'opacity-40 hover:opacity-100'}`}>
    <div className={`${active ? 'text-indigo-600 scale-110' : 'text-slate-900'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${active ? 'text-indigo-600' : 'text-slate-900'}`}>{label}</span>
  </button>
);

export default App;