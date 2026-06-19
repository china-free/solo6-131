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

const LAYER_IDS = [
  'solvent',
  'starmap',
  'ir',
  'uv',
  'varnish',
  'overlay',
  'glow',
] as const;
type CanvasLayerId = (typeof LAYER_IDS)[number];

const LAYER_Z_INDEX: Record<CanvasLayerId, number> = {
  solvent: 0,
  starmap: 1,
  ir: 2,
  uv: 3,
  varnish: 4,
  overlay: 5,
  glow: 6,
};

export default function LayerEngine() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const canvasRefs = useRef<Record<CanvasLayerId, HTMLCanvasElement | null>>({
    solvent: null,
    starmap: null,
    ir: null,
    uv: null,
    varnish: null,
    overlay: null,
    glow: null,
  });

  const offscreenRef = useRef<{
    varnishSource: HTMLCanvasElement | null;
    compositeVarnish: HTMLCanvasElement | null;
  }>({
    varnishSource: null,
    compositeVarnish: null,
  });

  const mouseStateRef = useRef({
    lastPos: null as { x: number; y: number } | null,
    lastTime: 0,
  });

  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({
    lastTool: 'none' as ToolType,
    lastMaskVersion: -1,
    frameCount: 0,
  });
  const drawnRef = useRef<Record<CanvasLayerId, boolean>>({
    solvent: false,
    starmap: false,
    ir: false,
    uv: false,
    varnish: false,
    overlay: false,
    glow: false,
  });

  const currentTool = useGameStore((s) => s.currentTool);
  const solventProgress = useGameStore((s) => s.solventProgress);
  const applySolvent = useGameStore((s) => s.applySolvent);
  const resetCounter = useGameStore((s) => s.resetCounter);
  const addClueGlobal = useClueStore((s) => s.addClue);
  const setActiveClue = useClueStore((s) => s.setActiveClue);

  const {
    layers,
    setScanPos,
    updateFromTool,
    addSolventTrailPoint,
    clearSolventMask,
  } = useLayerStore();

  const initOffscreen = useCallback(() => {
    if (!offscreenRef.current.varnishSource) {
      const c = document.createElement('canvas');
      c.width = CANVAS_WIDTH;
      c.height = CANVAS_HEIGHT;
      offscreenRef.current.varnishSource = c;
      const ctx = c.getContext('2d');
      if (ctx) {
        drawVarnishLayer(ctx);
      }
    }
    if (!offscreenRef.current.compositeVarnish) {
      const c = document.createElement('canvas');
      c.width = CANVAS_WIDTH;
      c.height = CANVAS_HEIGHT;
      offscreenRef.current.compositeVarnish = c;
    }
    if (canvasRefs.current.varnish && offscreenRef.current.varnishSource) {
      const mctx = canvasRefs.current.varnish.getContext('2d');
      if (mctx) {
        mctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        mctx.drawImage(offscreenRef.current.varnishSource, 0, 0);
      }
    }
    const currentState = useLayerStore.getState();
    if (!currentState.solventMask.canvas) {
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = CANVAS_WIDTH;
      maskCanvas.height = CANVAS_HEIGHT;
      useLayerStore.setState((s) => ({
        solventMask: { ...s.solventMask, canvas: maskCanvas },
      }));
    }
  }, []);

  const setCanvasRef = useCallback(
    (id: CanvasLayerId) => (el: HTMLCanvasElement | null) => {
      canvasRefs.current[id] = el;
      if (el) {
        el.width = CANVAS_WIDTH;
        el.height = CANVAS_HEIGHT;
        if (id === 'varnish' && offscreenRef.current.varnishSource) {
          const currentMask = useLayerStore.getState().solventMask;
          const ctx = el.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            if (currentMask.version > 0 && currentMask.canvas) {
              const compCtx = offscreenRef.current.compositeVarnish?.getContext('2d');
              if (compCtx && offscreenRef.current.compositeVarnish) {
                compCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                compCtx.save();
                compCtx.drawImage(offscreenRef.current.varnishSource, 0, 0);
                compCtx.globalCompositeOperation = 'destination-out';
                compCtx.drawImage(currentMask.canvas, 0, 0);
                compCtx.restore();
                ctx.drawImage(offscreenRef.current.compositeVarnish, 0, 0);
              } else {
                ctx.drawImage(offscreenRef.current.varnishSource, 0, 0);
              }
            } else {
              ctx.drawImage(offscreenRef.current.varnishSource, 0, 0);
            }
          }
        }
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
      case 'varnish':
        break;
    }
    drawnRef.current[id] = true;
  }, []);

  const applyMaskToVarnish = useCallback(() => {
    const { varnishSource, compositeVarnish } = offscreenRef.current;
    const currentState = useLayerStore.getState();
    const maskCanvas = currentState.solventMask.canvas;
    
    if (!varnishSource || !maskCanvas || !compositeVarnish) {
      return;
    }

    const W = CANVAS_WIDTH;
    const H = CANVAS_HEIGHT;

    const compCtx = compositeVarnish.getContext('2d');
    if (!compCtx) return;

    compCtx.clearRect(0, 0, W, H);
    compCtx.save();
    compCtx.drawImage(varnishSource, 0, 0);
    compCtx.globalCompositeOperation = 'destination-out';
    compCtx.drawImage(maskCanvas, 0, 0);
    compCtx.restore();

    const mainVarnish = canvasRefs.current.varnish;
    if (mainVarnish) {
      const mctx = mainVarnish.getContext('2d');
      if (mctx) {
        mctx.clearRect(0, 0, W, H);
        mctx.drawImage(compositeVarnish, 0, 0);
      }
    }

    useLayerStore.setState((s) => ({
      solventMask: { ...s.solventMask, dirty: false },
    }));
  }, []);

  useEffect(() => {
    LAYER_IDS.forEach((id) => {
      if (id !== 'glow' && id !== 'varnish' && !drawnRef.current[id]) {
        redrawLayer(id);
      }
    });
  }, [redrawLayer]);

  useEffect(() => {
    initOffscreen();
  }, [initOffscreen]);

  useEffect(() => {
    updateFromTool(currentTool, solventProgress);
  }, [currentTool, solventProgress, updateFromTool]);

  useEffect(() => {
    if (resetCounter === 0) return;
    mouseStateRef.current = { lastPos: null, lastTime: 0 };
    clearSolventMask();
    initOffscreen();
    if (offscreenRef.current.varnishSource) {
      const ctx = offscreenRef.current.varnishSource.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawVarnishLayer(ctx);
      }
    }
    stateRef.current.lastMaskVersion = -1;
  }, [resetCounter, clearSolventMask, initOffscreen]);

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
        applySolvent(0.6);

        const now = performance.now();
        const last = mouseStateRef.current.lastPos;
        const lastT = mouseStateRef.current.lastTime;
        let speed = 800;

        if (last && now - lastT > 0) {
          const dx = pos.x - last.x;
          const dy = pos.y - last.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          speed = (dist / (now - lastT)) * 1000;
        }

        addSolventTrailPoint(pos, Math.max(100, Math.min(3500, speed)));

        mouseStateRef.current.lastPos = pos;
        mouseStateRef.current.lastTime = now;
      }
    },
    [getCanvasPos, setScanPos, checkHotspots, currentTool, applySolvent, addSolventTrailPoint],
  );

  const handleMouseLeave = useCallback(() => {
    setScanPos(null);
    mouseStateRef.current.lastPos = null;
  }, [setScanPos]);

  useEffect(() => {
    (window as any).__debugStores = {
      useLayerStore,
      useGameStore,
      useClueStore,
    };

    let prevScanStr = '';
    let prevTool = '';
    let mounted = true;

    const processUpdate = () => {
      if (!mounted) return;

      const layerState = useLayerStore.getState();
      const gameState = useGameStore.getState();
      const currentMask = layerState.solventMask;
      const currentToolState = gameState.currentTool;
      const currentScanPos = layerState.scanPosition;

      const scanStr = currentScanPos
        ? `${currentScanPos.x.toFixed(0)},${currentScanPos.y.toFixed(0)}`
        : 'null';
      const toolKey = currentToolState;

      if (scanStr !== prevScanStr || toolKey !== prevTool) {
        prevScanStr = scanStr;
        prevTool = toolKey;

        const glowCanvas = canvasRefs.current.glow;
        if (glowCanvas) {
          const gctx = glowCanvas.getContext('2d');
          if (gctx) {
            const scanTool =
              currentToolState === 'uv' || currentToolState === 'ir' || currentToolState === 'solvent'
                ? currentToolState
                : null;
            drawScanGlow(gctx, currentScanPos, scanTool);
          }
        }
      }

      const shouldUpdate = 
        stateRef.current.lastTool !== currentToolState ||
        currentMask.version !== stateRef.current.lastMaskVersion ||
        currentMask.dirty;
      
      if (shouldUpdate) {
        stateRef.current.lastTool = currentToolState;
        stateRef.current.lastMaskVersion = currentMask.version;

        if (currentMask.dirty) {
          applyMaskToVarnish();
          useLayerStore.getState().incrementMaskVersion();
        }
      }
    };

    let lastMaskDirty = false;
    let lastMaskVersion = -1;
    let lastToolRef = 'none' as ToolType;
    let lastScanStrRef = '';

    const unsubscribe = useLayerStore.subscribe((state) => {
      const mask = state.solventMask;
      const scanStr = state.scanPosition
        ? `${state.scanPosition.x.toFixed(0)},${state.scanPosition.y.toFixed(0)}`
        : 'null';
      
      if (mask.dirty !== lastMaskDirty || mask.version !== lastMaskVersion || scanStr !== lastScanStrRef) {
        lastMaskDirty = mask.dirty;
        lastMaskVersion = mask.version;
        lastScanStrRef = scanStr;
        processUpdate();
      }
    });

    const unsubscribeGame = useGameStore.subscribe((state) => {
      if (state.currentTool !== lastToolRef) {
        lastToolRef = state.currentTool;
        processUpdate();
      }
    });

    const intervalId = window.setInterval(() => {
      const state = useLayerStore.getState();
      if (state.solventMask.dirty) {
        processUpdate();
      }
    }, 100);

    processUpdate();

    return () => {
      mounted = false;
      unsubscribe();
      unsubscribeGame();
      clearInterval(intervalId);
      delete (window as any).__debugStores;
    };
  }, [applyMaskToVarnish]);

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
            zIndex: LAYER_Z_INDEX[id],
            pointerEvents: 'none',
          }}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            'inset 0 0 80px rgba(0,0,0,0.55), inset 0 0 160px rgba(28,15,12,0.35)',
          borderRadius: 2,
          zIndex: 50,
        }}
      />
    </div>
  );
}
