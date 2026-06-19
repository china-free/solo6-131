import ToolPanel from '@/components/ui/ToolPanel';
import ClueBoard from '@/components/ui/ClueBoard';
import PasswordLock from '@/components/ui/PasswordLock';
import ArtInfoCard from '@/components/ui/ArtInfoCard';
import VictoryModal from '@/components/ui/VictoryModal';
import LayerEngine from '@/components/canvas/LayerEngine';
import { useGameStore } from '@/store/gameStore';
import { useClueStore } from '@/store/clueStore';

export default function GameLayout() {
  const currentTool = useGameStore((s) => s.currentTool);
  const solventProgress = useGameStore((s) => s.solventProgress);
  const discoveredCount = useClueStore((s) => s.discoveredCount);

  const toolColorMap: Record<string, string> = {
    uv: 'rgba(224,64,251,0.18)',
    ir: 'rgba(255,82,82,0.18)',
    solvent: 'rgba(105,240,174,0.18)',
    stack: 'rgba(100,200,255,0.18)',
    grid: 'rgba(255,200,80,0.18)',
    none: 'transparent',
  };

  return (
    <div className="min-h-screen film-grain vignette flex flex-col">
      <header className="relative wood-frame border-b-2 border-museum-brass-400/50 px-6 py-4">
        <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl gold-plaque flex items-center justify-center overflow-hidden">
                <span className="font-cinzel text-2xl font-bold text-museum-wood-700">
                  M
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-museum-brass-500 border-2 border-museum-wood-700 flex items-center justify-center">
                <span className="font-cinzel text-[8px] font-bold text-museum-parchment">
                  1525
                </span>
              </div>
            </div>
            <div>
              <div className="font-cinzel text-xs tracking-[0.3em] text-museum-brass-200 text-emboss">
                MUSEO DI RESTAURO · OPIFICIO DELLE ARTI
              </div>
              <h1 className="font-chinese-hand text-2xl text-museum-parchment leading-tight">
                佛罗伦萨艺术品修复研究所 · 绝密档案 No.1525
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-5 py-2 rounded-full border border-museum-brass-400/40 bg-museum-wood-900/40">
              <div className="flex flex-col">
                <span className="font-cinzel text-[9px] tracking-widest text-museum-brass-200/70">
                  CURRENT TOOL
                </span>
                <span className="font-chinese-hand text-sm text-museum-parchment leading-none">
                  {currentTool === 'none'
                    ? '（未选择工具）'
                    : {
                        uv: '紫外扫描 UV-365',
                        ir: '红外透射 IR-1000',
                        solvent: '溶剂凝胶 EtOH-Acetone',
                        stack: '多图层叠合 XOR',
                        grid: '透视网格对齐',
                      }[currentTool]}
                </span>
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background:
                    currentTool === 'none'
                      ? 'rgba(180,180,180,0.4)'
                      : toolColorMap[currentTool].replace('0.18', '1'),
                  boxShadow:
                    currentTool === 'none'
                      ? 'none'
                      : `0 0 12px ${toolColorMap[currentTool].replace('0.18', '0.9')}`,
                }}
              />
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-museum-brass-400/40 bg-museum-wood-900/40">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="font-cinzel text-xs tracking-wider text-museum-parchment">
                {discoveredCount}/10 CLUES
              </span>
            </div>

            <ArtInfoCard />
          </div>
        </div>

        <div
          className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-museum-brass-300/70 to-transparent"
          style={{
            boxShadow: '0 1px 8px rgba(244,224,161,0.4)',
          }}
        />
      </header>

      <main className="flex-1 flex items-stretch max-w-[1600px] w-full mx-auto px-4 py-6 gap-4">
        <aside className="wood-frame rounded-2xl overflow-hidden border border-museum-brass-400/30 shadow-xl shrink-0">
          <ToolPanel />
        </aside>

        <section className="flex-1 flex flex-col gap-5 min-w-0">
          <div
            className="flex-1 wood-frame rounded-2xl p-6 flex items-center justify-center relative overflow-hidden"
            style={{
              background:
                currentTool !== 'none'
                  ? `linear-gradient(180deg, ${toolColorMap[currentTool]} 0%, transparent 40%), repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px), linear-gradient(180deg, #7A5230 0%, #5C3A1E 15%, #3E2723 50%, #2D1B16 85%, #1C0F0C 100%)`
                  : undefined,
            }}
          >
            <div className="absolute top-3 left-3 w-12 h-12 border-l-2 border-t-2 border-museum-brass-300/60 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-3 right-3 w-12 h-12 border-r-2 border-t-2 border-museum-brass-300/60 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-12 h-12 border-l-2 border-b-2 border-museum-brass-300/60 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-12 h-12 border-r-2 border-b-2 border-museum-brass-300/60 rounded-br-lg pointer-events-none" />

            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gold-plaque flex items-center gap-2 pointer-events-none"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
            >
              <span className="font-cinzel text-[10px] tracking-[0.25em] text-museum-wood-700">
                TAVOLA · 木板蛋彩油彩
              </span>
              <span className="w-px h-3 bg-museum-wood-700/40" />
              <span className="font-chinese-hand text-sm text-museum-wood-700 -mt-0.5">
                80 × 100 cm
              </span>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <div className="font-cinzel text-[10px] tracking-[0.25em] text-museum-brass-200/50">
                HOVER OVER CANVAS TO SCAN · 将鼠标移至画面上开始扫描
              </div>
              {solventProgress > 0 && (
                <div className="mt-1 font-chinese-hand text-sm text-emerald-300/80">
                  溶剂溶解进度 {solventProgress.toFixed(0)}%
                </div>
              )}
            </div>

            <div className="w-full h-full max-h-[65vh] flex items-center justify-center">
              <div className="h-full w-full flex items-center justify-center">
                <div className="h-full max-w-[90vh] w-auto aspect-[800/1000]">
                  <LayerEngine />
                </div>
              </div>
            </div>
          </div>

          <PasswordLock />
        </section>

        <aside className="wood-frame rounded-2xl overflow-hidden border border-museum-brass-400/30 shadow-xl shrink-0 w-80 max-h-[calc(100vh-14rem)]">
          <ClueBoard />
        </aside>
      </main>

      <footer className="wood-frame border-t-2 border-museum-brass-400/50 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-6">
            <span className="font-cinzel tracking-[0.25em] text-museum-brass-200/70">
              © MDXXVI · RESTORATION LABORATORIO FIRENZE
            </span>
            <span className="font-chinese-hand text-museum-parchment/70">
              「真相藏于层叠之下，时间现于光影之间」
            </span>
          </div>
          <div className="flex items-center gap-4 font-cinzel tracking-widest text-museum-brass-200/70">
            <span>CANVAS API 2D</span>
            <span className="w-1 h-1 rounded-full bg-museum-brass-300/50" />
            <span>ZUSTAND</span>
            <span className="w-1 h-1 rounded-full bg-museum-brass-300/50" />
            <span>REACT 18</span>
          </div>
        </div>
      </footer>

      <VictoryModal />
    </div>
  );
}
