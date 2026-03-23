import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  Wallet, 
  Coffee, 
  ChevronLeft, 
  Moon,
  Sun,
  CheckCircle2,
  CalendarDays,
  Anchor,
  Compass
} from 'lucide-react';

const App = () => {
  // 状态管理
  const [formData, setFormData] = useState({
    nickname: "摸鱼小队长",
    birthday: "1995-06-15",
    careerStartDate: "2018-07-01",
    gender: "male",
    retirementAge: "60",
    expectedLifespan: "85",
    monthlySalary: "15000",
    payDay: "10",
    startTime: "09:00",
    endTime: "18:00",
    lunchBreakEnabled: false, // 默认关闭
    lunchStartTime: "12:00",
    lunchEndTime: "13:30",
    workMode: "double", // double, single-sat, single-sun, big-small
    isCurrentBigWeek: true
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const InputWrapper = ({ icon: Icon, label, children, tip, noMargin }) => (
    <div className={`space-y-1.5 ${noMargin ? '' : 'mb-4'}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
          <Icon size={12} className="text-blue-500/70" />
          {label}
        </label>
        {tip && <span className="text-[9px] text-slate-300 font-medium">{tip}</span>}
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );

  const SectionTitle = ({ title }) => (
    <div className="flex items-center gap-2 mb-4 px-1">
      <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
      <h3 className="text-[13px] font-black text-slate-800 tracking-tight">{title}</h3>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto overflow-hidden border-x border-slate-100 shadow-2xl relative leading-relaxed">
      
      {/* Header */}
      <header className="px-6 pt-10 pb-4 bg-white border-b border-slate-50 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-md font-black tracking-tight">航行档案设置</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 pb-28">
        
        {/* 提示 Banner - 紧凑化 */}
        <div className="mb-6 p-4 bg-blue-600 rounded-[1.5rem] text-white shadow-lg shadow-blue-100 flex gap-3 relative overflow-hidden">
          <div className="relative z-10 p-2 bg-white/20 rounded-xl backdrop-blur-md h-fit">
            <Compass size={18} className="text-white" />
          </div>
          <div className="relative z-10">
            <h4 className="text-xs font-bold">校准你的航向</h4>
            <p className="text-[10px] text-blue-100 mt-0.5 font-medium leading-relaxed opacity-90">
              输入坐标参数，自动核算摸鱼额度与退休倒计时。
            </p>
          </div>
          <Anchor size={60} className="absolute -right-2 -bottom-2 text-white/10 rotate-12" />
        </div>

        {/* Section 1: 身份识别 */}
        <div className="mb-6">
          <SectionTitle title="舵手身份识别" />
          
          <InputWrapper icon={User} label="专属代号">
            <input 
              type="text" 
              value={formData.nickname}
              onChange={(e) => updateField('nickname', e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
            />
          </InputWrapper>

          <div className="grid grid-cols-2 gap-3">
            <InputWrapper icon={Calendar} label="出厂日期">
              <input 
                type="date" 
                value={formData.birthday}
                onChange={(e) => updateField('birthday', e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none"
              />
            </InputWrapper>
            <InputWrapper icon={User} label="生命极向">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['male', 'female'].map(g => (
                  <button 
                    key={g}
                    onClick={() => updateField('gender', g)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${formData.gender === g ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                  >
                    {g === 'male' ? '男性' : '女性'}
                  </button>
                ))}
              </div>
            </InputWrapper>
          </div>
        </div>

        {/* Section 2: 工龄坐标 */}
        <div className="mb-6">
          <SectionTitle title="航程工龄坐标" />

          <InputWrapper icon={Briefcase} label="首次入港日期">
            <input 
              type="date" 
              value={formData.careerStartDate}
              onChange={(e) => updateField('careerStartDate', e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none"
            />
          </InputWrapper>

          <div className="grid grid-cols-2 gap-3">
            <InputWrapper icon={Moon} label="预期退役">
              <input 
                type="number" 
                value={formData.retirementAge}
                onChange={(e) => updateField('retirementAge', e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none"
              />
            </InputWrapper>
            <InputWrapper icon={Sun} label="预期寿命">
              <input 
                type="number" 
                value={formData.expectedLifespan}
                onChange={(e) => updateField('expectedLifespan', e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none"
              />
            </InputWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputWrapper icon={Wallet} label="月度燃料">
              <div className="relative">
                <input 
                  type="number" 
                  value={formData.monthlySalary}
                  onChange={(e) => updateField('monthlySalary', e.target.value)}
                  className="w-full bg-white border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">¥</span>
              </div>
            </InputWrapper>
            <InputWrapper icon={TrendingUp} label="燃料到账日">
              <input 
                type="number" 
                min="1" max="31"
                value={formData.payDay}
                onChange={(e) => updateField('payDay', e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none"
              />
            </InputWrapper>
          </div>
        </div>

        {/* Section 3: 航行排班 */}
        <div className="mb-6">
          <SectionTitle title="航行排班计划" />

          <InputWrapper icon={CalendarDays} label="航行周期模式">
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'double', label: '双休' },
                { id: 'single-sat', label: '休六' },
                { id: 'single-sun', label: '休日' },
                { id: 'big-small', label: '大小' }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => updateField('workMode', m.id)}
                  className={`py-2 px-1 rounded-xl text-[10px] font-black border transition-all ${formData.workMode === m.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </InputWrapper>

          {formData.workMode === 'big-small' && (
            <div className="mb-4 p-3 bg-slate-100 rounded-xl flex items-center justify-between animate-in">
              <span className="text-[11px] font-bold text-slate-500">本周是航行小周吗？</span>
              <button 
                onClick={() => updateField('isCurrentBigWeek', !formData.isCurrentBigWeek)}
                className={`w-10 h-5 rounded-full transition-colors relative ${formData.isCurrentBigWeek ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${formData.isCurrentBigWeek ? 'left-5.5' : 'left-0.5'}`}></div>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <InputWrapper icon={Clock} label="预计启航时间" noMargin>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => updateField('startTime', e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500"
              />
            </InputWrapper>
            <InputWrapper icon={Clock} label="预计归港时间" noMargin>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => updateField('endTime', e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500"
              />
            </InputWrapper>
          </div>

          {/* 午间补给时间 */}
          <div className="space-y-4 pt-2 border-t border-slate-100 mt-4">
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <Coffee size={12} className="text-blue-500/70" />
                午间补给时间
              </label>
              <button 
                onClick={() => updateField('lunchBreakEnabled', !formData.lunchBreakEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${formData.lunchBreakEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${formData.lunchBreakEnabled ? 'left-5.5' : 'left-0.5'}`}></div>
              </button>
            </div>

            {formData.lunchBreakEnabled && (
              <div className="grid grid-cols-2 gap-3 animate-in">
                <InputWrapper icon={Clock} label="补给开始" noMargin>
                  <input 
                    type="time" 
                    value={formData.lunchStartTime}
                    onChange={(e) => updateField('lunchStartTime', e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500"
                  />
                </InputWrapper>
                <InputWrapper icon={Clock} label="补给结束" noMargin>
                  <input 
                    type="time" 
                    value={formData.lunchEndTime}
                    onChange={(e) => updateField('lunchEndTime', e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500"
                  />
                </InputWrapper>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
        <button className="pointer-events-auto w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          <CheckCircle2 size={16} />
          同步航行参数
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; letter-spacing: -0.01em; }
        ::-webkit-scrollbar { display: none; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0.2;
          cursor: pointer;
        }
        @keyframes slide-up {
          from { transform: translateY(6px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;