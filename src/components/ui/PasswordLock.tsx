import { Lock, Check, X, ChevronUp, ChevronDown, RotateCw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useClueStore } from '@/store/clueStore';
import { PASSWORD_LOGIC, PASSWORD_ANSWER } from '@/data/paintingData';

export default function PasswordLock() {
  const {
    passwordInput,
    setPasswordDigit,
    checkPassword,
    attempts,
    wrongAttempt,
    isVictory,
    resetGame,
  } = useGameStore();
  const discoveredCount = useClueStore((s) => s.discoveredCount);

  const totalCount = 10;
  void PASSWORD_ANSWER;

  const inc = (i: number) => {
    const cur = passwordInput[i] === '-' ? 0 : parseInt(passwordInput[i], 10);
    setPasswordDigit(i, String((cur + 1) % 10));
  };
  const dec = (i: number) => {
    const cur = passwordInput[i] === '-' ? 9 : parseInt(passwordInput[i], 10);
    setPasswordDigit(i, String((cur + 9) % 10));
  };

  return (
    <div
      className={`relative wood-frame px-8 py-5 rounded-xl transition-all duration-500 ${
        wrongAttempt ? 'animate-pulse' : ''
      }`}
      style={{
        boxShadow: wrongAttempt
          ? '0 0 40px rgba(229,57,53,0.6), 0 10px 40px rgba(0,0,0,0.5)'
          : isVictory
          ? '0 0 50px rgba(212,175,55,0.8), 0 10px 40px rgba(0,0,0,0.5)'
          : '0 10px 40px rgba(0,0,0,0.5)',
      }}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-14 h-14 rounded-full gold-plaque flex items-center justify-center ${
              isVictory ? 'animate-pulse' : ''
            }`}
          >
            <Lock
              size={26}
              className={`${
                isVictory ? 'text-emerald-700' : 'text-museum-wood-700'
              } transition-colors`}
              strokeWidth={1.8}
            />
          </div>
          <div>
            <div className="font-cinzel text-xs tracking-[0.25em] text-museum-brass-100 text-emboss">
              PASSWORD VAULT · MDXXV
            </div>
            <div className="font-chinese-hand text-xl text-museum-parchment -mt-1">
              暗格密码锁 · 四位数字
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-museum-brass-100/60 font-cinzel tracking-wider">
                线索收集: {discoveredCount}/{totalCount}
              </span>
              <span className="text-[10px] text-museum-brass-100/60 font-cinzel tracking-wider">
                尝试次数: {attempts}
              </span>
              {wrongAttempt && (
                <span className="flex items-center gap-1 text-red-400 text-xs font-cinzel">
                  <X size={12} /> 密码错误
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <button
                onClick={() => inc(i)}
                disabled={isVictory}
                className="text-museum-brass-200 hover:text-museum-brass-100 disabled:opacity-30 transition-colors p-0.5"
              >
                <ChevronUp size={18} strokeWidth={2.5} />
              </button>

              <div
                className={`password-wheel w-16 h-20 flex items-center justify-center rounded-lg relative overflow-hidden ${
                  wrongAttempt ? 'ring-2 ring-red-500/60' : ''
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-museum-wood-900/90 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-museum-wood-900/90 to-transparent pointer-events-none" />
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-museum-brass-300/50" />
                <span
                  className={`font-cinzel text-4xl tracking-widest ${
                    isVictory
                      ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(105,240,174,0.6)]'
                      : 'text-museum-brass-100'
                  }`}
                >
                  {passwordInput[i]}
                </span>
              </div>

              <button
                onClick={() => dec(i)}
                disabled={isVictory}
                className="text-museum-brass-200 hover:text-museum-brass-100 disabled:opacity-30 transition-colors p-0.5"
              >
                <ChevronDown size={18} strokeWidth={2.5} />
              </button>

              <div className="mt-2 font-cinzel text-[10px] tracking-widest text-museum-brass-200/50">
                #{i + 1}
              </div>
              <div className="w-8 h-px bg-museum-brass-400/30 my-1" />
              <div
                className="text-[9px] font-cormorant italic text-museum-brass-200/40 max-w-[4rem] text-center leading-tight"
                dangerouslySetInnerHTML={{ __html: PASSWORD_LOGIC[i].replace(/第.*位 = /, '') }}
              />
            </div>
          ))}

          <div className="flex flex-col gap-2 ml-4">
            <button
              onClick={() => checkPassword()}
              disabled={isVictory || passwordInput.some((d) => d === '-')}
              className={`relative gold-plaque px-6 py-4 rounded-lg flex items-center gap-2 font-cinzel text-sm tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                isVictory
                  ? 'text-emerald-800'
                  : 'text-museum-wood-700 hover:scale-[1.03] active:scale-[0.98]'
              }`}
            >
              {isVictory ? (
                <>
                  <Check size={20} strokeWidth={2.5} />
                  UNLOCKED
                </>
              ) : (
                <>
                  <Check size={18} strokeWidth={2.2} />
                  UNLOCK
                </>
              )}
            </button>

            <button
              onClick={resetGame}
              className="px-4 py-2 rounded-lg border border-museum-brass-400/40 text-museum-brass-100/70 font-cinzel text-[10px] tracking-widest hover:bg-museum-brass-400/10 hover:text-museum-brass-100 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCw size={12} />
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
