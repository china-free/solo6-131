import { useState } from 'react';
import { Info, X, Palette, MapPin, Calendar, Sparkles, ChevronRight, BookMarked } from 'lucide-react';
import { PAINTING_META } from '@/data/paintingData';
import { ART_HISTORY_EGGS, type ArtHistoryEgg } from '@/data/artHistory';
import { useClueStore } from '@/store/clueStore';

export default function ArtInfoCard() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'meta' | 'history'>('meta');
  const [selectedEgg, setSelectedEgg] = useState<ArtHistoryEgg | null>(null);
  const discoveredCount = useClueStore((s) => s.discoveredCount);

  const iconMap = {
    technique: Sparkles,
    history: Calendar,
    symbolism: Palette,
    artist: BookMarked,
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="gold-plaque px-4 py-2 rounded-lg flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        <Info size={16} className="text-museum-wood-700" strokeWidth={2} />
        <div className="text-left">
          <div className="font-cinzel text-[10px] tracking-[0.2em] text-museum-wood-700 leading-none">
            CATALOGUE NO.1525
          </div>
          <div className="font-chinese-hand text-sm text-museum-wood-800 -mt-0.5 leading-tight">
            作品信息
          </div>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="parchment-panel rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="torn-top-edge pt-6 px-8 pb-4 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-cinzel text-xs tracking-[0.3em] text-museum-brass-500">
                    MUSEO DI FIRENZE · INV. 1525 / MDXXV
                  </div>
                  <h2 className="font-cinzel text-2xl font-bold text-museum-ink mt-1 tracking-wide">
                    {PAINTING_META.titleEn}
                  </h2>
                  <div className="font-chinese-hand text-3xl text-museum-wood-800 -mt-1">
                    {PAINTING_META.title}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-museum-wood-700/10 text-museum-wood-700 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex gap-1 mt-5">
                {[
                  { id: 'meta', label: '藏品档案', en: 'Provenance' },
                  { id: 'history', label: '艺术史彩蛋', en: 'Art History' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as 'meta' | 'history')}
                    className={`px-5 py-2 rounded-t-xl border-b-2 transition-all ${
                      tab === t.id
                        ? 'bg-museum-brass-100/80 border-museum-brass-400 text-museum-ink'
                        : 'border-transparent text-museum-wood-600 hover:text-museum-wood-800 hover:bg-museum-brass-100/30'
                    }`}
                  >
                    <div className="font-chinese-hand text-lg leading-tight">{t.label}</div>
                    <div className="font-cinzel text-[10px] tracking-widest -mt-1">
                      {t.en}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scroll-hidden px-8 py-5">
              {tab === 'meta' ? (
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                  <MetaRow icon={<Palette size={18} />} label="作者 Artist" value={PAINTING_META.artist} />
                  <MetaRow icon={<Calendar size={18} />} label="年代 Year" value={PAINTING_META.year} />
                  <MetaRow icon={<MapPin size={18} />} label="来源 Provenance" value={PAINTING_META.origin} />
                  <MetaRow icon={<Sparkles size={18} />} label="尺寸 Dimensions" value={PAINTING_META.dimensions} />
                  <div className="md:col-span-2">
                    <MetaRow icon={<BookMarked size={18} />} label="材质 Medium" value={PAINTING_META.medium} />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <div className="font-cinzel text-xs tracking-widest text-museum-brass-500 mb-1">
                      修复档案 · RESTORATION LOG
                    </div>
                    <p className="font-cormorant text-museum-wood-800 leading-relaxed italic">
                      {PAINTING_META.provenance}
                    </p>
                  </div>
                  <div className="md:col-span-2 mt-2 p-4 rounded-xl bg-museum-brass-100/50 border border-museum-brass-300/50">
                    <div className="font-chinese-hand text-lg text-museum-wood-700">
                      修复师备注
                    </div>
                    <p className="font-handwriting text-sm text-museum-wood-800 mt-1 leading-relaxed">
                      画面清漆老化严重，呈琥珀色。多光谱扫描疑似存在多层层压绘制。建议：
                      UV/IR/X 光逐层记录后，谨慎进行溶剂法清漆去除。注意——本馆 2019 年记录中，
                      同期入藏的三件作品均有修改过的藏品编号，怀疑为二战期间的「回收艺术品」。
                    </p>
                    <div className="text-right font-cinzel text-[10px] tracking-widest text-museum-brass-500 mt-2">
                      — Dr. A. Restoration, 2026.06.20
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {ART_HISTORY_EGGS.map((egg, idx) => {
                    const unlocked = idx < discoveredCount + 3;
                    const Icon = iconMap[egg.category];
                    return (
                      <button
                        key={egg.id}
                        disabled={!unlocked}
                        onClick={() => unlocked && setSelectedEgg(egg)}
                        className={`text-left rounded-xl p-4 border transition-all ${
                          unlocked
                            ? 'bg-museum-wood-50/40 border-museum-brass-400/40 hover:bg-museum-brass-100/40 hover:border-museum-brass-400 cursor-pointer group'
                            : 'bg-museum-wood-700/5 border-museum-wood-700/20 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                unlocked
                                  ? 'bg-museum-brass-300/60 text-museum-wood-700'
                                  : 'bg-museum-wood-700/20 text-museum-wood-600'
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <div>
                              <div className="font-chinese-hand text-base text-museum-ink leading-tight">
                                {unlocked ? egg.title : '??? 未知档案'}
                              </div>
                              <div className="font-cinzel text-[10px] tracking-wider text-museum-brass-500 mt-0.5">
                                {egg.category.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          {unlocked && (
                            <ChevronRight
                              size={18}
                              className="text-museum-brass-400 group-hover:translate-x-0.5 transition-transform mt-1"
                            />
                          )}
                        </div>
                        {unlocked ? (
                          <p className="font-cormorant text-xs text-museum-wood-700 mt-2 leading-snug line-clamp-3 italic">
                            {egg.content}
                          </p>
                        ) : (
                          <p className="font-handwriting text-xs text-museum-wood-600/60 mt-2 italic">
                            收集更多线索以解锁……（{idx - discoveredCount - 2} 个线索差）
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {selectedEgg && (
            <div
              className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-10"
              onClick={() => setSelectedEgg(null)}
            >
              <div
                className="parchment-panel rounded-2xl max-w-2xl w-full p-8 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedEgg(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-museum-wood-700/10 text-museum-wood-700"
                >
                  <X size={20} />
                </button>
                <div className="font-cinzel text-xs tracking-[0.3em] text-museum-brass-500 mb-2">
                  {selectedEgg.category.toUpperCase()} · 艺术史档案
                </div>
                <h3 className="font-chinese-hand text-3xl text-museum-ink leading-tight">
                  {selectedEgg.title}
                </h3>
                <div className="w-20 h-px bg-gradient-to-r from-museum-brass-400 to-transparent my-4" />
                <p className="font-cormorant text-lg leading-relaxed text-museum-wood-800">
                  {selectedEgg.content}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-lg bg-museum-brass-300/50 flex items-center justify-center text-museum-wood-700 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-cinzel text-[10px] tracking-widest text-museum-brass-500">
          {label.toUpperCase()}
        </div>
        <div className="font-chinese-hand text-lg text-museum-ink leading-tight">{value}</div>
      </div>
    </div>
  );
}
