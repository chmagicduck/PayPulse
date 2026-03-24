import React, { useState, useEffect } from 'react';
import {
  Waves,
  LayoutGrid,
  BarChart3,
  FlaskConical,
  User,
  CheckCircle2,
  Trophy,
  Droplets,
  Accessibility,
  Eye,
  LogOut,
  Navigation,
  Sparkles,
  Zap,
  Medal,
  Anchor,
  Shell,
  Coffee,
  Wind,
  Compass,
  Ghost,
  Ship,
  Crown,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

// 10大等级定义及所需累计点数
const RANKS = [
  { level: 1, name: "海滩漫步者", exp: 0, icon: <Shell size={16} />, color: "text-slate-400", bg: "bg-slate-100", border: "border-slate-200" },
  { level: 2, name: "浅滩摸鱼手", exp: 50, icon: <Waves size={16} />, color: "text-cyan-500", bg: "bg-cyan-50", border: "border-cyan-100" },
  { level: 3, name: "茶歇守卫官", exp: 120, icon: <Coffee size={16} />, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  { level: 4, name: "划水见习生", exp: 200, icon: <Wind size={16} />, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  { level: 5, name: "资深舵手", exp: 350, icon: <Compass size={16} />, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
  { level: 6, name: "隐身巡航员", exp: 500, icon: <Ghost size={16} />, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
  { level: 7, name: "风暴避难者", exp: 750, icon: <Anchor size={16} />, color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100" },
  { level: 8, name: "极速快艇王", exp: 1000, icon: <Zap size={16} />, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
  { level: 9, name: "深海霸主", exp: 1500, icon: <Ship size={16} />, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  { level: 10, name: "深海大懒兽", exp: 2000, icon: <Crown size={16} />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
];

const App = () => {
  const [totalHappiness, setTotalHappiness] = useState(128); // 累计总值
  const [todayHappiness, setTodayHappiness] = useState(45); // 今日获得
  const [rankIndex, setRankIndex] = useState(2); // 初始 Lv.3
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // 预览逻辑
  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setRankIndex((prev) => (prev + 1) % RANKS.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const currentRank = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1] || null;
  
  const pointsToNext = nextRank ? nextRank.exp - totalHappiness : 0;
  const progressPercent = nextRank 
    ? ((totalHappiness - currentRank.exp) / (nextRank.exp - currentRank.exp)) * 100 
    : 100;

  // 任务数据状态
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: "深海补水", desc: "喝水一次", reward: 2, count: 3, limit: 8, icon: <Droplets className="text-blue-500" /> },
    { id: 2, title: "甲板活动", desc: "站起来活动", reward: 3, count: 2, limit: 10, icon: <Accessibility className="text-emerald-500" /> },
    { id: 3, title: "远眺海平线", desc: "看远处缓解疲劳", reward: 3, count: 1, limit: 10, icon: <Eye className="text-amber-500" /> },
    { id: 4, title: "准点回港", desc: "不加班下班", reward: 10, count: 0, limit: 1, icon: <LogOut className="text-rose-500" /> },
    { id: 5, title: "潜艇维护", desc: "带薪蹲坑", reward: 5, count: 1, limit: 5, icon: <Navigation className="text-indigo-500 rotate-90" /> },
  ]);

  // 成就数据
  const [achievements, setAchievements] = useState([
    { id: 1, title: "自律航行者", desc: "连续7天准点下班", reward: 50, progress: 5, target: 7, completed: false },
    { id: 2, title: "顶级摸鱼师", desc: "累计摸鱼120分钟", reward: 50, progress: 85, target: 120, unit: "min", completed: false },
    { id: 3, title: "海洋巨鲸", desc: "一周喝水40次", reward: 50, progress: 28, target: 40, completed: false },
  ]);

  const handleCompleteTask = (id) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === id && task.count < task.limit) {
        setTotalHappiness(h => h + task.reward);
        setTodayHappiness(h => h + task.reward);
        return { ...task, count: task.count + 1 };
      }
      return task;
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      {/* Header */}
      <header className="pt-12 px-6 pb-6 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
               <FlaskConical size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">动力室</h1>
          </div>
          <button 
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${isAutoPlay ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}
          >
             <span className={`w-1.5 h-1.5 rounded-full ${isAutoPlay ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></span>
             <span className="text-[10px] font-black uppercase tracking-tight">
               {isAutoPlay ? '预览中' : '路线预览'}
             </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-2 space-y-8 pb-32">
        
        {/* 等级路线与今日进度卡片 */}
        <section className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 overflow-hidden relative mt-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-0 opacity-60"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">当前航行等级</span>
                <div className={`flex items-center gap-2 text-2xl font-black ${currentRank.color}`}>
                  Lv.{currentRank.level} {currentRank.name}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">今日获得</span>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-xl font-black text-blue-600">{todayHappiness}</span>
                  <span className="text-[10px] font-bold text-blue-400">快乐值</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-700 shadow-sm ${currentRank.color.replace('text', 'bg')}`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                   <span className="text-[10px] font-bold text-slate-400">总累计 {totalHappiness}</span>
                </div>
                {nextRank ? (
                  <div className="flex items-center gap-1 group">
                    <span className="text-[10px] font-bold text-slate-500">
                      距离 <span className="text-blue-600 font-black">Lv.{nextRank.level}</span> 还差 <span className="text-blue-600 font-black">{pointsToNext}</span>
                    </span>
                    <ChevronRight size={10} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-amber-500">已达最高等级</span>
                )}
              </div>
            </div>

            <div className="flex justify-between px-1 relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -z-10"></div>
              {RANKS.map((r, i) => (
                <div 
                  key={i} 
                  onClick={() => { setRankIndex(i); setIsAutoPlay(false); }}
                  className={`flex flex-col items-center transition-all duration-500 cursor-pointer ${i === rankIndex ? 'scale-125 z-10' : 'scale-75 opacity-20 hover:opacity-40'}`}
                >
                  <div className={`p-1.5 rounded-lg border-2 border-white shadow-md ${r.bg} ${r.color}`}>
                    {React.cloneElement(r.icon, { size: 10 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 还原：日常巡航任务 */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">日常巡航任务</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">每日 00:00 重置</span>
          </div>

          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div 
                key={task.id} 
                className={`group bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-4 transition-all ${task.count >= task.limit ? 'opacity-60' : 'hover:border-blue-200 hover:shadow-md active:scale-[0.98]'}`}
                onClick={() => handleCompleteTask(task.id)}
              >
                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-slate-50 group-hover:scale-110 transition-transform`}>
                  {task.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">{task.title}</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">+{task.reward} 快乐值</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{task.desc}</p>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(task.count / task.limit) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">{task.count}/{task.limit}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {task.count >= task.limit ? (
                    <div className="bg-emerald-50 text-emerald-500 p-2 rounded-full">
                      <CheckCircle2 size={20} />
                    </div>
                  ) : (
                    <div className="bg-slate-50 text-slate-300 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Navigation size={20} className="rotate-90" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 还原：荣誉勋章成就系统 */}
        <section className="space-y-4 pb-20">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">荣誉勋章</h3>
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold text-amber-600 uppercase">成就系统</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="relative bg-white border border-slate-100 rounded-3xl p-5 overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:scale-125 transition-transform duration-700">
                  <Medal size={100} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                        <Trophy size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{ach.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{ach.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-amber-600">+{ach.reward}</p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter text-nowrap">快乐值奖励</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400">航行进度</span>
                      <span className="text-[10px] font-bold text-slate-600">{ach.progress}/{ach.target}{ach.unit || ''}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(ach.progress / ach.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-10 z-20">
        <div className="flex justify-between items-center px-2">
          <NavItem icon={<LayoutGrid size={22} />} label="领潮中心" />
          <NavItem icon={<BarChart3 size={22} />} label="洋流战报" />
          <NavItem icon={<FlaskConical size={22} />} label="动力室" active={true} />
          <NavItem icon={<User size={22} />} label="个人基地" />
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? 'scale-110' : 'opacity-20'}`}>
    <div className={active ? 'text-blue-600' : 'text-slate-900'}>{icon}</div>
    <span className={`text-[10px] font-black tracking-tight ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </div>
);

export default App;