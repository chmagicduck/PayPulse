import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Timer, 
  Wallet, 
  Calendar, 
  BarChart3, 
  FlaskConical, 
  User,
  CheckCircle2,
  Clock,
  LayoutGrid,
  TrendingUp,
  Waves,
  Ship,
  Anchor,
  Compass,
  Briefcase,
  Star,
  ChevronRight,
  Plus,
  Minus,
  LogOut,
  Eye,
  EyeOff,
  Trophy,
  Settings2,
  Gift,
  Heart,
  X,
  Sparkles,
  MousePointer2,
  Activity,
  History,
  Sunset,
  ListTodo,
  Shell,
  Wind,
  Ghost,
  Zap,
  Crown
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMoYu, setIsMoYu] = useState(false);
  const [moYuSeconds, setMoYuSeconds] = useState(0);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [showAmount, setShowAmount] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // 等级轮播状态
  const [currentRankIndex, setCurrentRankIndex] = useState(0);
  
  // 弹窗编辑状态
  const [editH, setEditH] = useState(0);
  const [editM, setEditM] = useState(0);
  const [editS, setEditS] = useState(0);
  
  const monthlySalary = 15000;
  const workDaysPerMonth = 22;
  const dailyWorkHours = 8;
  const offWorkTime = "18:30:00";
  const startWorkTime = "09:30:00";

  const hourlyRate = monthlySalary / workDaysPerMonth / dailyWorkHours;
  const secondRate = hourlyRate / 3600;

  // 10大等级定义
  const RANKS = [
    { level: 1, name: "海滩漫步者", icon: <Shell size={12} />, color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200", badge: "bg-slate-500/10" },
    { level: 2, name: "浅滩摸鱼手", icon: <Waves size={12} />, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100", badge: "bg-cyan-600/10" },
    { level: 3, name: "茶歇守卫官", icon: <Coffee size={12} />, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", badge: "bg-orange-600/10" },
    { level: 4, name: "划水见习生", icon: <Wind size={12} />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", badge: "bg-emerald-600/10" },
    { level: 5, name: "资深舵手", icon: <Compass size={12} />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", badge: "bg-blue-600/10" },
    { level: 6, name: "隐身巡航员", icon: <Ghost size={12} />, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", badge: "bg-indigo-600/10" },
    { level: 7, name: "风暴避难者", icon: <Anchor size={12} />, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", badge: "bg-violet-600/10" },
    { level: 8, name: "极速快艇王", icon: <Zap size={12} />, color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-700/10" },
    { level: 9, name: "深海霸主", icon: <Ship size={12} />, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", badge: "bg-rose-600/10" },
    { level: 10, name: "深海大懒兽", icon: <Crown size={12} />, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-700/10" },
  ];

  // 潮汐任务数据
  const tideTasks = {
    total: 6,
    completed: 2
  };

  // 重要日子数据
  const importantDates = [
    { id: 1, title: "结婚纪念日", date: "10月20日", icon: <Heart size={16} />, color: "text-rose-500", bgColor: "bg-rose-50", remaining: 28, tag: "Romantic" },
    { id: 2, title: "我的生日", date: "12月05日", icon: <Gift size={16} />, color: "text-amber-500", bgColor: "bg-amber-50", remaining: 74, tag: "Birthday" },
    { id: 3, title: "Q3 季度奖金", date: "09月30日", icon: <Star size={16} />, color: "text-blue-500", bgColor: "bg-blue-50", remaining: 8, tag: "Bonus" }
  ];

  // 主计时器
  useEffect(() => {
    let interval;
    if (isMoYu) {
      interval = setInterval(() => setMoYuSeconds(s => s + 1), 1000);
    } else {
      interval = setInterval(() => setWorkSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isMoYu]);

  // 等级自动切换效果（2s轮流变化以体现原型）
  useEffect(() => {
    const rankTimer = setInterval(() => {
      setCurrentRankIndex(prev => (prev + 1) % RANKS.length);
    }, 2000);
    return () => clearInterval(rankTimer);
  }, []);

  const openEditModal = (e) => {
    e.stopPropagation();
    const h = Math.floor(moYuSeconds / 3600);
    const m = Math.floor((moYuSeconds % 3600) / 60);
    const s = moYuSeconds % 60;
    setEditH(h);
    setEditM(m);
    setEditS(s);
    setIsEditModalOpen(true);
  };

  const handleSaveTime = () => {
    const total = (editH * 3600) + (editM * 60) + editS;
    setMoYuSeconds(total);
    setIsEditModalOpen(false);
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatMoney = (amount) => {
    if (!showAmount) return "***";
    return `¥${amount.toFixed(3)}`;
  };

  const todayEarned = (workSeconds + moYuSeconds) * secondRate;
  const moYuEarned = moYuSeconds * secondRate;
  const monthlyEarned = (hourlyRate * dailyWorkHours * 10) + todayEarned;

  const totalSeconds = workSeconds + moYuSeconds || 1;
  const workPercent = Math.round((workSeconds / totalSeconds) * 100);
  const moYuPercent = 100 - workPercent;

  const [timeLeft, setTimeLeft] = useState({ text: "", percent: 0 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      const start = new Date();
      
      const [h, m, s] = offWorkTime.split(':');
      const [sh, sm, ss] = startWorkTime.split(':');
      
      target.setHours(parseInt(h), parseInt(m), parseInt(s));
      start.setHours(parseInt(sh), parseInt(sm), parseInt(ss));
      
      const totalWorkDuration = target - start;
      const currentPassed = now - start;
      const diff = target - now;
      
      let progress = Math.min(100, Math.max(0, (currentPassed / totalWorkDuration) * 100));

      if (diff <= 0) {
        setTimeLeft({ text: "已离港", percent: 100 });
      } else {
        const hh = Math.floor(diff / 1000 / 60 / 60);
        const mm = Math.floor((diff / 1000 / 60) % 60);
        const ss = Math.floor((diff / 1000) % 60);
        const timeStr = `${hh}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
        setTimeLeft({ text: timeStr, percent: progress });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentRank = RANKS[currentRankIndex];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      {/* 修正弹窗 */}
      {isEditModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative w-full bg-white rounded-t-[2rem] sm:rounded-[1.5rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 border border-slate-200">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">修正避风时长</h3>
                <p className="text-xs text-slate-500 mt-1">手动校准今日避风港停留的时间</p>
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
                    className="w-16 h-16 text-3xl font-black text-center bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all tabular-nums"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">时</span>
                </div>
                <span className="text-2xl font-black text-slate-300 mb-6">:</span>
                <div className="flex flex-col items-center gap-2">
                  <input 
                    type="number" 
                    value={editM.toString().padStart(2, '0')}
                    onChange={(e) => setEditM(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16 h-16 text-3xl font-black text-center bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all tabular-nums"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">分</span>
                </div>
                <span className="text-2xl font-black text-slate-300 mb-6">:</span>
                <div className="flex flex-col items-center gap-2">
                  <input 
                    type="number" 
                    value={editS.toString().padStart(2, '0')}
                    onChange={(e) => setEditS(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16 h-16 text-3xl font-black text-center bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all tabular-nums"
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

      {/* Header */}
      <header className="pt-12 px-6 pb-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
               <Waves size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">薪潮涌动</h1>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-tighter text-nowrap">实时监测中</p>
             </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium tracking-tight text-opacity-80">此刻，金钱正如潮水般涌来</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32">
        
        {/* Section 1: Money Stats */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-blue-600 p-6 shadow-xl shadow-blue-100">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-blue-100 opacity-90">今日累计摸鱼收益</h3>
                <button onClick={() => setShowAmount(!showAmount)} className="p-1 text-blue-200 hover:text-white transition-colors">
                  {showAmount ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              {/* 等级展示：图标 -> LV.级数 -> 名称 */}
              <div className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border shadow-sm transition-all duration-500 transform ${currentRank.bg} ${currentRank.border}`}>
                 <span className={currentRank.color}>{currentRank.icon}</span>
                 <div className={`flex items-center justify-center px-1.5 py-0.5 rounded-full ${currentRank.badge}`}>
                   <span className={`text-[9px] font-black italic tracking-tighter ${currentRank.color}`}>LV.{currentRank.level}</span>
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-tighter ${currentRank.color}`}>
                   {currentRank.name}
                 </span>
              </div>
            </div>

            <div>
              <div className="text-4xl font-black tracking-tighter text-white tabular-nums">
                {formatMoney(todayEarned)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                 <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold text-white uppercase tracking-wider">自动结算</span>
                 <p className="text-xs text-blue-100 opacity-80 tabular-nums font-medium">当前航速 {secondRate.toFixed(3)}/s</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex shrink-0 gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-tight whitespace-nowrap">专注 {workPercent}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                  <span className="text-[10px] font-black text-blue-200 uppercase tracking-tight whitespace-nowrap">避风 {moYuPercent}%</span>
                </div>
              </div>
              <div className="h-1.5 flex-1 bg-white/10 rounded-full flex overflow-hidden border border-white/5 shadow-inner">
                <div className="h-full bg-white transition-all duration-700 ease-out" style={{ width: `${workPercent}%` }}></div>
                <div className="h-full bg-blue-400/40 transition-all duration-700 ease-out" style={{ width: `${moYuPercent}%` }}></div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
               <div className="border-r border-white/10">
                 <div className="flex items-center gap-1 mb-1">
                   <Coffee size={10} className="text-blue-200" />
                   <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest">今日入账</p>
                 </div>
                 <p className="text-xl font-bold tracking-tight text-white tabular-nums leading-none mt-1">{formatMoney(moYuEarned)}</p>
               </div>
               <div className="pl-2">
                 <div className="flex items-center gap-1 mb-1">
                   <Briefcase size={10} className="text-blue-200" />
                   <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest">本月已赚</p>
                 </div>
                 <p className="text-xl font-bold tracking-tight text-white tabular-nums leading-none mt-1">{formatMoney(monthlyEarned)}</p>
               </div>
            </div>
          </div>
        </section>

        {/* Section 2: Controls */}
        <section className="grid grid-cols-2 gap-4">
          <div className="group bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex items-center gap-3 transition-colors select-none relative overflow-hidden">
             <div className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-500 transition-colors">
               <LogOut size={18} />
             </div>
             <div className="min-w-0 flex-1">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1.5">离岗倒计时</p>
               <h4 className="text-lg font-black tracking-tighter tabular-nums text-slate-800 leading-none flex items-center gap-0.5">
                 {timeLeft.text.split(':').map((part, i, arr) => (
                   <React.Fragment key={i}>
                     <span>{part}</span>
                     {i < arr.length - 1 && (
                       <span className="animate-pulse text-slate-300 mx-px opacity-70">:</span>
                     )}
                   </React.Fragment>
                 ))}
               </h4>
               <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-50 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500/30 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(59,130,246,0.3)]" 
                    style={{ width: `${timeLeft.percent}%` }}
                  ></div>
               </div>
             </div>
          </div>

          <div 
            onClick={() => setIsMoYu(!isMoYu)} 
            className={`
              group border p-4 rounded-3xl transition-all duration-300 flex items-center justify-between cursor-pointer relative active:scale-95 select-none
              ${isMoYu 
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' 
                : 'bg-white border-blue-200/50 shadow-[0_8px_16px_-4px_rgba(59,130,246,0.1)] hover:border-blue-400 hover:shadow-lg hover:shadow-blue-50'
              }
            `}
          >
             {!isMoYu && (
               <div className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
               </div>
             )}

             <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isMoYu ? 'bg-white/20' : 'bg-blue-600 text-white shadow-md shadow-blue-100 group-hover:scale-110'}`}>
                  <Coffee size={18} className={isMoYu ? 'animate-bounce' : ''} />
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-tighter leading-none mb-1.5 ${isMoYu ? 'text-blue-100' : 'text-blue-600'}`}>
                    {isMoYu ? '避风中' : '点击避风'}
                  </p>
                  <h4 className="text-lg font-black tracking-tighter tabular-nums leading-none">
                    {formatTime(moYuSeconds)}
                  </h4>
                </div>
             </div>
             
             <button 
                onClick={openEditModal} 
                className={`ml-1 p-2 rounded-xl transition-all ${isMoYu ? 'hover:bg-white/20 text-white/60' : 'hover:bg-slate-50 text-slate-300 hover:text-blue-600'}`}
              >
                <Settings2 size={16} />
             </button>
          </div>
        </section>

        {/* Section 3: Tide Tasks */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">潮汐任务</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">今日航行目标</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                     <ListTodo size={16} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-800">航道任务清理</p>
                     <p className="text-[10px] text-slate-400">奖励: 效率加成 & 心理慰藉 & 100成长值</p>
                   </div>
                </div>
                <div className="text-right">
                   <div className="flex items-baseline gap-1">
                     <span className="text-lg font-black text-slate-900">{tideTasks.completed}</span>
                     <span className="text-[10px] font-bold text-slate-300">/ {tideTasks.total}</span>
                   </div>
                </div>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(tideTasks.completed / tideTasks.total) * 100}%` }}
                ></div>
             </div>
          </div>
        </section>

        {/* Section 4: Regular Tides */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-2">
               <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
               <h3 className="text-sm font-black text-slate-800 tracking-tight">常规波动</h3>
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">周期性观测</span>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="group relative p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden hover:border-blue-200 hover:shadow-md transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Wallet size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">发薪大潮</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">12</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Days</span>
                  </div>
                  <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.02] rotate-12 group-hover:scale-110 transition-transform">
                  <Wallet size={80} />
                </div>
             </div>

             <div className="group relative p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden hover:border-emerald-200 hover:shadow-md transition-all">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Compass size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">双休倒计时</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">4</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Days</span>
                  </div>
                  <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[20%] rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.02] -rotate-12 group-hover:scale-110 transition-transform">
                  <Compass size={80} />
                </div>
             </div>
           </div>
        </section>

        {/* Section 5: Special Surges (岁月坐标) */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-2">
               <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
               <h3 className="text-sm font-black text-slate-800 tracking-tight">岁月坐标</h3>
             </div>
             <button className="flex items-center gap-1 group">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter group-hover:text-blue-500 transition-colors">管理全部</span>
               <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-500" />
             </button>
           </div>
           
           <div className="space-y-3">
              {importantDates.map((item) => (
                <div key={item.id} className="group relative bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className={`shrink-0 h-12 w-12 ${item.bgColor} ${item.color} rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-sm`}>
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium tabular-nums">{item.date}</p>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-black tracking-tighter tabular-nums ${item.color}`}>
                          {item.remaining}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">天后</span>
                      </div>
                    </div>
                  </div>
                  <div className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-[0.15] rounded-3xl transition-opacity pointer-events-none`}></div>
                </div>
              ))}
              
              <button className="w-full h-14 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-2 text-slate-300 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/50 transition-all group overflow-hidden">
                 <div className="relative">
                   <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300 z-10" />
                   <Sparkles size={8} className="absolute -top-1 -right-1 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-widest">录入新航标</span>
              </button>
           </div>
        </section>

        {/* Section 6: Life Progress */}
        <section className="space-y-4 pb-16">
           <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-2">
               <div className="w-1 h-3 bg-amber-500 rounded-full"></div>
               <h3 className="text-sm font-black text-slate-800 tracking-tight">人生航程看板</h3>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-2">
                 <div className="flex items-center gap-2 text-slate-400">
                    <History size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">已航行</span>
                 </div>
                 <div>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">1,240</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">天</span>
                 </div>
                 <p className="text-[9px] text-slate-400 leading-tight">自第一份合同签署以来，你已在波涛中坚守多年。</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-2">
                 <div className="flex items-center gap-2 text-amber-500">
                    <Anchor size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">距离靠岸</span>
                 </div>
                 <div>
                    <span className="text-2xl font-black text-amber-600 tracking-tighter">8,760</span>
                    <span className="text-[10px] font-bold text-amber-400 ml-1 uppercase">天</span>
                 </div>
                 <p className="text-[9px] text-slate-400 leading-tight">距离法定退休日，那是属于你的永久避风港。</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-2">
                 <div className="flex items-center gap-2 text-blue-500">
                    <Ship size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">总航程</span>
                 </div>
                 <div>
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">10,000</span>
                    <span className="text-[10px] font-bold text-blue-400 ml-1 uppercase">天</span>
                 </div>
                 <p className="text-[9px] text-slate-400 leading-tight">这是你预计的职业总跨度，每一天都值得记录。</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-2">
                 <div className="flex items-center gap-2 text-rose-500">
                    <Sunset size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">余辉</span>
                 </div>
                 <div>
                    <span className="text-2xl font-black text-rose-600 tracking-tighter">18,250</span>
                    <span className="text-[10px] font-bold text-rose-400 ml-1 uppercase">天</span>
                 </div>
                 <p className="text-[9px] text-slate-400 leading-tight">人生剩余的可能。在金钱之外，别忘了阳光与爱。</p>
              </div>
           </div>
        </section>

      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-10 z-20 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center px-2">
          <NavItem icon={<LayoutGrid size={22} />} label="领潮中心" active />
          <NavItem icon={<BarChart3 size={22} />} label="洋流战报" />
          <NavItem icon={<FlaskConical size={22} />} label="动力室" />
          <NavItem icon={<User size={22} />} label="个人基地" />
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { display: none; }
        
        .animate-in {
          animation-duration: 300ms;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-bottom-8 { animation-name: slideInFromBottom; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInFromBottom {
          from { transform: translateY(2rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? '' : 'opacity-40 hover:opacity-100'}`}>
    <div className={`${active ? 'text-blue-600 scale-110' : 'text-slate-900'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </button>
);

export default App;