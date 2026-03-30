import React from 'react';
import {
  Users,
  MessageSquare,
  Zap,
  ChevronRight,
  ArrowLeft,
  Share2,
  Globe,
  Star,
  LayoutGrid,
  BarChart3,
  FlaskConical,
  User,
  Coffee,
  Rocket,
  Wrench,
  Anchor
} from 'lucide-react';

const App = () => {
  const communityStats = [
    { label: "活跃舵手", value: "12,840+", icon: <Users size={14} /> },
    { label: "摸鱼心得", value: "85.6k", icon: <MessageSquare size={14} /> },
    { label: "覆盖航线", value: "32 条", icon: <Globe size={14} /> }
  ];

  const benefits = [
    {
      title: "摸鱼心得交流",
      desc: "万千资深舵手在线，分享应对“职场风暴”的实战技巧与带薪假情报。",
      icon: <Coffee className="text-orange-500" />,
      color: "bg-orange-50"
    },
    {
      title: "新功能抢先看",
      desc: "优先获得内测资格，提前体验最新的航行工具与动力补给。",
      icon: <Rocket className="text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "需求直通车",
      desc: "你的每一个想法都直达核心港口，参与定义未来的航行方式。",
      icon: <Wrench className="text-emerald-500" />,
      color: "bg-emerald-50"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      {/* 顶部导航栏 */}
      <header className="h-16 flex items-center justify-between px-6 bg-white/70 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100">
        <button className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-base font-black tracking-tight text-slate-900">加入社区</h1>
        <button className="p-2 -mr-2 hover:bg-slate-100 rounded-full transition-colors">
          <Share2 size={20} className="text-slate-600" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* 英雄头图区域 */}
        <section className="relative px-6 pt-10 pb-12 overflow-hidden bg-white">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-full mb-4">
              <Star size={12} className="text-white fill-white" />
              <span className="text-[10px] font-black text-white tracking-widest">薪潮涌动官方社群</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-[1.1] mb-3">
              汇聚全球舵手<br />
              <span className="text-blue-600">共创摸鱼盛世</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 mb-8">加入社区，让每一次航行都不再孤单。与万千舵手一起抵御职场风暴。</p>
            
            {/* 核心数据展示 */}
            <div className="flex gap-4">
              {communityStats.map((stat, i) => (
                <div key={i} className="flex-1 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    {stat.icon}
                    <span className="text-[8px] font-bold tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-sm font-black text-slate-800">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* 装饰性背景 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -mr-32 -mt-16 -z-0"></div>
        </section>

        {/* 核心进群入口 */}
        <section className="px-6 -mt-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Anchor size={20} className="text-blue-500" />
                  <h3 className="text-xl font-black tracking-tight">深海摸鱼港</h3>
                </div>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest">官方旗舰社群</p>
              </div>

              <div className="py-2">
                 <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/30">
                    <span className="text-sm font-black tracking-widest">立即加入微信群聊</span>
                    <ChevronRight size={18} />
                 </button>
              </div>
              
              <p className="text-center text-[9px] text-slate-500 font-medium">
                点击上方按钮将直接跳转至微信加入群聊页面
              </p>
            </div>

            {/* 背景动态流光 */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.15),transparent)] pointer-events-none"></div>
          </div>
        </section>

        {/* 社群权益介绍 */}
        <section className="px-6 pt-12 pb-20 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">社群专属权益</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {benefits.map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-[2rem] group hover:border-blue-100 transition-all">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                  {React.cloneElement(item.icon, { size: 22 })}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-10 z-20 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center px-2">
          <NavItem icon={<LayoutGrid size={22} />} label="领潮中心" />
          <NavItem icon={<BarChart3 size={22} />} label="航行报告" />
          <NavItem icon={<FlaskConical size={22} />} label="动力舱" />
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

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${active ? '' : 'opacity-40 hover:opacity-100'}`}>
    <div className={`${active ? 'text-blue-600 scale-110' : 'text-slate-900'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold tracking-tight whitespace-nowrap ${active ? 'text-blue-600' : 'text-slate-900'}`}>{label}</span>
  </button>
);

export default App;