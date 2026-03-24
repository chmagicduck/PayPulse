import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  MapPin,
  Users,
  Info,
  ChevronRight,
  Database,
  Trophy,
  LayoutGrid,
  BarChart3,
  FlaskConical,
  Target,
  Sparkles,
  BellRing,
  Coffee,
  Waves,
  Anchor,
  Wind,
  Compass,
  Ship,
  Shell,
  Ghost,
  Crown,
  Zap,
  X,
  CheckCircle2
} from 'lucide-react';

// 10大等级定义
const RANKS = [
  { level: 1, name: "海滩漫步者", icon: <Shell size={16} />, color: "text-slate-400", bg: "bg-slate-100", border: "border-slate-200" },
  { level: 2, name: "浅滩摸鱼手", icon: <Waves size={16} />, color: "text-cyan-500", bg: "bg-cyan-50", border: "border-cyan-100" },
  { level: 3, name: "茶歇守卫官", icon: <Coffee size={16} />, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  { level: 4, name: "划水见习生", icon: <Wind size={16} />, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  { level: 5, name: "资深舵手", icon: <Compass size={16} />, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
  { level: 6, name: "隐身巡航员", icon: <Ghost size={16} />, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
  { level: 7, name: "风暴避难者", icon: <Anchor size={16} />, color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100" },
  { level: 8, name: "极速快艇王", icon: <Zap size={16} />, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
  { level: 9, name: "深海霸主", icon: <Ship size={16} />, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  { level: 10, name: "深海大懒兽", icon: <Crown size={16} />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
];

// 预设 6 个默认头像
const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
];

const App = () => {
  const [rankIndex, setRankIndex] = useState(4); // 默认显示 Lv.5
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(PRESET_AVATARS[0]);

  // 自动切换预览逻辑
  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setRankIndex((prev) => (prev + 1) % RANKS.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const currentRank = RANKS[rankIndex];

  const user = {
    name: "摸鱼小队长",
    id: "ID: 20240915",
    exp: 75,
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      {/* 顶部状态栏占位 */}
      <div className="h-10 bg-white/50 backdrop-blur-sm sticky top-0 z-20"></div>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Section 1: 头像昵称区域 */}
        <section className="px-6 pb-8 pt-2 bg-gradient-to-b from-white to-slate-50">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-4">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => setShowAvatarModal(true)}
                >
                  <div className={`w-20 h-20 rounded-[2rem] bg-white border-2 shadow-xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 ${currentRank.border}`}>
                    <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
                    {/* 点击提示层 */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[8px] font-bold text-white bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">更换头像</span>
                    </div>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-xl border-2 border-white shadow-lg transition-all duration-500 ${currentRank.bg} ${currentRank.color}`}>
                    {currentRank.icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-black tracking-tight text-slate-900">{user.name}</h2>
                    <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black text-white uppercase tracking-tighter transition-colors duration-500 ${currentRank.color.replace('text', 'bg')}`}>VIP</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 tabular-nums">{user.id}</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`p-2.5 rounded-2xl border transition-all relative ${isAutoPlay ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                   <Sparkles size={20} className={isAutoPlay ? "animate-pulse" : ""} />
                </button>
             </div>
          </div>

          {/* Section 2: 等级路线 (动态切换演示) */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm overflow-hidden relative">
             <div className="flex justify-between items-end mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">等级预览</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold transition-all duration-500 ${currentRank.color}`}>
                      Lv.{currentRank.level} {currentRank.name}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-blue-600 tracking-tight">累计快乐值 100</p>
             </div>
             
             {/* 进度条 */}
             <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 shadow-sm ${currentRank.color.replace('text', 'bg')}`}
                  style={{ width: `${(currentRank.level / 10) * 100}%` }}
                ></div>
             </div>

             {/* 等级轴 */}
             <div className="flex justify-between mt-5 px-1 relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -z-10"></div>
                {RANKS.map((r, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col items-center transition-all duration-300 ${i === rankIndex ? 'scale-125' : 'scale-100 opacity-30'}`}
                  >
                    <div className={`p-1.5 rounded-lg border-2 border-white shadow-sm ${r.bg} ${r.color}`}>
                      {React.cloneElement(r.icon, { size: 10 })}
                    </div>
                  </div>
                ))}
             </div>
             
             {isAutoPlay && (
               <div className="absolute top-2 right-4 flex items-center gap-1">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>
                  <span className="text-[8px] font-bold text-blue-500 uppercase">Auto Preview</span>
               </div>
             )}
          </div>
        </section>

        {/* Section 3: 核心功能列表 */}
        <section className="px-6 space-y-6">
          <div className="space-y-3">
             <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800 tracking-tight">航行控制台</h3>
             </div>
             
             <div className="grid grid-cols-1 gap-2.5">
                <MenuButton 
                   icon={<User size={18} className="text-blue-500" />} 
                   title="基本信息设置" 
                   desc="修改航行 ID、薪资基数及工时"
                />
                <MenuButton 
                   icon={<MapPin size={18} className="text-emerald-500" />} 
                   title="岁月坐标设置" 
                   desc="管理重要的时间节点与纪念日"
                />
                <MenuButton 
                   icon={<Calendar size={18} className="text-indigo-600" />} 
                   title="查看日历" 
                   desc="纵览航行周期与重要考勤节点"
                />
                <MenuButton 
                   icon={<Target size={18} className="text-rose-500" />} 
                   title="任务中心设置" 
                   desc="配置你的每日航行目标与奖励"
                   badge="3"
                />
             </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-3 bg-slate-300 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800 tracking-tight">关于与社群</h3>
             </div>
             
             <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                <ListButton icon={<Users size={18} />} title="加入社群" desc="与万千舵手交流摸鱼心得" />
                <ListButton icon={<Info size={18} />} title="关于软件" desc="版本 v2.4.0 (Build 2024)" />
             </div>
          </div>

          <div className="space-y-3 pb-10">
             <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-3 bg-slate-800 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800 tracking-tight">安全与存储</h3>
             </div>
             <div className="group relative p-5 rounded-[2rem] bg-slate-900 text-white overflow-hidden shadow-xl shadow-slate-200 cursor-pointer active:scale-[0.98] transition-all">
                <div className="relative z-10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                         <Database size={20} className="text-blue-400" />
                      </div>
                      <div>
                         <p className="text-sm font-bold">数据管理中心</p>
                         <p className="text-[10px] text-slate-400 mt-0.5 font-medium tracking-wide">本地备份、同步与隐私清理</p>
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-slate-600" />
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
             </div>
          </div>
        </section>
      </main>

      {/* 头像更换弹窗 */}
      {showAvatarModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center px-4 pb-24 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
           <div className="w-full bg-white rounded-[2.5rem] shadow-2xl p-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h4 className="text-lg font-black text-slate-900 tracking-tight">更换基地身份</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select Preset Avatar</p>
                 </div>
                 <button 
                  onClick={() => setShowAvatarModal(false)}
                  className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                 {PRESET_AVATARS.map((url, i) => (
                   <div 
                    key={i}
                    onClick={() => setCurrentAvatar(url)}
                    className={`relative aspect-square rounded-[1.8rem] overflow-hidden border-2 transition-all cursor-pointer group active:scale-95 ${currentAvatar === url ? 'border-blue-600 shadow-lg shadow-blue-100' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                   >
                     <img src={url} alt={`preset-${i}`} className="w-full h-full object-cover" />
                     {currentAvatar === url && (
                       <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                          <CheckCircle2 size={24} className="text-blue-600" />
                       </div>
                     )}
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => setShowAvatarModal(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-blue-600 transition-colors active:scale-95"
              >
                确认修改
              </button>
           </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-10 z-20 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center px-2">
          <NavItem icon={<LayoutGrid size={22} />} label="领潮中心" />
          <NavItem icon={<BarChart3 size={22} />} label="洋流战报" />
          <NavItem icon={<FlaskConical size={22} />} label="动力室" />
          <NavItem icon={<User size={22} />} label="个人基地" active />
        </div>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { display: none; }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-in { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

// 大卡片按钮组件
const MenuButton = ({ icon, title, desc, badge }) => (
  <button className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:border-blue-100 hover:shadow-md transition-all active:scale-[0.99]">
    <div className="flex items-center gap-4 text-left">
      <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 group-hover:scale-105 transition-all">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800">{title}</span>
          {badge && (
            <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black min-w-[16px] text-center shadow-sm">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-tight">{desc}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
  </button>
);

// 列表按钮组件
const ListButton = ({ icon, title, desc }) => (
  <button className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left">
    <div className="flex items-center gap-4">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-700">{title}</p>
        <p className="text-[9px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
    <ChevronRight size={14} className="text-slate-300" />
  </button>
);

// 导航项
const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? '' : 'opacity-40 hover:opacity-100'}`}>
    <div className={`${active ? 'text-blue-600 scale-110' : 'text-slate-900'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </button>
);

export default App;