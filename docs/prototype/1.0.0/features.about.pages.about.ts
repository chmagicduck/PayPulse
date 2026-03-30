import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Heart, 
  Anchor, 
  Compass,
  CheckCircle2,
  Cpu
} from 'lucide-react';

// 版本数据结构
const changelog = {
  appName: '薪潮涌动',
  appSlogan: '波涛之下，自有薪意',
  currentVersion: '1.0.0',
  releases: [
    {
      version: '1.0.0',
      date: '2026年03月18日',
      title: '正式启航：深海探索开启',
      description: '薪潮涌动 v1.0.0 正式发布。我们致力于为每位在职海域中穿行的“舵手”提供最精准的动力计算与情绪摸鱼港。',
      features: [
        '【领潮中心】实时掌控薪酬水位与加薪洋流',
        '【个人基地】全维度航行数据建模与等级体系',
        '【动力系统】基于心理学的摸鱼效率平衡算法',
        '【纪念日】首创职场重要节点纪念系统'
      ],
    },
  ],
};

const App = () => {
  const [activeTab, setActiveTab] = useState('changelog');

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
        <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-sm font-black tracking-widest text-slate-800">关于软件</h1>
        <div className="w-9"></div>
      </header>

      <main className="flex-1 overflow-y-auto pb-10">
        {/* 第一部分：品牌视觉 */}
        <section className="py-12 px-6 flex flex-col items-center text-center bg-gradient-to-b from-white to-slate-50">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center relative overflow-hidden group">
              <Anchor size={44} className="text-white z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-transparent"></div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500/20 rounded-full blur-xl"></div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black border-4 border-white shadow-lg">
              版本 {changelog.currentVersion}
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-2">{changelog.appName}</h2>
          <p className="text-xs font-bold text-slate-400 tracking-[0.2em] mb-4">{changelog.appSlogan}</p>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
              跨平台支持
            </span>
            <span className="px-3 py-1 bg-blue-50 rounded-full text-[10px] font-bold text-blue-600">
              数据加密保护
            </span>
          </div>
        </section>

        {/* 第二部分：切换选项卡 */}
        <section className="px-6 mb-6">
          <div className="bg-slate-100 p-1 rounded-2xl flex">
            <button 
              onClick={() => setActiveTab('changelog')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'changelog' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              更新日志
            </button>
            <button 
              onClick={() => setActiveTab('concept')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'concept' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              设计理念
            </button>
          </div>
        </section>

        {/* 第三部分：内容区域 */}
        <section className="px-6 min-h-[400px]">
          {activeTab === 'changelog' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              {changelog.releases.map((release, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-2">
                  {/* 时间轴点 */}
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-white bg-blue-600 shadow-sm"></div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-black text-slate-800">版本 {release.version}</span>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">{release.date}</span>
                    </div>
                    <p className="text-sm font-bold text-blue-600">{release.title}</p>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {release.description}
                    </p>
                    <div className="space-y-2">
                      {release.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-xs font-bold text-slate-700 leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
              <ConceptCard 
                icon={<Compass className="text-indigo-500" />}
                title="非线性时间观"
                desc="拒绝传统的打卡奴役，将职场时间重新定义为“航行周期”，关注成长的潮汐而非秒针的跳动。"
              />
              <ConceptCard 
                icon={<Cpu className="text-blue-500" />}
                title="算法驱动的关怀"
                desc="薪酬水位计算不仅是数字，更是通过大数据对行业动向的深度洞察，为你指引摸鱼港。"
              />
              <ConceptCard 
                icon={<Heart className="text-rose-500" />}
                title="人文摸鱼主义"
                desc="摸鱼不是目的，在繁忙的工作海洋中保持心理干爽才是我们的终极追求。"
              />
            </div>
          )}
        </section>

        {/* 第四部分：版权信息 */}
        <section className="mt-8 px-6">
          <div className="pt-8 border-t border-slate-100 flex flex-col items-center">
            <p className="text-[10px] text-slate-300 font-bold tracking-[0.3em] uppercase mb-2">
              薪潮涌动工作室 · 深度定制
            </p>
            <div className="flex items-center gap-2 text-[9px] font-black tracking-wider">
              <span className="text-slate-400">© 2026 版权所有</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-rose-500/70">盗版必究</span>
            </div>
          </div>
        </section>
      </main>

      {/* 底部渐变装饰 */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { display: none; }
        .animate-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// 理念卡片组件
const ConceptCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-blue-100 transition-all">
    <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="text-sm font-black text-slate-800 mb-2">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default App;