import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Database,
  HardDrive,
  Cloud,
  Download,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  X,
  Info,
  ArrowRightLeft,
  Loader2
} from 'lucide-react';

const App = () => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [storageUsed, setStorageUsed] = useState(1.2); // 模拟已使用 1.2MB

  // 模拟导出逻辑
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 2000);
  };

  // 模拟重置逻辑
  const handleReset = () => {
    setStorageUsed(0);
    setShowResetModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      {/* 头部：航行导航栏 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between">
        <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-black tracking-tight text-slate-900">数据管理中心</h1>
        <div className="w-10"></div> 
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        
        {/* 栏目 1：存储指标 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">存储指标</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* 本地存储卡片 */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <HardDrive size={22} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">本地空间</p>
                  <p className="text-xl font-black text-slate-900 tabular-nums">{storageUsed.toFixed(1)} <span className="text-xs">MB</span></p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">航行数据占比</span>
                  <span className="text-blue-600">{(storageUsed / 10 * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-50">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                    style={{ width: `${(storageUsed / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <p className="text-[9px] text-slate-400 font-medium">总容量限制 10.0 MB</p>
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    <span className="text-[9px] text-emerald-600 font-bold uppercase">安全加密中</span>
                  </div>
                </div>
              </div>
              
              {/* 装饰背景 */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-colors"></div>
            </div>

            {/* 云端存储卡片 */}
            <div className="bg-slate-100/50 border border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center group transition-all hover:bg-slate-100">
               <div className="p-3 bg-white rounded-2xl text-slate-300 mb-3 shadow-sm group-hover:scale-110 transition-transform">
                 <Cloud size={22} />
               </div>
               <h4 className="text-sm font-bold text-slate-400">云端同步中心</h4>
               <p className="text-[10px] text-slate-400 mt-1 font-medium tracking-tight">即将开启跨设备多端航行同步</p>
               <span className="mt-3 px-3 py-1 bg-white border border-slate-200 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">敬请期待</span>
            </div>
          </div>
        </section>

        {/* 栏目 2：核心操作 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-4 bg-slate-800 rounded-full"></div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">核心操作</h3>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            {/* 导出按钮 */}
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all border-b border-slate-50 active:bg-blue-50 group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl transition-colors ${exportSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                  {isExporting ? <Loader2 size={18} className="animate-spin" /> : exportSuccess ? <CheckCircle2 size={18} /> : <Download size={18} />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">{exportSuccess ? '导出成功' : '导出备份数据'}</p>
                  <p className="text-[10px] text-slate-400 font-medium">生成 JSON 格式航行日志副本</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isExporting && <span className="text-[10px] font-black text-blue-600 animate-pulse">处理中</span>}
                {!isExporting && !exportSuccess && <ArrowRightLeft size={14} className="text-slate-300 group-hover:text-blue-500" />}
              </div>
            </button>

            {/* 重置按钮 */}
            <button 
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center justify-between p-5 hover:bg-rose-50 transition-all active:bg-rose-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl group-hover:bg-rose-100 transition-colors">
                  <Trash2 size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-rose-600">重置所有数据</p>
                  <p className="text-[10px] text-rose-400 font-medium">擦除所有本地缓存与航行记录</p>
                </div>
              </div>
              <div className="px-2 py-1 bg-rose-100 text-rose-600 text-[8px] font-black rounded-md uppercase opacity-0 group-hover:opacity-100 transition-opacity">危险操作</div>
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-start">
            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
              温馨提示：薪潮涌动尊重您的隐私。所有数据均优先存储于您的设备本地，重置操作不可撤销，请在清理前确保已完成必要备份。
            </p>
          </div>
        </section>

      </main>

      {/* 重置确认弹窗 */}
      {showResetModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-[2.5rem] shadow-2xl p-8 space-y-6 scale-up-center">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center animate-bounce">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">确定要清空航程吗</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">
                  此操作将永久删除您的个人配置、任务进度及薪资记录
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-200 transition-colors"
              >
                取消保留
              </button>
              <button 
                onClick={handleReset}
                className="py-4 bg-rose-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-95"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { display: none; }
        .scale-up-center {
          animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        }
        @keyframes scale-up-center {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;