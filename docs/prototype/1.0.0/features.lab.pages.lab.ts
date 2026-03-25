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
  Plus,
  Minus
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
  const [totalHappiness, setTotalHappiness] = useState(128);
  const [todayHappiness, setTodayHappiness] = useState(45);
  const [rankIndex, setRankIndex] = useState(2);

  // 任务数据
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

  const currentRank = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1] || null;
  
  const pointsToNext = nextRank ? nextRank.exp - totalHappiness : 0;
  const progressPercent = nextRank 
    ? Math.min(100, Math.max(0, ((totalHappiness - currentRank.exp) / (nextRank.exp - currentRank.exp)) * 100))
    : 100;

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
      
      {/* Header */}
      <header className="pt-10 px-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
               <FlaskConical size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">动力室</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-2 space-y-6 pb-32">
        
        {/* 等级面板 - 更加紧凑 */}
        <section className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm overflow-hidden relative mt-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -z-0 opacity-40"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">当前航行等级</span>
                <div className={`flex items-center gap-1.5 text-lg font-black ${currentRank.color}`}>
                  Lv.{currentRank.level} {currentRank.name}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">今日进度</span>
                <div className="flex items-baseline justify-end gap-0.5">
                  <span className="text-lg font-black text-blue-600">{todayHappiness}</span>
                  <span className="text-[9px] font-bold text-blue-400">PTS</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${currentRank.color.replace('text', 'bg')}`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center px-0.5">
                <span className="text-[10px] font-bold text-slate-400">累计 {totalHappiness}</span>
                {nextRank ? (
                  <span className="text-[10px] font-bold text-slate-500">
                    下级需 <span className="text-blue-600 font-black">{pointsToNext}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-500">最高等级</span>
                )}
              </div>
            </div>

            {/* 精简的等级路线 */}
            <div className="flex justify-between px-1 relative py-1">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -z-10"></div>
              {RANKS.map((r, i) => (
                <div 
                  key={i} 
                  onClick={() => setRankIndex(i)}
                  className={`transition-all duration-300 cursor-pointer ${i === rankIndex ? 'scale-110 opacity-100' : 'scale-75 opacity-10 hover:opacity-30'}`}
                >
                  <div className={`p-1 rounded-md border border-white shadow-sm ${r.bg} ${r.color}`}>
                    {React.cloneElement(r.icon, { size: 10 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 日常巡航任务 - 采用指定卡片样式 */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-slate-800 tracking-tight">日常巡航任务</h3>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">每日 00:00 重置</span>
          </div>

          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm"
              >
                {/* 顶部标题行 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                      {task.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{task.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate w-32 font-medium">{task.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${task.count >= task.limit ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {task.count >= task.limit ? '已达成' : `+${task.reward} PTS`}
                    </span>
                  </div>
                </div>

                {/* 底部进度与控制行 */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5 px-0.5">
                       <span className="text-[9px] font-bold text-slate-300 uppercase tabular-nums">Progress</span>
                       <span className="text-[10px] font-black text-slate-500 tabular-nums">{task.count}/{task.limit}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${task.count >= task.limit ? 'bg-emerald-400' : 'bg-blue-500'}`} 
                        style={{ width: `${(task.count / task.limit) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-100 shadow-inner">
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

        {/* 荣誉勋章 */}
        <section className="space-y-3 pb-24">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-slate-800 tracking-tight">荣誉勋章</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="relative bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm overflow-hidden group">
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-500">
                  <Medal size={80} />
                </div>
                <div className="relative z-10 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <Trophy size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{ach.title}</h4>
                        <p className="text-[10px] text-slate-400">{ach.desc}</p>
                      </div>
                      <span className="text-[11px] font-black text-amber-600">+{ach.reward}</span>
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

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-8 z-20">
        <div className="flex justify-between items-center px-2">
          <NavItem icon={<LayoutGrid size={20} />} label="领潮中心" />
          <NavItem icon={<BarChart3 size={20} />} label="洋流战报" />
          <NavItem icon={<FlaskConical size={20} />} label="动力室" active={true} />
          <NavItem icon={<User size={20} />} label="个人基地" />
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
  <div className={`flex flex-col items-center gap-1 transition-all flex-1 ${active ? 'scale-105' : 'opacity-25'}`}>
    <div className={active ? 'text-blue-600' : 'text-slate-900'}>{icon}</div>
    <span className={`text-[9px] font-black tracking-tight ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </div>
);

export default App;