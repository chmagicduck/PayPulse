import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Wallet, 
  BarChart3, 
  FlaskConical, 
  User,
  LayoutGrid, 
  TrendingUp,
  Waves,
  Star,
  LogOut,
  Eye,
  EyeOff,
  Settings2,
  Gift,
  Heart,
  X,
  ListTodo,
  CalendarDays,
  Baby,
  Briefcase,
  Flag,
  Skull
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMoYu, setIsMoYu] = useState(false);
  const [moYuSeconds, setMoYuSeconds] = useState(0);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [showAmount, setShowAmount] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // 时间显示维度状态: 0:天, 1:年月天, 2:月天, 3:周天
  const [timeMode, setTimeMode] = useState({
    life: 0,
    career: 0,
    retire: 0,
    final: 0
  });
  
  // 弹窗编辑状态
  const [editH, setEditH] = useState(0);
  const [editM, setEditM] = useState(0);
  const [editS, setEditS] = useState(0);
  
  // --- 核心数据配置 ---
  const monthlySalary = 15000;
  const workDaysPerMonth = 22;
  const dailyWorkHours = 8;
  const offWorkTime = "18:30:00";
  const startWorkTime = "09:30:00";

  // --- 人生日期配置 ---
  const birthday = new Date("1995-06-15"); 
  const firstJobDate = new Date("2018-07-01"); 
  const retirementDate = new Date("2055-06-15"); 
  const endOfLifeDate = new Date("2080-06-15"); 

  const getDaysDiff = (start, end) => Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const now = new Date();
  
  const lifeDays = getDaysDiff(birthday, now); 
  const careerDays = getDaysDiff(firstJobDate, now); 
  const daysToRetire = getDaysDiff(now, retirementDate); 
  const daysToFinal = getDaysDiff(now, endOfLifeDate); 

  const hourlyRate = monthlySalary / workDaysPerMonth / dailyWorkHours;
  const secondRate = hourlyRate / 3600;

  const tideTasks = { total: 6, completed: 2 };
  const importantDates = [
    { id: 1, title: "结婚纪念日", date: "10月20日", icon: <Heart size={18} />, color: "text-rose-500", bgColor: "bg-rose-50", ringColor: "ring-rose-100", remaining: 28 },
    { id: 2, title: "我的生日", date: "12月05日", icon: <Gift size={18} />, color: "text-amber-500", bgColor: "bg-amber-50", ringColor: "ring-amber-100", remaining: 74 },
    { id: 3, title: "Q3 季度奖金", date: "09月30日", icon: <Star size={18} />, color: "text-blue-500", bgColor: "bg-blue-50", ringColor: "ring-blue-100", remaining: 8 }
  ];

  // 时间维度转换逻辑
  const formatTimeDimension = (totalDays, mode) => {
    const absDays = Math.abs(totalDays);
    if (mode === 0) return `${absDays.toLocaleString()}天`;
    
    if (mode === 1) { // 年月天
      const years = Math.floor(absDays / 365);
      const months = Math.floor((absDays % 365) / 30);
      const days = (absDays % 365) % 30;
      return `${years}年${months}月${days}天`;
    }
    
    if (mode === 2) { // 月天
      const months = Math.floor(absDays / 30);
      const days = absDays % 30;
      return `${months}月${days}天`;
    }
    
    if (mode === 3) { // 周天
      const weeks = Math.floor(absDays / 7);
      const days = absDays % 7;
      return `${weeks}周${days}天`;
    }
    return `${absDays}天`;
  };

  const toggleMode = (key) => {
    setTimeMode(prev => ({ ...prev, [key]: (prev[key] + 1) % 4 }));
  };

  useEffect(() => {
    let interval;
    if (isMoYu) {
      interval = setInterval(() => setMoYuSeconds(s => s + 1), 1000);
    } else {
      interval = setInterval(() => setWorkSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isMoYu]);

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

  const [timeLeftStr, setTimeLeftStr] = useState("00:00:00");
  const [moYuPercent, setMoYuPercent] = useState(0);
  const [workTimePercent, setWorkTimePercent] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const nowTs = new Date();
      const target = new Date();
      const start = new Date();
      const [h, m, s] = offWorkTime.split(':');
      const [sh, sm, ss] = startWorkTime.split(':');
      target.setHours(parseInt(h), parseInt(m), parseInt(s));
      start.setHours(parseInt(sh), parseInt(sm), parseInt(ss));
      
      const totalWorkDurationSeconds = (target - start) / 1000;
      const elapsedWorkSeconds = (nowTs - start) / 1000;
      const diff = target - nowTs;

      const workPercent = Math.max(0, Math.min(100, (elapsedWorkSeconds / totalWorkDurationSeconds) * 100));
      setWorkTimePercent(workPercent);

      const moYuP = Math.min(100, (moYuSeconds / totalWorkDurationSeconds) * 100);
      setMoYuPercent(moYuP);

      if (diff <= 0) {
        setTimeLeftStr("已离港");
      } else {
        const hh = Math.floor(diff / 1000 / 60 / 60);
        const mm = Math.floor((diff / 1000 / 60) % 60);
        const ss = Math.floor((diff / 1000) % 60);
        setTimeLeftStr(`${hh}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [moYuSeconds]);

  const HeaderAction = ({ label }) => (
    <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:opacity-70 transition-all active:scale-95">
      {label} &gt;
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      {/* 修正弹窗 */}
      {isEditModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative w-full bg-white rounded-t-[2rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-8 border border-slate-200">
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
                {[
                  { val: editH, set: setEditH, label: "时", max: 23 },
                  { val: editM, set: setEditM, label: "分", max: 59 },
                  { val: editS, set: setEditS, label: "秒", max: 59 }
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center gap-2">
                      <input 
                        type="number" 
                        value={item.val.toString().padStart(2, '0')}
                        onChange={(e) => item.set(Math.min(item.max, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-16 h-16 text-3xl font-black text-center bg-slate-50 border border-slate-200 rounded-2xl outline-none tabular-nums"
                      />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                    {idx < 2 && <span className="text-2xl font-black text-slate-300 mb-6">:</span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs">取消</button>
                <button onClick={handleSaveTime} className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-200">确认保存</button>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32">
        
        {/* 核心面板卡片 */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-blue-600 p-6 shadow-xl shadow-blue-100 transition-all duration-500">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-blue-100 opacity-90">今日累计摸鱼收益</h3>
                <button onClick={() => setShowAmount(!showAmount)} className="p-1 text-blue-200 hover:text-white transition-colors">
                  {showAmount ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-5xl font-black tracking-tighter text-white tabular-nums leading-none">
                  {formatMoney(todayEarned)}
                </div>
                <div className="flex items-center gap-2 mt-3">
                   <span className="px-2 py-0.5 rounded-md bg-white/20 text-[9px] font-bold text-white uppercase tracking-wider">自动结算</span>
                   <p className="text-xs text-blue-100 opacity-80 tabular-nums">航速 {secondRate.toFixed(3)}/s</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => setIsMoYu(!isMoYu)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all shadow-lg active:scale-95 ${isMoYu ? 'bg-white text-blue-600 font-black' : 'bg-white/10 text-white border border-white/20 backdrop-blur-md'}`}
                >
                  <Coffee size={18} className={isMoYu ? 'animate-bounce' : ''} />
                  <span className="text-xs font-bold">{isMoYu ? '摸鱼中' : '点击摸鱼'}</span>
                </button>
                <div className="text-[10px] font-bold text-blue-200 tabular-nums bg-white/5 px-2 py-0.5 rounded-md">
                   停留: {formatTime(moYuSeconds)}
                   <button onClick={openEditModal} className="ml-1.5 opacity-60 hover:opacity-100"><Settings2 size={10}/></button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-3xl p-4 border border-white/5 backdrop-blur-sm">
               <div className="flex justify-between items-end mb-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                       <TrendingUp size={12} className="text-blue-200" />
                       <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">摸鱼收益深度</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                       <span className="text-xl font-black text-white tabular-nums">{moYuPercent.toFixed(1)}%</span>
                       <span className="text-[10px] font-bold text-white/40 tabular-nums">/ 工时 {workTimePercent.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 mb-0.5">
                       <LogOut size={12} className="text-blue-200 opacity-60" />
                       <span className="text-[9px] font-bold text-blue-200 uppercase tracking-tighter">离岗倒计时</span>
                    </div>
                    <span className="text-sm font-bold text-white/90 tabular-nums tracking-tight">
                      {timeLeftStr}
                    </span>
                  </div>
               </div>
               
               <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden mb-4 relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-white/30 transition-all duration-1000 ease-linear"
                    style={{ width: `${workTimePercent}%` }}
                  ></div>
                  <div 
                    className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                    style={{ width: `${moYuPercent}%` }}
                  ></div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-blue-200 tracking-widest mb-1">今日入账</p>
                    <p className="text-base font-bold text-white tabular-nums">{formatMoney(moYuEarned)}</p>
                  </div>
                  <div className="pl-4 border-l border-white/10">
                    <p className="text-[9px] uppercase font-bold text-blue-200 tracking-widest mb-1">本月已赚</p>
                    <p className="text-base font-bold text-white tabular-nums">{formatMoney(monthlyEarned)}</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 航行目标 */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">今日航行目标</h3>
            </div>
            <HeaderAction label="潮汐任务" />
          </div>
          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm">
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                   <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                     <ListTodo size={14} />
                   </div>
                   <p className="text-[13px] font-bold text-slate-800">航道任务清理</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-blue-600 tabular-nums">{tideTasks.completed}</span>
                  <span className="text-[10px] font-bold text-slate-300">/ {tideTasks.total}</span>
                </div>
             </div>
             <div className="flex gap-1.5 h-2 w-full">
                {Array.from({ length: tideTasks.total }).map((_, i) => (
                  <div 
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-500 ${i < tideTasks.completed ? 'bg-blue-600' : 'bg-slate-100'}`}
                  ></div>
                ))}
             </div>
          </div>
        </section>

        {/* 常规波动 - 改为1行展示2张卡片 */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">常规波动</h3>
            </div>
            <HeaderAction label="查看日历" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* 1. 发薪大潮 */}
            <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm group active:scale-[0.98] transition-all cursor-default">
                <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:scale-110 transition-transform text-blue-600">
                   <Wallet size={48} />
                </div>
                <div className="flex items-center mb-2 relative z-10">
                   <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-sm">
                      <Wallet size={12} />
                   </div>
                   <span className="ml-2 text-[9px] font-black text-blue-500 uppercase tracking-widest">发薪 (PAY)</span>
                </div>
                <div className="relative z-10">
                   <div className="flex items-baseline gap-1">
                      <span className="text-[11px] font-black text-slate-400">距</span>
                      <span className="text-xl font-black text-slate-900 tracking-tighter tabular-nums">12天</span>
                   </div>
                   <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                      下一波<span className="text-blue-600 font-bold">资金补给</span>正在加速。
                   </p>
                </div>
            </div>

            {/* 2. 双休倒数 */}
            <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm group active:scale-[0.98] transition-all cursor-default">
                <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:rotate-12 transition-transform text-emerald-600">
                   <CalendarDays size={48} />
                </div>
                <div className="flex items-center mb-2 relative z-10">
                   <div className="p-1.5 bg-emerald-500 rounded-lg text-white shadow-sm">
                      <CalendarDays size={12} />
                   </div>
                   <span className="ml-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest">双休 (WKD)</span>
                </div>
                <div className="relative z-10">
                   <div className="flex items-baseline gap-1">
                      <span className="text-[11px] font-black text-slate-400">剩</span>
                      <span className="text-xl font-black text-slate-900 tracking-tighter tabular-nums">4天</span>
                   </div>
                   <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                      距离下个<span className="text-emerald-500 font-bold">港口休整</span>不远。
                   </p>
                </div>
            </div>
          </div>
        </section>

        {/* 岁月坐标 */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-2">
               <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
               <h3 className="text-sm font-black text-slate-800 tracking-tight">岁月坐标</h3>
             </div>
             <HeaderAction label="新增坐标" />
           </div>
           <div className="flex flex-col gap-3">
              {importantDates.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white border border-slate-100 rounded-[1.25rem] px-5 py-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group active:scale-[0.99]"
                >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 ${item.bgColor} ${item.color} rounded-xl flex items-center justify-center ring-2 ${item.ringColor} transition-transform group-hover:scale-110`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                          <h4 className="text-[15px] font-bold text-slate-800 leading-tight tracking-tight">{item.title}</h4>
                          <span className="text-[11px] font-bold opacity-50 tabular-nums mt-0.5">{item.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-black tracking-tighter tabular-nums ${item.color}`}>{item.remaining}</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">天后</span>
                    </div>
                </div>
              ))}
           </div>
        </section>

        {/* 人生航程看板 */}
        <section className="space-y-4 pb-24">
           <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-4 bg-slate-900 rounded-full"></div>
               <h3 className="text-base font-black text-slate-800 tracking-tight">人生航程看板</h3>
             </div>
             <div className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-400 uppercase tracking-tighter">Voyage Ledger</div>
           </div>

           <div className="grid grid-cols-1 gap-3">
              
              {/* 1. 生命至今 */}
              <div 
                onClick={() => toggleMode('life')}
                className="relative overflow-hidden bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm group active:scale-[0.98] transition-all cursor-pointer"
              >
                  <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:scale-110 transition-transform">
                     <Baby size={60} />
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                       <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-100">
                          <Baby size={14} />
                       </div>
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">生命航程 (LIFE)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                     <div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-[13px] font-black text-slate-400">已过</span>
                           <span className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">
                             {formatTimeDimension(lifeDays, timeMode.life)}
                           </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-[280px] leading-snug font-medium">
                           这是你从<span className="text-slate-900 font-black">诞生启航</span>至今所经历的日夜。
                        </p>
                     </div>
                  </div>
              </div>

              {/* 2. 第一份工作至今 */}
              <div 
                onClick={() => toggleMode('career')}
                className="relative overflow-hidden bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm group active:scale-[0.98] transition-all cursor-pointer"
              >
                  <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:rotate-12 transition-transform">
                     <Briefcase size={60} />
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                       <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-100">
                          <Briefcase size={14} />
                       </div>
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">职场航程 (CAREER)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                     <div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-[13px] font-black text-slate-400">已过</span>
                           <span className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">
                              {formatTimeDimension(careerDays, timeMode.career)}
                           </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-[280px] leading-snug font-medium">
                           自步入<span className="text-blue-600 font-black">社会熔炉</span>起，你已交付出的岁月。
                        </p>
                     </div>
                  </div>
              </div>

              {/* 3. 距离退休还有多少天 */}
              <div 
                onClick={() => toggleMode('retire')}
                className="relative overflow-hidden bg-emerald-50/50 border border-emerald-100 rounded-[1.5rem] p-4 group active:scale-[0.98] transition-all cursor-pointer"
              >
                  <div className="absolute top-0 right-0 p-3 opacity-[0.1] text-emerald-600">
                     <Flag size={60} />
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                       <div className="p-1.5 bg-emerald-600 rounded-lg text-white shadow-md shadow-emerald-100">
                          <Flag size={14} />
                       </div>
                       <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">退役倒计时 (RETIRE)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                     <div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-[13px] font-black text-emerald-600/40">还剩</span>
                           <span className="text-2xl font-black text-emerald-700 tracking-tighter tabular-nums">
                              {formatTimeDimension(daysToRetire, timeMode.retire)}
                           </span>
                        </div>
                        <p className="text-[11px] text-emerald-800/60 mt-1 font-medium leading-snug">
                           距离你可以<span className="text-emerald-700 font-black">正式卸甲</span>，还有这些定额任务。
                        </p>
                     </div>
                  </div>
                  <div className="mt-3 h-1 w-full bg-emerald-200/50 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '45%' }}></div>
                  </div>
              </div>

              {/* 4. 距离死亡还有多少天 */}
              <div 
                onClick={() => toggleMode('final')}
                className="relative overflow-hidden bg-rose-50/50 border border-rose-100 rounded-[1.5rem] p-4 group active:scale-[0.98] transition-all cursor-pointer"
              >
                  <div className="absolute top-0 right-0 p-3 opacity-[0.1] text-rose-600 animate-pulse">
                     <Skull size={60} />
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                       <div className="p-1.5 bg-rose-600 rounded-lg text-white shadow-md shadow-rose-200">
                          <Skull size={14} />
                       </div>
                       <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">终点倒计时 (FINAL)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                     <div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-[13px] font-black text-rose-400">还剩</span>
                           <span className="text-2xl font-black text-rose-600 tracking-tighter tabular-nums">
                              {formatTimeDimension(daysToFinal, timeMode.final)}
                           </span>
                        </div>
                        <p className="text-[10px] text-rose-800/70 mt-1 font-black italic tracking-tight">
                           "警告：航线即将耗尽，此数据不可逆转。"
                        </p>
                     </div>
                  </div>
                  <div className="mt-4 p-2.5 bg-white/60 rounded-xl border border-rose-100/50 text-[9px] text-rose-900/50 leading-tight">
                     * 基于预估 85 岁自然终点计算。每一秒都是该生命周期中不可再生的奢侈品。
                  </div>
              </div>
           </div>
        </section>

      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-10 z-20 shadow-lg">
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
        .animate-in { animation: fadeIn 300ms ease-out both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.2; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? '' : 'opacity-40'}`}>
    <div className={`${active ? 'text-blue-600 scale-110' : 'text-slate-900'}`}>{icon}</div>
    <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </button>
);

export default App;