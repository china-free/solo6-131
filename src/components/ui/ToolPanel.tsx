import { Sun, Flame, Layers3, Grid3X3, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { ToolType } from '@/data/paintingData';

interface ToolDef {
  id: ToolType;
  label: string;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  description: string;
}

const TOOLS: ToolDef[] = [
  {
    id: 'uv',
    label: '紫外扫描',
    sub: 'UV Light',
    icon: <Sun size={28} strokeWidth={1.6} />,
    accent: 'from-purple-400 to-fuchsia-600',
    description: '365nm 紫外线灯，诱导荧光颜料发光',
  },
  {
    id: 'ir',
    label: '红外透射',
    sub: 'IR Reflectography',
    icon: <Flame size={28} strokeWidth={1.6} />,
    accent: 'from-red-400 to-orange-600',
    description: '1000nm 红外扫描，穿透清漆揭示碳稿',
  },
  {
    id: 'solvent',
    label: '溶剂凝胶',
    sub: 'Solvent Gel',
    icon: <RotateCcw size={28} strokeWidth={1.6} className="animate-spin-slow" />,
    accent: 'from-emerald-400 to-teal-600',
    description: '乙醇-丙酮凝胶，逐步溶解老化清漆',
  },
  {
    id: 'stack',
    label: '图层叠合',
    sub: 'Layer Stacking',
    icon: <Layers3 size={28} strokeWidth={1.6} />,
    accent: 'from-cyan-400 to-blue-600',
    description: '以 XOR 差异模式叠合 UV+IR+星图',
  },
  {
    id: 'grid',
    label: '透视网格',
    sub: 'Perspective Grid',
    icon: <Grid3X3 size={28} strokeWidth={1.6} />,
    accent: 'from-amber-400 to-yellow-600',
    description: '显示 IR 底稿的坐标网格与消失点标注',
  },
];

export default function ToolPanel() {
  const currentTool = useGameStore((s) => s.currentTool);
  const setTool = useGameStore((s) => s.setTool);
  const solventProgress = useGameStore((s) => s.solventProgress);

  return (
    <div className="w-32 flex flex-col items-center gap-5 py-6 px-3">
      <div className="text-center">
        <div className="font-cinzel text-sm tracking-widest text-museum-brass-200 text-emboss">
          TOOLS
        </div>
        <div className="font-chinese-hand text-lg text-museum-brass-100 mt-1">
          修复工具
        </div>
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-museum-brass-300 to-transparent mx-auto mt-2" />
      </div>

      {TOOLS.map((tool) => {
        const isActive = currentTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`brass-btn w-16 h-16 flex items-center justify-center relative group ${
              isActive ? 'active' : ''
            }`}
            title={`${tool.label} — ${tool.description}`}
          >
            {isActive && (
              <div
                className={`absolute -inset-2 rounded-full bg-gradient-to-br ${tool.accent} opacity-40 blur-md animate-pulse -z-10`}
              />
            )}
            <div
              className={`${
                isActive ? 'text-white drop-shadow-lg' : 'text-museum-wood-800'
              } transition-all`}
            >
              {tool.icon}
            </div>

            {isActive && (
              <div
                className={`absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-10 rounded-full bg-gradient-to-b ${tool.accent} shadow-lg`}
              />
            )}

            <div className="absolute left-full ml-5 px-4 py-2 bg-museum-wood-900/95 border border-museum-brass-400/50 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 w-64 text-left">
              <div className="font-cinzel text-sm text-museum-brass-200 tracking-wider">
                {tool.sub}
              </div>
              <div className="font-chinese-hand text-base text-museum-parchment -mt-1">
                {tool.label}
              </div>
              <div className="text-xs text-museum-brass-100/70 font-cormorant mt-1 leading-snug">
                {tool.description}
              </div>
            </div>
          </button>
        );
      })}

      <div className="mt-4 w-full px-2">
        <div className="font-cinzel text-[10px] tracking-widest text-museum-brass-200/80 text-center mb-1">
          SOLVENT
        </div>
        <div className="h-2 w-full bg-museum-wood-900 rounded-full overflow-hidden border border-museum-brass-500/30">
          <div
            className="h-full bg-gradient-to-r from-emerald-700 via-emerald-400 to-emerald-300 transition-all duration-500 relative"
            style={{ width: `${solventProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <div className="text-center text-[10px] text-museum-brass-100/60 mt-1 font-cinzel">
          {solventProgress.toFixed(0)}% dissolved
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={() => setTool('none')}
          className={`px-4 py-1.5 rounded-full border text-xs font-cinzel tracking-wider transition-all ${
            currentTool === 'none'
              ? 'bg-museum-brass-400 text-museum-wood-800 border-museum-brass-200'
              : 'border-museum-brass-400/40 text-museum-brass-100/70 hover:bg-museum-brass-400/10'
          }`}
        >
          NO TOOL
        </button>
      </div>
    </div>
  );
}
