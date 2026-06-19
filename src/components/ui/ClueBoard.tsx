import { X, ChevronLeft, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { useClueStore } from '@/store/clueStore';
import { useGameStore } from '@/store/gameStore';
import { CLUE_HOTSPOTS } from '@/data/paintingData';

export default function ClueBoard() {
  const {
    clues,
    boardOpen,
    activeClue,
    toggleBoard,
    setActiveClue,
    manualNotes,
    setNote,
    getClueInfo,
    discoveredCount,
    totalCount,
  } = useClueStore();
  const showHint = useGameStore((s) => s.showHint);
  const setShowHint = useGameStore((s) => s.setShowHint);

  if (!boardOpen) {
    return (
      <button
        onClick={toggleBoard}
        className="h-full w-10 wood-frame flex items-center justify-center group"
      >
        <div className="writing-vertical text-museum-brass-200 font-cinzel text-xs tracking-[0.3em] rotate-180 opacity-80 group-hover:opacity-100">
          NOTES · 手札
        </div>
        <ChevronLeft className="absolute text-museum-brass-300" size={20} />
      </button>
    );
  }

  return (
    <div className="w-80 flex flex-col h-full parchment-panel border-l border-museum-brass-400/40">
      <div className="torn-top-edge pt-5 px-5 pb-4">
        <div className="flex items-start justify-between -mt-2">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-museum-wood-700" strokeWidth={1.8} />
              <span className="font-cinzel text-sm tracking-widest text-museum-wood-700">
                RESTORATION NOTES
              </span>
            </div>
            <div className="font-chinese-hand text-xl text-museum-wood-800 -mt-1">
              修复师手札
            </div>
          </div>
          <button
            onClick={toggleBoard}
            className="text-museum-wood-600 hover:text-museum-wood-800 transition-colors p-1"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="font-cormorant text-museum-wood-700 italic">
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="font-cinzel tracking-wider text-museum-brass-500">
            {discoveredCount} / {totalCount} CLUES
          </div>
        </div>

        <div className="mt-3 h-1.5 bg-museum-wood-700/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-museum-brass-400 via-museum-brass-300 to-museum-brass-200 transition-all duration-700"
            style={{ width: `${(discoveredCount / totalCount) * 100}%` }}
          />
        </div>

        <button
          onClick={() => setShowHint(!showHint)}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-1.5 rounded-full text-xs font-cinzel tracking-wider transition-all border ${
            showHint
              ? 'bg-museum-wood-700 text-museum-parchment border-museum-wood-600'
              : 'border-museum-wood-600/40 text-museum-wood-700 hover:bg-museum-wood-700/5'
          }`}
        >
          <Lightbulb size={14} />
          {showHint ? '隐藏解题提示' : '显示解题提示'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-5 pb-24 space-y-3">
        {CLUE_HOTSPOTS.map((hotspot) => {
          const discovered = clues.includes(hotspot.id);
          const isActive = activeClue === hotspot.id;
          const info = getClueInfo(hotspot.id);
          void info;

          return (
            <div
              key={hotspot.id}
              onClick={() => discovered && setActiveClue(hotspot.id)}
              className={`relative rounded-lg border p-3 transition-all duration-300 ${
                discovered
                  ? isActive
                    ? 'bg-museum-brass-100/60 border-museum-brass-400 shadow-md scale-[1.01]'
                    : 'bg-museum-wood-50/40 border-museum-brass-400/40 hover:bg-museum-brass-100/30 cursor-pointer'
                  : 'bg-museum-wood-700/5 border-museum-wood-700/20 opacity-70'
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-cinzel border ${
                    discovered
                      ? 'bg-museum-brass-400 text-museum-wood-800 border-museum-brass-300 shadow-sm'
                      : 'bg-museum-wood-700/20 text-museum-wood-600 border-museum-wood-700/30'
                  }`}
                >
                  {discovered ? '✓' : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-chinese-hand text-base leading-tight ${
                      discovered ? 'text-museum-ink' : 'text-museum-wood-600'
                    }`}
                  >
                    {discovered ? hotspot.title : '未发现线索'}
                  </div>
                  <div
                    className={`font-cinzel text-[10px] tracking-wider mt-0.5 ${
                      discovered ? 'text-museum-brass-500' : 'text-museum-wood-500/70'
                    }`}
                  >
                    {hotspot.requiredTools.map((t) => t.toUpperCase()).join(' + ')} ZONE
                  </div>

                  {discovered ? (
                    <div
                      className={`mt-2 overflow-hidden transition-all duration-300 ${
                        isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="font-cormorant text-sm leading-relaxed text-museum-wood-800 italic">
                        {hotspot.description}
                      </p>
                      {showHint && hotspot.hint && (
                        <div className="mt-2 p-2 rounded bg-museum-brass-100/70 border border-museum-brass-300/50">
                          <div className="text-[10px] font-cinzel tracking-wider text-museum-brass-500 mb-0.5">
                            ★ HINT
                          </div>
                          <p className="text-sm font-chinese-hand text-museum-wood-700 leading-snug">
                            {hotspot.hint}
                          </p>
                        </div>
                      )}
                      <textarea
                        value={manualNotes[hotspot.id] || ''}
                        onChange={(e) => setNote(hotspot.id, e.target.value)}
                        placeholder="（在此记录你的思考……）"
                        className="mt-2 w-full bg-transparent border-0 border-b border-museum-wood-700/30 focus:border-museum-brass-400 outline-none resize-none p-1 text-sm font-handwriting text-museum-wood-800 placeholder:text-museum-wood-600/40 min-h-[3rem]"
                      />
                    </div>
                  ) : (
                    <p className="font-handwriting text-xs text-museum-wood-600/60 mt-1 italic">
                      使用正确的工具在此区域扫描以发现……
                    </p>
                  )}
                </div>
                {discovered && !isActive && (
                  <X size={14} className="text-museum-wood-600/30" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-museum-brass-400/30 bg-museum-parchment/60 backdrop-blur">
        <div className="font-handwriting text-xs text-museum-wood-700 italic leading-relaxed">
          修复师箴言：「每一裂缝里都藏着时间，每一清漆下都埋着秘密。」
        </div>
        <div className="text-right font-cinzel text-[10px] tracking-widest text-museum-brass-500 mt-1">
          — Restoration Lab, MDXXV
        </div>
      </div>
    </div>
  );
}
