import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Coins, 
  Anchor, 
  Waves, 
  Zap, 
  Info,
  LayoutGrid,
  BarChart3,
  FlaskConical,
  User,
  Coffee
} from 'lucide-react';

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 1)); // 默认显示2024年9月
  const [selectedDate, setSelectedDate] = useState(15); // 默认选中15号

  // 模拟数据：节假日、补班、发薪日配置
  // status: 0-工作日, 1-法定节假日, 2-周末休息, 3-补班日, 4-发薪日
  const calendarData = {
    "2024-09": {
      1: { status: 2, label: "休" },
      7: { status: 2, label: "休" },
      8: { status: 2, label: "休" },
      14: { status: 3, label: "班" },
      15: { status: 1, label: "中秋" },
      16: { status: 1, label: "中秋" },
      17: { status: 1, label: "中秋" },
      21: { status: 2, label: "休" },
      22: { status: 2, label: "休" },
      28: { status: 2, label: "休" },
      29: { status: 3, label: "班" },
      10: { status: 4, label: "薪" }, // 假设10号发薪
    }
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const totalDays = daysInMonth(year, month);
  const startDay = startDayOfMonth(year, month);
  
  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  // 获取日期状态样式
  const getDayStyles = (day) => {
    const data = calendarData[monthStr]?.[day];
    if (!data) return "text-slate-700 hover:bg-slate-50";
    
    switch(data.status) {
      case 1: return "text-rose-500 font-bold bg-rose-50/50"; // 节假日
      case 2: return "text-emerald-500 font-bold bg-emerald-50/50"; // 周末
      case 3: return "text-slate-900 font-bold bg-slate-100"; // 补班
      case 4: return "text-amber-600 font-bold bg-amber-50 ring-2 ring-amber-200 ring-inset"; // 发薪
      default: return "text-slate-700 hover:bg-slate-50";
    }
  };

  const getStatusBadge = (day) => {
    const data = calendarData[monthStr]?.[day];
    if (!data) return null;
    return (
      <span className={`absolute -top-1 -right-1 text-[8px] px-1 rounded-md border border-white shadow-sm font-black
        ${data.status === 1 ? 'bg-rose-500 text-white' : 
          data.status === 2 ? 'bg-emerald-500 text-white' : 
          data.status === 3 ? 'bg-slate-800 text-white' : 
          data.status === 4 ? 'bg-amber-500 text-white animate-bounce' : ''}`}>
        {data.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      {/* 头部：航行导航栏 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between">
        <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-black tracking-tight text-slate-900">日历</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* 月份选择器 */}
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
              {year} <span className="text-blue-600">{monthNames[month]}</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Voyage Timeline</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-400">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-400">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 日历卡片 */}
        <section className="px-4">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
            {/* 星期头部 */}
            <div className="grid grid-cols-7 mb-4">
              {weekDays.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-y-3">
              {[...Array(startDay)].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {[...Array(totalDays)].map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate === day;
                return (
                  <div key={day} className="flex justify-center items-center">
                    <button 
                      onClick={() => setSelectedDate(day)}
                      className={`relative w-11 h-11 rounded-2xl flex items-center justify-center text-sm transition-all duration-300
                        ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 scale-110 z-10' : ''}
                        ${getDayStyles(day)}
                      `}
                    >
                      {day}
                      {getStatusBadge(day)}
                      {isSelected && <div className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full"></div>}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 图例说明 */}
            <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-y-3">
              <LegendItem icon={<Coins size={12} className="text-amber-500" />} label="薪" desc="发薪宝藏日" />
              <LegendItem icon={<Anchor size={12} className="text-rose-500" />} label="休" desc="法定摸鱼港" />
              <LegendItem icon={<Waves size={12} className="text-emerald-500" />} label="休" desc="浅滩休整日" />
              <LegendItem icon={<Zap size={12} className="text-slate-800" />} label="班" desc="强力补班航程" />
            </div>
          </div>
        </section>

        {/* 选中日期详情详情 */}
        <section className="px-6 mt-6">
          <div className="flex items-center gap-2 px-1 mb-3">
            <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">今日航行状态</h3>
          </div>
          
          <div className={`p-5 rounded-[2rem] border transition-all duration-500 ${
            calendarData[monthStr]?.[selectedDate]?.status === 1 ? 'bg-rose-50 border-rose-100' :
            calendarData[monthStr]?.[selectedDate]?.status === 4 ? 'bg-amber-50 border-amber-100' :
            'bg-white border-slate-100'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1">{month + 1}月{selectedDate}日 · 星期{(startDay + selectedDate - 1) % 7 === 0 ? '日' : (startDay + selectedDate - 1) % 7}</p>
                <h4 className="text-lg font-black text-slate-900">
                  {calendarData[monthStr]?.[selectedDate]?.status === 1 ? '摸鱼港：中秋佳节' :
                   calendarData[monthStr]?.[selectedDate]?.status === 4 ? '宝藏日：薪水到账' :
                   calendarData[monthStr]?.[selectedDate]?.status === 2 ? '浅滩休整中' :
                   calendarData[monthStr]?.[selectedDate]?.status === 3 ? '强力补班中' : '正常航行模式'}
                </h4>
              </div>
              <div className={`p-3 rounded-2xl ${
                calendarData[monthStr]?.[selectedDate]?.status === 1 ? 'bg-rose-500 text-white' :
                calendarData[monthStr]?.[selectedDate]?.status === 4 ? 'bg-amber-500 text-white' :
                'bg-blue-600 text-white'
              }`}>
                {calendarData[monthStr]?.[selectedDate]?.status === 4 ? <Coins size={20} /> : <Anchor size={20} />}
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 leading-relaxed font-medium">
              {calendarData[monthStr]?.[selectedDate]?.status === 4 ? '叮！检测到账户有大额能量补充，建议今日适当提高摸鱼质量以示庆祝。' :
               calendarData[monthStr]?.[selectedDate]?.status === 1 ? '检测到当前处于法定摸鱼港区域，所有的航行任务已自动挂起。' :
               '当前海域风平浪静，适合稳定航行。记得保持动力室正常运转，等待下一个宝藏日。'}
            </p>
          </div>
        </section>

        {/* 温馨提示 */}
        <section className="px-6 mt-4 pb-10">
          <div className="bg-slate-900 rounded-[1.8rem] p-4 flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-xl">
                <Info size={16} className="text-blue-400" />
             </div>
             <p className="text-[10px] text-slate-300 font-bold tracking-wide">
                距离下次发薪日还有 <span className="text-white text-xs underline decoration-blue-500 decoration-2 underline-offset-4">12天</span>，舵手请坚持住！
             </p>
          </div>
        </section>
      </main>

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
      `}</style>
    </div>
  );
};

const LegendItem = ({ icon, label, desc }) => (
  <div className="flex items-center gap-2">
    <div className="relative w-5 h-5 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
      {icon}
      <span className="absolute -top-1 -right-1 bg-white border border-slate-100 text-[6px] font-black px-0.5 rounded shadow-xs">{label}</span>
    </div>
    <span className="text-[10px] font-bold text-slate-500">{desc}</span>
  </div>
);

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? '' : 'opacity-40 hover:opacity-100'}`}>
    <div className={`${active ? 'text-blue-600 scale-110' : 'text-slate-900'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </button>
);

export default App;