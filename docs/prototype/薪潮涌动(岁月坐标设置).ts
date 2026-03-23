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
  ChevronRight,
  Trash2,
  X
} from 'lucide-react';

// 预设 10 种图标供选择
const PRESET_ICONS = [
  { id: 'heart', icon: <Heart size={20} />, label: '浪漫', color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'gift', icon: <Gift size={20} />, label: '生日', color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'star', icon: <Star size={20} />, label: '重要', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'trophy', icon: <Trophy size={20} />, label: '成就', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'briefcase', icon: <Briefcase size={20} />, label: '职场', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'rocket', icon: <Rocket size={20} />, label: '启航', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'coffee', icon: <Coffee size={20} />, label: '生活', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'camera', icon: <Camera size={20} />, label: '记忆', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'music', icon: <Music size={20} />, label: '兴趣', color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'calendar', icon: <Calendar size={20} />, label: '常规', color: 'text-slate-500', bg: 'bg-slate-50' },
];

const INITIAL_DATA = [
  { id: 1, title: "结婚纪念日", date: "2023-10-20", type: "solar", group: "生活印记", isAnniversary: true, iconId: 'heart' },
  { id: 2, title: "薪潮爆发日", date: "2024-09-30", type: "solar", group: "财富增长", isAnniversary: false, iconId: 'star' },
  { id: 3, title: "我的生日", date: "2024-12-05", type: "lunar", group: "生活印记", isAnniversary: true, iconId: 'gift' },
];

const GROUPS = ["全部", "职场生涯", "财富增长", "生活印记", "自定义"];

const App = () => {
  const [coordinates, setCoordinates] = useState(INITIAL_DATA);
  const [selectedGroup, setSelectedGroup] = useState("全部");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'solar',
    group: '职场生涯',
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
      // 周年提醒逻辑：如果是过去的日期，计算距离下一个周年的天数
      const remaining = diffDays < 0 ? (365 + (diffDays % 365)) : diffDays;
      return { label: `还有 ${remaining} 天`, isPast: false, days: remaining };
    } else {
      // 非周年提醒：展示已过或剩余
      const isPast = diffDays < 0;
      const days = Math.abs(diffDays);
      return { label: isPast ? `已过 ${days} 天` : `剩余 ${days} 天`, isPast, days };
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
    setFormData({ title: '', date: '', type: 'solar', group: '职场生涯', isAnniversary: true, iconId: 'star' });
  };

  const filteredData = selectedGroup === "全部" 
    ? coordinates 
    : coordinates.filter(c => c.group === selectedGroup);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative font-sans">
      
      {/* Header - 同步指定样式 */}
      <header className="px-6 pt-10 pb-4 bg-white border-b border-slate-50 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-md font-black tracking-tight text-slate-800">航行档案设置</h1>
          <div className="w-10 flex justify-end">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="text-blue-600 hover:scale-110 transition-transform"
             >
               <Plus size={22} />
             </button>
          </div>
        </div>
      </header>

      {/* Group Selector */}
      <div className="px-6 py-4 overflow-x-auto bg-white border-b border-slate-50 flex gap-2 no-scrollbar">
        {GROUPS.map(g => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all whitespace-nowrap tracking-wider uppercase ${
              selectedGroup === g 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* List Area */}
      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-3 pb-10">
        {filteredData.map((item) => {
          const info = calculateInfo(item);
          const iconConfig = PRESET_ICONS.find(i => i.id === item.iconId) || PRESET_ICONS[2];
          
          return (
            <div 
              key={item.id} 
              onClick={() => handleEdit(item)}
              className="bg-white border border-slate-100 p-4 rounded-[1.8rem] shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${iconConfig.bg} ${iconConfig.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {iconConfig.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-slate-400">
                      {item.date.split('-').slice(1).join('月') + '日'}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${item.type === 'solar' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-600'}`}>
                      {item.type === 'solar' ? '公历' : '农历'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-[13px] font-black italic tracking-tighter ${info.isPast ? 'text-slate-400' : 'text-blue-600'}`}>
                  {info.label}
                </span>
                <div className="flex items-center gap-1 mt-1 opacity-60">
                   <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{item.group}</span>
                   <ChevronRight size={10} className="text-slate-300" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-slate-300">
             <Star size={40} strokeWidth={1.5} className="mb-4 opacity-20" />
             <p className="text-xs font-bold tracking-widest uppercase text-slate-400">档案库为空</p>
          </div>
        )}
      </main>

      {/* Editor Drawer */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="w-full bg-white rounded-t-[2.5rem] p-7 animate-in slide-in-from-bottom duration-300 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black tracking-tight text-slate-800">{editingId ? '编辑档案' : '新增档案'}</h2>
              <button onClick={closeModal} className="p-2 bg-slate-50 rounded-full text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Icon Selector */}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">发生日期</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">历法</label>
                  <div className="flex bg-slate-50 p-1 rounded-2xl shadow-inner">
                    <button 
                      onClick={() => setFormData({...formData, type: 'solar'})}
                      className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${formData.type === 'solar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >公历</button>
                    <button 
                      onClick={() => setFormData({...formData, type: 'lunar'})}
                      className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${formData.type === 'lunar' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400'}`}
                    >农历</button>
                  </div>
                </div>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">分类归档</label>
                  <select 
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner appearance-none"
                    value={formData.group}
                    onChange={e => setFormData({...formData, group: e.target.value})}
                  >
                    {GROUPS.filter(g => g !== "全部").map(g => (
                      <option key={g} value={g}>{g}</option>
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
        .animate-in { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;