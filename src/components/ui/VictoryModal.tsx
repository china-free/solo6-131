import { useEffect, useState } from 'react';
import { Award, BookOpen, Sparkles, X, RotateCcw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useClueStore } from '@/store/clueStore';
import { VICTORY_TEXT } from '@/data/artHistory';
import { PASSWORD_ANSWER } from '@/data/paintingData';

export default function VictoryModal() {
  const isVictory = useGameStore((s) => s.isVictory);
  const attempts = useGameStore((s) => s.attempts);
  const discoveredCount = useClueStore((s) => s.discoveredCount);
  const resetGame = useGameStore((s) => s.resetGame);
  const [stage, setStage] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVictory) {
      setShow(true);
      setStage(0);
      const timers = [400, 1800, 3400, 5000].map((t) =>
        setTimeout(() => setStage((s) => Math.max(s, Math.floor(t / 1200) + 1)), t),
      );
      return () => timers.forEach(clearTimeout);
    } else {
      setShow(false);
    }
  }, [isVictory]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md animate-[fadeIn_0.6s_ease]" />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 5}px`,
              height: `${2 + Math.random() * 5}px`,
              background: `radial-gradient(circle, rgba(212,175,55,${0.5 + Math.random() * 0.5}) 0%, transparent 70%)`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-3xl">
        <div className="wood-frame rounded-3xl p-3 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
          <div className="parchment-panel rounded-[1.4rem] overflow-hidden">
            <div className="relative pt-12 pb-8 px-10">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-museum-brass-200/30 to-transparent pointer-events-none" />

              <button
                onClick={() => setShow(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full gold-plaque flex items-center justify-center text-museum-wood-700 hover:scale-105 active:scale-95 transition-transform z-10"
              >
                <X size={18} />
              </button>

              <div className="relative text-center">
                <div
                  className={`mx-auto w-24 h-24 rounded-full gold-plaque flex items-center justify-center mb-4 transition-all duration-700 ${
                    stage >= 0 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                  style={{ boxShadow: '0 0 60px rgba(212,175,55,0.7), inset 0 0 30px rgba(244,224,161,0.4)' }}
                >
                  <Award size={44} className="text-museum-wood-700" strokeWidth={1.5} />
                </div>

                <h2
                  className={`font-cinzel text-4xl font-bold text-museum-ink tracking-wide transition-all duration-700 delay-100 ${
                    stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  {VICTORY_TEXT.headline}
                </h2>
                <div
                  className={`font-chinese-hand text-3xl text-museum-wood-700 mt-1 transition-all duration-700 delay-200 ${
                    stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                >
                  {VICTORY_TEXT.subheadline}
                </div>

                <div
                  className={`mx-auto w-48 h-px bg-gradient-to-r from-transparent via-museum-brass-400 to-transparent my-6 transition-all duration-700 delay-300 ${
                    stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  }`}
                />

                <div
                  className={`inline-flex items-center gap-8 px-8 py-3 rounded-2xl bg-museum-brass-100/70 border border-museum-brass-300/60 mb-8 transition-all duration-700 delay-500 ${
                    stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                  }`}
                >
                  <Stat icon={<Sparkles size={16} />} label="PASSWORD" value={PASSWORD_ANSWER.join(' · ')} />
                  <Divider />
                  <Stat label="ATTEMPTS" value={String(attempts)} />
                  <Divider />
                  <Stat label="CLUES" value={`${discoveredCount}/10`} />
                </div>
              </div>

              <div
                className={`space-y-4 transition-all duration-1000 delay-700 ${
                  stage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {VICTORY_TEXT.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={`font-cormorant text-xl leading-relaxed text-museum-wood-800 ${
                      i === 1
                        ? 'text-center text-2xl text-museum-brass-500 font-semibold py-4 border-y border-museum-brass-300/50 italic'
                        : i === 2
                        ? 'text-center text-base text-museum-wood-600 italic font-sans -mt-3'
                        : ''
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div
                className={`mt-10 pt-6 border-t border-museum-brass-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 delay-1000 ${
                  stage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <div className="flex items-center gap-3 text-museum-wood-700">
                  <BookOpen size={20} />
                  <div>
                    <div className="font-chinese-hand text-lg">感谢游玩</div>
                    <div className="font-cinzel text-[11px] tracking-widest text-museum-brass-500 -mt-1">
                      THANKS FOR PLAYING
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShow(false);
                    resetGame();
                  }}
                  className="gold-plaque px-8 py-3 rounded-xl flex items-center gap-2 font-cinzel text-sm tracking-widest text-museum-wood-700 hover:scale-[1.03] active:scale-[0.97] transition-transform"
                >
                  <RotateCcw size={16} />
                  重新开始 · REPLAY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-museum-brass-500">{icon}</span>}
      <div className="text-left">
        <div className="font-cinzel text-[9px] tracking-[0.2em] text-museum-brass-500 leading-none">
          {label}
        </div>
        <div className="font-cinzel text-xl text-museum-wood-700 leading-tight">{value}</div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-10 bg-museum-brass-400/40" />;
}
