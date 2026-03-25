import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  Calendar, 
  Heart, 
  Gift, 
  Star, 
  Trophy, 
  Coffee, 
  Rocket, 
  Briefcase, 
  Camera, 
  Music,
  Trash2,
  X,
  Map,
  User,
  Layers,
  PlusCircle
} from 'lucide-react';

// 预设图标库
const PRESET_ICONS = [
  { id: 'heart', icon: <Heart size={18} />, label: '浪漫', color: 'text-rose-500', bg: 'bg-rose-50', ring: 'ring-rose-100/50' },
  { id: 'gift', icon: <Gift size={18} />, label: '生日', color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-100/50' },
  { id: 'star', icon: <Star size={18} />, label: '重要', color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-100/50' },
  { id: 'trophy', icon: <Trophy size={18} />, label: '成就', color: 'text-yellow-600', bg: 'bg-yellow-50', ring: 'ring-yellow-100/50' },
  { id: 'briefcase', icon: <Briefcase size={18} />, label: '职场', color: 'text-indigo-500', bg: 'bg-indigo-50', ring: 'ring-indigo-100/50' },
  { id: 'rocket', icon: <Rocket size={18} />, label: '启航', color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-100/50' },
  { id: 'coffee', icon: <Coffee size={18} />, label: '生活', color: 'text-orange-500', bg: 'bg-orange-50', ring: 'ring-orange-100/50' },
  { id: 'camera', icon: <Camera size={18} />, label: '记忆', color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-100/50' },
  { id: 'music', icon: <Music size={18} />, label: '兴趣', color: 'text-pink-500', bg: 'bg-pink-50', ring: 'ring-pink-100/50' },
  { id: 'calendar', icon: <Calendar size={18} />, label: '常规', color: 'text-slate-500', bg: 'bg-slate-50', ring: 'ring-slate-100/50' },
];

// 固定预设的档案本分类
const FIXED_GROUPS = [
  { name: "全部", icon: <Layers size={14} />, color: "bg-slate-500", lightBg: "bg-slate-50" },
  { name: "纪念日本", icon: <Heart size={14} />, color: "bg-rose-500", lightBg: "bg-rose-50" },
  { name: "旅游本", icon: <Map size={14} />, color: "bg-amber-500", lightBg: "bg-amber-50" },
  { name: "人生本", icon: <User size={14} />, color: "bg-blue-500", lightBg: "bg-blue-50" },
  { name: "职场本", icon: <Briefcase size={14} />, color: "bg-indigo-500", lightBg: "bg-indigo-50" }
];

const INITIAL_DATA = [
  { id: 1, title: "结婚纪念日", date: "2023-10-20", group: "纪念日本", isAnniversary: true, iconId: 'heart' },
  { id: 2, title: "西藏大冒险", date: "2024-05-12", group: "旅游本", isAnniversary: false, iconId: 'camera' },
  { id: 3, title: "拿到高级架构师证", date: "2022-07-15", group: "职场本", isAnniversary: false, iconId: 'trophy' },
];

const App = () => {
  const [coordinates, setCoordinates] = useState(INITIAL_DATA);
  const [selectedGroup, setSelectedGroup] = useState("全部");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    group: '纪念日本',
    isAnniversary: true,
    iconId: 'star'
  });

  const calculateInfo = (item) => {
    const target = new Date(item.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (item.isAnniversary) {
      const remaining = diffDays < 0 ? (365 + (diffDays % 365)) : diffDays;
      return { value: remaining, unit: '天后', isPast: false };
    } else {
      const isPast = diffDays < 0;
      return { value: Math.abs(diffDays), unit: isPast ? '天前' : '天后', isPast };
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.date) return;
    if (editingId) {
      setCoordinates(coordinates.map(c => c.id === editingId ? { ...formData } : c));
    } else {
      setCoordinates([{ ...formData, id: Date.now() }, ...coordinates]);
    }
    closeModal();
  };

  const handleDelete = () => {
    setCoordinates(coordinates.filter(c => c.id !== editingId));
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', date: '', group: selectedGroup === "全部" ? '纪念日本' : selectedGroup, isAnniversary: true, iconId: 'star' });
  };

  const filteredData = selectedGroup === "全部" 
    ? coordinates 
    : coordinates.filter(c => c.group === selectedGroup);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative font-sans">
      
      {/* Header */}
      <header className="px-6 pt-10 pb-4 bg-white sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-md font-black tracking-tight text-slate-800">航行档案设置</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 优化版：档案本分组选择器 (不置灰) */}
      <div className="px-6 py-6 overflow-x-auto bg-white border-b border-slate-100 flex gap-4 no-scrollbar shrink-0">
        {FIXED_GROUPS.map((g) => {
          const isActive = selectedGroup === g.name;
          return (
            <button
              key={g.name}
              onClick={() => setSelectedGroup(g.name)}
              className={`group relative flex flex-col items-center shrink-0 transition-all duration-500 ${isActive ? 'scale-110 z-10' : 'scale-90 opacity-90'}`}
            >
              <div className="relative w-20 h-24">
                {/* 背景装饰纸张 - 未选中时紧贴，选中时错位 */}
                <div className={`absolute inset-0 bg-white border border-slate-200 rounded-lg transition-all duration-500 ${
                  isActive ? 'translate-x-2 translate-y-2 opacity-100 shadow-sm' : 'translate-x-0 translate-y-0 opacity-0'
                }`} />
                
                {/* 档案本主体 */}
                <div className={`absolute inset-0 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center gap-2 ${
                  isActive 
                  ? `${g.lightBg} border-slate-800 shadow-xl -translate-y-1` 
                  : 'bg-white border-slate-100 shadow-sm'
                }`}>
                  {/* 书签装饰 - 始终保留色彩 */}
                  <div className={`absolute top-0 right-2 w-3 h-6 rounded-b-sm shadow-sm transition-all duration-300 ${g.color} ${isActive ? 'h-8' : 'h-5 opacity-70'}`} />
                  
                  <div className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-white shadow-sm scale-110' : 'bg-slate-50 opacity-80'}`}>
                    <div className={isActive ? 'text-slate-800' : 'text-slate-400'}>
                      {g.icon}
                    </div>
                  </div>
                  
                  <span className={`text-[10px] font-black tracking-tighter w-full px-1 text-center truncate ${isActive ? 'text-slate-900' : 'text-slate-500 font-bold'}`}>
                    {g.name}
                  </span>

                  {/* 侧边缝纫线效果 */}
                  <div className="absolute left-1.5 top-2 bottom-2 w-[1px] border-l border-dashed border-slate-200" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* List Area */}
      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-4 pb-12">
        {filteredData.map((item) => {
          const info = calculateInfo(item);
          const iconConfig = PRESET_ICONS.find(i => i.id === item.iconId) || PRESET_ICONS[2];
          
          return (
            <div 
              key={item.id} 
              onClick={() => handleEdit(item)}
              className="bg-white border border-slate-100 rounded-[1.25rem] px-5 py-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 ${iconConfig.bg} ${iconConfig.color} rounded-xl flex items-center justify-center ring-2 ${iconConfig.ring} transition-transform group-hover:scale-110`}>
                  {iconConfig.icon}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[15px] font-bold text-slate-800 leading-tight tracking-tight">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                      {item.date.replace(/-/g, '/')}
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                      {item.group}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black tracking-tighter tabular-nums ${info.isPast ? 'text-slate-300' : iconConfig.color}`}>
                  {info.value}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {info.unit}
                </span>
              </div>
            </div>
          );
        })}

        {/* 虚线新增区域 */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-6 rounded-[1.25rem] border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2 group mt-2"
        >
          <div className="p-2 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-400 group-hover:text-blue-600 transition-colors">
            <PlusCircle size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-black tracking-widest text-slate-400 group-hover:text-blue-600 uppercase">
            存入新档案卡片
          </span>
        </button>

        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-10 text-slate-300">
             <Star size={30} strokeWidth={1.5} className="mb-2 opacity-20" />
             <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">档案本虚位以待</p>
          </div>
        )}
      </main>

      {/* Editor Drawer */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="w-full bg-white rounded-t-[2.5rem] p-7 animate-in slide-in-from-bottom duration-300 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black tracking-tight text-slate-800">{editingId ? '编辑档案' : '新增档案卡片'}</h2>
              <button onClick={closeModal} className="p-2 bg-slate-50 rounded-full text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">标识图标</label>
                <div className="grid grid-cols-5 gap-2.5">
                  {PRESET_ICONS.map(i => (
                    <button
                      key={i.id}
                      onClick={() => setFormData({...formData, iconId: i.id})}
                      className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${
                        formData.iconId === i.id ? `${i.bg} ${i.color} ring-2 ring-offset-2 ring-slate-200 scale-95` : 'bg-slate-50 text-slate-300'
                      }`}
                    >
                      {i.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">档案名称</label>
                <input 
                  type="text" 
                  placeholder="记录此刻的意义..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 ring-blue-500 transition-all outline-none shadow-inner"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">发生日期</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] shadow-inner">
                   <div>
                      <p className="text-xs font-black">周年提醒模式</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight italic">Anniversary Mode</p>
                   </div>
                   <button 
                    onClick={() => setFormData({...formData, isAnniversary: !formData.isAnniversary})}
                    className={`w-11 h-6 rounded-full transition-all relative ${formData.isAnniversary ? 'bg-blue-600' : 'bg-slate-200'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isAnniversary ? 'left-6' : 'left-1'}`} />
                   </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">存入档案本</label>
                  <select 
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner appearance-none"
                    value={formData.group}
                    onChange={e => setFormData({...formData, group: e.target.value})}
                  >
                    {FIXED_GROUPS.filter(g => g.name !== "全部").map(g => (
                      <option key={g.name} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {editingId && (
                  <button 
                    onClick={handleDelete}
                    className="p-4 bg-rose-50 text-rose-500 rounded-[1.5rem] hover:bg-rose-100 transition-colors active:scale-95"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  {editingId ? '保存修改' : '确认录入'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { display: none; }
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;