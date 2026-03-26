import React, { useState, useRef } from 'react';
import {
  User,
  Calendar,
  MapPin,
  Users,
  Info,
  ChevronRight,
  Database,
  LayoutGrid,
  BarChart3,
  FlaskConical,
  Target,
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
  CheckCircle2,
  Camera,
  MessageCircle
} from 'lucide-react';

// 10大等级定义
const RANKS = [
  { level: 1, name: "海滩漫步者", icon: <Shell size={10} />, color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200" },
  { level: 2, name: "浅滩摸鱼手", icon: <Waves size={10} />, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  { level: 3, name: "茶歇守卫官", icon: <Coffee size={10} />, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  { level: 4, name: "划水见习生", icon: <Wind size={10} />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { level: 5, name: "资深舵手", icon: <Compass size={10} />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { level: 6, name: "隐身巡航员", icon: <Ghost size={10} />, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  { level: 7, name: "风暴避难者", icon: <Anchor size={10} />, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  { level: 8, name: "极速快艇王", icon: <Zap size={10} />, color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  { level: 9, name: "深海霸主", icon: <Ship size={10} />, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  { level: 10, name: "深海大懒兽", icon: <Crown size={10} />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
];

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
];

const App = () => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(PRESET_AVATARS[0]);
  const fileInputRef = useRef(null);
  
  // 固定展示为 Lv.9 深海霸主
  const currentRank = RANKS[8]; 
  const checkInDays = 10;

  // 模拟上传头像
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 模拟获取微信头像
  const handleFetchWechatAvatar = () => {
    setCurrentAvatar("https://api.dicebear.com/7.x/pixel-art/svg?seed=wechat");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative">
      
      {/* Header */}
      <header className="pt-10 px-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600 shadow-lg shadow-blue-200">
             <User size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">个人基地</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* 用户信息区域 */}
        <section className="px-6 py-6 bg-white border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div 
              className="relative group cursor-pointer flex-shrink-0"
              onClick={() => setShowAvatarModal(true)}
            >
              <div className={`w-16 h-16 rounded-2xl bg-white border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${currentRank.border}`}>
                <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera size={14} className="text-white drop-shadow-md" />
                </div>
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 p-1 rounded-lg border border-white shadow-sm ${currentRank.bg} ${currentRank.color}`}>
                {currentRank.icon}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg font-black text-slate-900 truncate">摸鱼小队长</h2>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentRank.bg} ${currentRank.color} ${currentRank.border}`}>
                  Lv.{currentRank.level} {currentRank.name}
                </div>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-bold border border-slate-100">
                  累计摸鱼打卡：<span className="text-blue-500 ml-1">{checkInDays}天</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 统一的功能控制面板 */}
        <div className="px-6 py-6 space-y-8">
          {/* 第一组：航行控制台 */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-3.5 bg-blue-600 rounded-full"></div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">航行控制台</h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
                <MenuButton 
                   icon={<User size={18} className="text-blue-500" />} 
                   title="基本信息设置" 
                   desc="修改航行昵称、薪资基数及工时"
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

          {/* 第二组：关于与社群 - 统一使用 MenuButton */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-3.5 bg-indigo-400 rounded-full"></div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">关于与社群</h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
                <MenuButton 
                   icon={<Users size={18} className="text-indigo-500" />} 
                   title="加入社群" 
                   desc="与万千舵手交流摸鱼心得"
                />
                <MenuButton 
                   icon={<Info size={18} className="text-slate-500" />} 
                   title="关于软件" 
                   desc="版本 v1.0.0 (Build 2026)"
                />
             </div>
          </div>

          {/* 第三组：存储管理 - 统一使用 MenuButton 且增加样式 */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-3.5 bg-slate-800 rounded-full"></div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">存储管理</h3>
             </div>
             <div className="grid grid-cols-1 gap-3">
                <MenuButton 
                   icon={<Database size={18} className="text-amber-500" />} 
                   title="数据同步中心" 
                   desc="管理本地备份、云端同步与隐私"
                   highlight
                />
             </div>
          </div>
        </div>
      </main>

      {/* 隐藏的文件上传 Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload}
      />

      {/* 头像更换弹窗 */}
      {showAvatarModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center px-4 pb-24 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
           <div className="w-full bg-white rounded-[2.5rem] shadow-2xl p-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-5">
                 <div>
                   <h4 className="text-lg font-black text-slate-900 tracking-tight">修改头像</h4>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Change Identity</p>
                 </div>
                 <button onClick={() => setShowAvatarModal(false)} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-rose-500 transition-colors">
                   <X size={18} />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={handleFetchWechatAvatar}
                  className="flex items-center justify-center gap-2 py-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95"
                >
                  <MessageCircle size={18} />
                  <span className="text-xs font-bold">微信头像</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center justify-center gap-2 py-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all active:scale-95"
                >
                  <Camera size={18} />
                  <span className="text-xs font-bold">上传图片</span>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-3 px-1 tracking-wider">预设形象</p>
                <div className="grid grid-cols-6 gap-2 mb-6">
                   {PRESET_AVATARS.map((url, i) => (
                     <div 
                      key={i}
                      onClick={() => setCurrentAvatar(url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group active:scale-95 ${currentAvatar === url ? 'border-blue-600' : 'border-slate-50 opacity-60 hover:opacity-100'}`}
                     >
                       <img src={url} alt={`preset-${i}`} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
              </div>

              <button onClick={() => setShowAvatarModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 transition-colors active:scale-95 shadow-lg">
                确认修改
              </button>
           </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-10 z-20 shadow-2xl">
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

const MenuButton = ({ icon, title, desc, badge, highlight = false }) => (
  <button className={`group flex items-center justify-between p-4 border rounded-2xl transition-all active:scale-[0.99] ${highlight ? 'bg-slate-900 border-slate-800 text-white shadow-xl shadow-slate-200' : 'bg-white border-slate-100 shadow-sm hover:border-blue-100 hover:shadow-md'}`}>
    <div className="flex items-center gap-3.5 text-left">
      <div className={`p-3 rounded-xl transition-all ${highlight ? 'bg-white/10 group-hover:bg-white/20' : 'bg-slate-50 group-hover:bg-blue-50'}`}>
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${highlight ? 'text-white' : 'text-slate-800'}`}>{title}</span>
          {badge && (
            <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black min-w-[16px] text-center shadow-sm">
              {badge}
            </span>
          )}
        </div>
        <p className={`text-[10px] mt-0.5 font-medium leading-tight ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>{desc}</p>
      </div>
    </div>
    <ChevronRight size={16} className={`${highlight ? 'text-slate-600' : 'text-slate-300'} group-hover:translate-x-1 transition-all group-hover:text-blue-500`} />
  </button>
);

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? '' : 'opacity-30 hover:opacity-100'}`}>
    <div className={`${active ? 'text-blue-600 scale-110' : 'text-slate-900'}`}>
      {icon}
    </div>
    <span className={`text-[9px] font-bold tracking-tight ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </button>
);

export default App;