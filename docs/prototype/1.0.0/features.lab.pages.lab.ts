import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  Minus,
  Star
} from 'lucide-react';

/**
 * 等级配色与定义
 */
const RANKS = [
  { 
    level: 1, name: "海滩漫步者", exp: 0, icon: <Shell size={16} />, 
    themeStyles: "bg-slate-50 border-slate-200 text-slate-900 shadow-slate-200/50",
    progressStyles: "bg-slate-400",
    accent: "text-slate-400",
    theme: "basic"
  },
  { 
    level: 2, name: "浅滩摸鱼手", exp: 50, icon: <Waves size={16} />, 
    themeStyles: "bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-200 text-cyan-900 shadow-cyan-200/50",
    progressStyles: "bg-cyan-500",
    accent: "text-cyan-500",
    theme: "basic"
  },
  { 
    level: 3, name: "茶歇守卫官", exp: 120, icon: <Coffee size={16} />, 
    themeStyles: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-900 shadow-orange-200/50",
    progressStyles: "bg-orange-500",
    accent: "text-orange-500",
    theme: "basic"
  },
  { 
    level: 4, name: "摸鱼见习生", exp: 200, icon: <Wind size={16} />, 
    themeStyles: "bg-gradient-to-br from-emerald-400 to-teal-600 border-emerald-300 text-white shadow-emerald-500/30",
    progressStyles: "bg-white/40",
    accent: "text-emerald-100",
    theme: "mid"
  },
  { 
    level: 5, name: "资深舵手", exp: 350, icon: <Compass size={16} />, 
    themeStyles: "bg-gradient-to-br from-blue-500 to-indigo-700 border-blue-400 text-white shadow-blue-500/30",
    progressStyles: "bg-white/40",
    accent: "text-blue-100",
    theme: "mid"
  },
  { 
    level: 6, name: "隐身巡航员", exp: 500, icon: <Ghost size={16} />, 
    themeStyles: "bg-gradient-to-br from-slate-700 to-slate-900 border-slate-600 text-white shadow-black/40",
    progressStyles: "bg-indigo-500",
    accent: "text-slate-300",
    theme: "mid"
  },
  { 
    level: 7, name: "风暴避难者", exp: 750, icon: <Anchor size={16} />, 
    themeStyles: "bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800 border-violet-500 text-white shadow-purple-500/40",
    progressStyles: "bg-white/30",
    accent: "text-violet-100",
    theme: "high"
  },
  { 
    level: 8, name: "极速快艇王", exp: 1000, icon: <Zap size={16} />, 
    themeStyles: "bg-gradient-to-br from-rose-500 via-red-600 to-orange-700 border-rose-400 text-white shadow-rose-500/40",
    progressStyles: "bg-yellow-400",
    accent: "text-rose-100",
    theme: "high"
  },
  { 
    level: 9, name: "深海霸主", exp: 1500, icon: <Ship size={16} />, 
    themeStyles: "bg-gradient-to-br from-blue-900 via-indigo-950 to-black border-blue-800 text-white shadow-blue-900/50",
    progressStyles: "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]",
    accent: "text-blue-300",
    theme: "high"
  },
  { 
    level: 10, name: "金色传说 - 懒兽至尊", exp: 2000, icon: <Crown size={16} />, 
    themeStyles: "bg-gradient-to-br from-amber-300 via-yellow-500 to-orange-600 border-amber-200 text-amber-950 shadow-amber-500/60 ring-4 ring-amber-400/20",
    progressStyles: "bg-white shadow-[0_0_15px_rgba(255,255,255,1)]",
    accent: "text-amber-900",
    theme: "ultra"
  },
];

const App = () => {
  const [totalHappiness, setTotalHappiness] = useState(1280); 
  const [todayHappiness, setTodayHappiness] = useState(45);
  const [rankIndex, setRankIndex] = useState(9);

  const currentRank = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1] || null;
  
  const progressPercent = nextRank 
    ? Math.min(100, Math.max(0, ((totalHappiness - currentRank.exp) / (nextRank.exp - currentRank.exp)) * 100))
    : 100;

  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: "深海补水计划", desc: "摄入 250ml 水分，维持机体代谢活力", reward: 2, count: 3, limit: 8, icon: <Droplets className="text-blue-500" /> },
    { id: 2, title: "甲板体能回收", desc: "站立拉伸 3 分钟，缓解久坐导致的腰椎压力", reward: 3, count: 2, limit: 10, icon: <Accessibility className="text-emerald-500" /> },
    { id: 3, title: "远眺海平线", desc: "凝视 5 米外目标，放松睫状肌以保护视力", reward: 3, count: 1, limit: 10, icon: <Eye className="text-amber-500" /> },
    { id: 4, title: "准点回港靠岸", desc: "在法定下班时间准时离港，保障心理健康边界", reward: 10, count: 0, limit: 1, icon: <LogOut className="text-rose-500" /> },
    { id: 5, title: "潜艇压力排放", desc: "进入静谧空间独处 10 分钟，进行深层情绪减压", reward: 5, count: 1, limit: 5, icon: <Navigation className="text-indigo-500 rotate-90" /> },
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: "黄金航线守护者", desc: "连续 7 天执行准点回港，捍卫私人生活领海", reward: 50, progress: 5, target: 7, completed: false },
    { id: 2, title: "静默巡航专家", desc: "累计在非工位区域减压 120 分钟，达成深度平衡", reward: 50, progress: 85, target: 120, unit: "分钟", completed: false },
    { id: 3, title: "满电核动力", desc: "单周完成 40 次基础补水，身体机能满负荷运转", reward: 50, progress: 28, target: 40, completed: false },
  ]);

  const incrementTask = (id) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === id && task.count < task.limit) {
        setTotalHappiness(h => h + task.reward);
        setTodayHappiness(h => h + task.reward);
        return { ...task, count: task.count + 1 };
      }
      return task;
    }));
  };

  const decrementTask = (id) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === id && task.count > 0) {
        setTotalHappiness(h => Math.max(0, h - task.reward));
        setTodayHappiness(h => Math.max(0, h - task.reward));
        return { ...task, count: task.count - 1 };
      }
      return task;
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      <header className="pt-10 px-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
               <FlaskConical size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 italic">动力舱</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-32">
        
        {/* 等级面板 */}
        <section className={`rounded-[2rem] border p-6 shadow-2xl relative overflow-hidden transition-all duration-700 ${currentRank.themeStyles}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl -z-0"></div>
          
          {currentRank.theme === 'ultra' && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-5 left-10 animate-pulse"><Star size={20} fill="currentColor" /></div>
              <div className="absolute bottom-10 right-10 animate-bounce delay-75"><Sparkles size={16} fill="currentColor" /></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-20 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 animate-[shine_3s_infinite]"></div>
            </div>
          )}
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl shadow-inner border relative transition-all duration-500 ${
                  currentRank.theme !== 'basic' ? 'bg-white/10 border-white/20' : 'bg-white/50 border-white/80'
                }`}>
                  {React.cloneElement(currentRank.icon, { size: 28, className: "transition-transform" })}
                </div>
                <div>
                  <div className={`text-[10px] font-black uppercase tracking-[0.25em] mb-1 opacity-70`}>
                    航行头衔
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                    {currentRank.name}
                  </h2>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md border font-black ${
                      currentRank.theme !== 'basic' ? 'bg-black/20 border-white/10' : 'bg-slate-200 border-slate-300'
                    }`}>
                      第 {currentRank.level} 阶段
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                 <div className="text-2xl font-black tabular-nums tracking-tighter">{todayHappiness}</div>
                 <div className={`text-[10px] font-bold uppercase tracking-widest opacity-60`}>今日动能</div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mt-8 space-y-2">
              <div className="flex justify-between items-end px-1 text-[11px] font-bold">
                <span className="opacity-70">
                  动力储备: <span className="font-black tracking-normal">{totalHappiness}</span>
                </span>
                {nextRank ? (
                  <span className="opacity-90">
                    晋升目标: <span className="font-black">{nextRank.exp}</span>
                  </span>
                ) : (
                  <span className="font-black">已抵达懒兽巅峰</span>
                )}
              </div>
              <div className={`h-4 w-full rounded-full overflow-hidden p-[3px] border transition-colors duration-500 ${
                currentRank.theme !== 'basic' ? 'bg-black/20 border-white/10' : 'bg-slate-200/50 border-slate-200'
              }`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${currentRank.progressStyles}`}
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] animate-[shine_2s_infinite]"></div>
                </div>
              </div>
            </div>

            {/* 等级选择器 */}
            <div className="mt-6 flex justify-between items-center relative h-8 px-2">
               <div className={`absolute inset-x-4 top-1/2 h-[1px] opacity-20 ${currentRank.theme !== 'basic' ? 'bg-white' : 'bg-slate-900'}`}></div>
               {RANKS.map((r, i) => (
                 <button 
                  key={i}
                  onClick={() => setRankIndex(i)}
                  className={`relative z-10 transition-all duration-500 ${i === rankIndex ? 'scale-150' : 'scale-90 opacity-40 hover:opacity-80'}`}
                 >
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                     i === rankIndex 
                      ? (currentRank.theme === 'ultra' ? 'bg-white border-amber-600 text-amber-600 shadow-[0_0_10px_white]' : 'bg-white border-blue-500 text-blue-600 shadow-lg') 
                      : (currentRank.theme !== 'basic' ? 'bg-slate-800 border-white/20 text-white' : 'bg-white border-slate-300 text-slate-400')
                   }`}>
                     {React.cloneElement(r.icon, { size: 10 })}
                   </div>
                 </button>
               ))}
            </div>
          </div>
        </section>

        {/* 任务列表 */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-slate-800 tracking-tight">动力维护日志</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">航次每日更新</span>
          </div>

          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100/50">
                      {task.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight">{task.title}</h4>
                      <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{task.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${task.count >= task.limit ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {task.count >= task.limit ? '检修完毕' : `+${task.reward} 动力`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5 px-0.5 text-[10px] font-black text-slate-400 tabular-nums uppercase">
                       <span>维护进度</span>
                       <span className="text-slate-600">{task.count}/{task.limit}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${task.count >= task.limit ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 'bg-blue-500'}`} 
                        style={{ width: `${(task.count / task.limit) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-100 shadow-sm relative z-20">
                    <button 
                      onClick={() => decrementTask(task.id)}
                      disabled={task.count <= 0}
                      className="p-1.5 hover:bg-white hover:text-rose-500 rounded-lg transition-all disabled:opacity-20 text-slate-400 active:scale-90"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => incrementTask(task.id)}
                      disabled={task.count >= task.limit}
                      className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all disabled:opacity-20 text-slate-400 active:scale-90"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 成就墙 */}
        <section className="space-y-3 pb-24">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-slate-800 tracking-tight text-lg">大航海成就</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="relative bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm overflow-hidden group">
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-500">
                  <Medal size={80} />
                </div>
                <div className="relative z-10 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
                    <Trophy size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight">{ach.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">{ach.desc}</p>
                      </div>
                      <span className="text-xs font-black text-amber-600">+{ach.reward}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000"
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

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-8 z-20">
        <div className="flex justify-between items-center px-2">
          <NavItem icon={<LayoutGrid size={20} />} label="领潮中心" />
          <NavItem icon={<BarChart3 size={20} />} label="航行报告" />
          <NavItem icon={<FlaskConical size={20} />} label="动力舱" active={true} />
          <NavItem icon={<User size={20} />} label="个人基地" />
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { display: none; }
        
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }

        .animate-float-up {
          animation: floatUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex flex-col items-center gap-1 transition-all flex-1 ${active ? 'scale-105' : 'opacity-25'}`}>
    <div className={active ? 'text-blue-600' : 'text-slate-900'}>{icon}</div>
    <span className={`text-[9px] font-black tracking-tight ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </div>
);

export default App;