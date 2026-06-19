import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useLayerStore } from '@/store/layerStore';
import { useClueStore } from '@/store/clueStore';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CLUE_HOTSPOTS,
  type ToolType,
} from '@/data/paintingData';
import {
  drawVarnishLayer,
  drawUVLayer,
  drawIRLayer,
  drawStarmapLayer,
  drawSolventLayer,
  drawScanGlow,
  drawOverlayLayer,
} from './PaintLayer';

const LAYER_IDS = ['varnish', 'uv', 'ir', 'starmap', 'solvent', 'glow', 'overlay'] as const;
type CanvasLayerId = (typeof LAYER_IDS)[number];

export default function LayerEngine() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Record<CanvasLayerId, HTMLCanvasElement | null>>({
    varnish: null,
    uv: null,
    ir: null,
    starmap: null,
    solvent: null,
    glow: null,
    overlay: null,
  });
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({
    lastTool: 'none' as ToolType,
    lastProgress: -1,
  });
  const drawnRef = useRef<Record<CanvasLayerId, boolean>>({
    varnish: false,
    uv: false,
    ir: false,
    starmap: false,
    solvent: false,
    glow: false,
    overlay: false,
  });

  const currentTool = useGameStore((s) => s.currentTool);
  const solventProgress = useGameStore((s) => s.solventProgress);
  const applySolvent = useGameStore((s) => s.applySolvent);
  const addClueGlobal = useClueStore((s) => s.addClue);
  const setActiveClue = useClueStore((s) => s.setActiveClue);
  const { layers, scanPosition, setScanPos, updateFromTool } = useLayerStore();

  const setCanvasRef = useCallback(
    (id: CanvasLayerId) => (el: HTMLCanvasElement | null) => {
      canvasRefs.current[id] = el;
      if (el) {
        el.width = CANVAS_WIDTH;
        el.height = CANVAS_HEIGHT;
      }
    },
    [],
  );

  const redrawLayer = useCallback((id: CanvasLayerId) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    switch (id) {
      case 'varnish':
        drawVarnishLayer(ctx);
        break;
      case 'uv':
        drawUVLayer(ctx);
        break;
      case 'ir':
        drawIRLayer(ctx);
        break;
      case 'starmap':
        drawStarmapLayer(ctx);
        break;
      case 'solvent':
        drawSolventLayer(ctx);
        break;
      case 'overlay':
        drawOverlayLayer(ctx);
        break;
      case 'glow':
        break;
    }
    drawnRef.current[id] = true;
  }, []);

  useEffect(() => {
    LAYER_IDS.forEach((id) => {
      if (id !== 'glow' && !drawnRef.current[id]) {
        redrawLayer(id);
      }
    });
  }, [redrawLayer]);

  useEffect(() => {
    updateFromTool(currentTool, solventProgress);
  }, [currentTool, solventProgress, updateFromTool]);

  const checkHotspots = useCallback(
    (x: number, y: number) => {
      CLUE_HOTSPOTS.forEach((hotspot) => {
        const dx = x - hotspot.x;
        const dy = y - hotspot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= hotspot.radius && hotspot.requiredTools.includes(currentTool)) {
          addClueGlobal(hotspot.id);
          setActiveClue(hotspot.id);
        }
      });
    },
    [currentTool, addClueGlobal, setActiveClue],
  );

  const getCanvasPos = useCallback((e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const pos = getCanvasPos(e);
      setScanPos(pos);
      checkHotspots(pos.x, pos.y);

      if (currentTool === 'solvent') {
        applySolvent(0.5);
      }
    },
    [getCanvasPos, setScanPos, checkHotspots, currentTool, applySolvent],
  );

  const handleMouseLeave = useCallback(() => {
    setScanPos(null);
  }, [setScanPos]);

  useEffect(() => {
    let prevScanStr = '';
    let prevTool = '';

    const tick = () => {
      const scanStr = scanPosition ? `${scanPosition.x.toFixed(0)},${scanPosition.y.toFixed(0)}` : 'null';
      const toolKey = currentTool;

      if (scanStr !== prevScanStr || toolKey !== prevTool) {
        prevScanStr = scanStr;
        prevTool = toolKey;
        const glowCanvas = canvasRefs.current.glow;
        if (glowCanvas) {
          const gctx = glowCanvas.getContext('2d');
          if (gctx) {
            const scanTool =
              currentTool === 'uv' || currentTool === 'ir' || currentTool === 'solvent'
                ? currentTool
                : null;
            drawScanGlow(gctx, scanPosition, scanTool);
          }
        }

        if (currentTool === 'solvent') {
          const solCanvas = canvasRefs.current.solvent;
          if (solCanvas && scanPosition) {
            const sctx = solCanvas.getContext('2d');
            if (sctx) {
              sctx.save();
              sctx.globalCompositeOperation = 'destination-out';
              const mask = sctx.createRadialGradient(
                scanPosition.x,
                scanPosition.y,
                5,
                scanPosition.x,
                scanPosition.y,
                60,
              );
              mask.addColorStop(0, 'rgba(0,0,0,0.12)');
              mask.addColorStop(0.6, 'rgba(0,0,0,0.06)');
              mask.addColorStop(1, 'rgba(0,0,0,0)');
              sctx.fillStyle = mask;
              sctx.beginPath();
              sctx.arc(scanPosition.x, scanPosition.y, 60, 0, Math.PI * 2);
              sctx.fill();
              sctx.restore();
            }
          }
        }
      }

      if (
        stateRef.current.lastTool !== currentTool ||
        Math.abs(stateRef.current.lastProgress - solventProgress) > 2
      ) {
        stateRef.current.lastTool = currentTool;
        stateRef.current.lastProgress = solventProgress;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [scanPosition, currentTool, solventProgress]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {LAYER_IDS.map((id) => (
        <canvas
          key={id}
          ref={setCanvasRef(id)}
          className="absolute inset-0 w-full h-full"
          style={{
            display: layers[id].visible ? 'block' : 'none',
            opacity: layers[id].opacity,
            mixBlendMode: layers[id].blend as React.CSSProperties['mixBlendMode'],
            zIndex: LAYER_IDS.indexOf(id),
            pointerEvents: id === 'overlay' ? 'none' : 'none',
          }}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            'inset 0 0 80px rgba(0,0,0,0.55), inset 0 0 160px rgba(28,15,12,0.35)',
          borderRadius: 2,
        }}
      />
    </div>
  );
}
