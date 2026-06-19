import { create } from 'zustand';
import type { LayerId, ToolType } from '@/data/paintingData';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/data/paintingData';

interface LayerConfig {
  visible: boolean;
  opacity: number;
  blend: GlobalCompositeOperation;
}

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
  pressure: number;
}

interface SolventMaskState {
  canvas: HTMLCanvasElement | null;
  dirty: boolean;
  version: number;
}

interface LayerState {
  layers: Record<LayerId, LayerConfig>;
  scanPosition: { x: number; y: number } | null;
  toolForcedVisibility: Partial<Record<LayerId, boolean>>;
  solventTrail: TrailPoint[];
  solventMask: SolventMaskState;
  setLayerVisible: (id: LayerId, v: boolean) => void;
  setLayerOpacity: (id: LayerId, o: number) => void;
  setScanPos: (p: { x: number; y: number } | null) => void;
  addSolventTrailPoint: (p: { x: number; y: number }, speed: number) => void;
  clearSolventMask: () => void;
  markMaskDirty: () => void;
  incrementMaskVersion: () => void;
  updateFromTool: (tool: ToolType, solventProgress: number) => void;
}

const defaultLayers: Record<LayerId, LayerConfig> = {
  solvent: { visible: false, opacity: 1, blend: 'source-over' },
  starmap: { visible: false, opacity: 0.9, blend: 'difference' },
  ir: { visible: false, opacity: 0.85, blend: 'multiply' },
  uv: { visible: false, opacity: 0.95, blend: 'screen' },
  varnish: { visible: true, opacity: 1, blend: 'source-over' },
  overlay: { visible: false, opacity: 0.7, blend: 'difference' },
  glow: { visible: true, opacity: 1, blend: 'screen' },
};

function createEmptyMaskCanvas(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = CANVAS_WIDTH;
  c.height = CANVAS_HEIGHT;
  return c;
}

function createEmptyMask(): SolventMaskState {
  return {
    canvas: null,
    dirty: false,
    version: 0,
  };
}

function ensureMaskCanvas(): HTMLCanvasElement {
  const existing = useLayerStore.getState().solventMask.canvas;
  if (existing) return existing;
  const c = createEmptyMaskCanvas();
  useLayerStore.setState((s) => ({
    solventMask: { ...s.solventMask, canvas: c },
  }));
  return c;
}

function eraseMaskAt(
  maskCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  pressure: number,
) {
  const ctx = maskCanvas.getContext('2d');
  if (!ctx) return;

  const brushRadius = 58 + pressure * 14;
  const outerRadius = brushRadius + 8;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);
  const centerAlpha = Math.min(1, pressure * 0.9);
  gradient.addColorStop(0, `rgba(0,0,0,${centerAlpha})`);
  gradient.addColorStop(0.45, `rgba(0,0,0,${centerAlpha})`);
  gradient.addColorStop(0.7, `rgba(0,0,0,${centerAlpha * 0.6})`);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export const useLayerStore = create<LayerState>((set, get) => ({
  layers: JSON.parse(JSON.stringify(defaultLayers)),
  scanPosition: null,
  toolForcedVisibility: {},
  solventTrail: [],
  solventMask: createEmptyMask(),

  setLayerVisible: (id, v) =>
    set((s) => ({
      layers: { ...s.layers, [id]: { ...s.layers[id], visible: v } },
    })),

  setLayerOpacity: (id, o) =>
    set((s) => ({
      layers: { ...s.layers, [id]: { ...s.layers[id], opacity: o } },
    })),

  setScanPos: (p) => set({ scanPosition: p }),

  addSolventTrailPoint: (p, speed) => {
    const now = performance.now();
    const pressure = Math.max(0.25, Math.min(1, 1.2 - speed / 2500));
    
    // 裁剪坐标到画布范围内
    const clampedX = Math.max(0, Math.min(CANVAS_WIDTH, p.x));
    const clampedY = Math.max(0, Math.min(CANVAS_HEIGHT, p.y));
    const point: TrailPoint = { x: clampedX, y: clampedY, timestamp: now, pressure };

    console.log('[Mask] addSolventTrailPoint at:', clampedX.toFixed(0), clampedY.toFixed(0), 'pressure:', pressure.toFixed(2));

    const s = get();
    const maskCanvas = ensureMaskCanvas();

    const lastPoint = s.solventTrail[s.solventTrail.length - 1];

    const points: { x: number; y: number; pressure: number }[] = [];

    if (lastPoint) {
      const dx = clampedX - lastPoint.x;
      const dy = clampedY - lastPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist / 3));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = lastPoint.x + dx * t;
        const y = lastPoint.y + dy * t;
        const interpolatedPressure = lastPoint.pressure + (pressure - lastPoint.pressure) * t;
        points.push({ x, y, pressure: interpolatedPressure });
      }
    } else {
      points.push({ x: clampedX, y: clampedY, pressure });
    }

    console.log('[Mask] Drawing', points.length, 'interpolated points');
    points.forEach((pt) => {
      eraseMaskAt(maskCanvas, pt.x, pt.y, pt.pressure);
    });

    // 验证蒙版内容
    const mctx = maskCanvas.getContext('2d');
    if (mctx) {
      const testPixel = mctx.getImageData(clampedX, clampedY, 1, 1).data;
      console.log('[Mask] After erase, mask at (', clampedX.toFixed(0), ',', clampedY.toFixed(0), ') alpha:', testPixel[3]);
    }

    set({
      solventTrail: [...s.solventTrail.slice(-30), point],
      solventMask: { ...s.solventMask, canvas: maskCanvas, dirty: true },
    });
    console.log('[Mask] Store updated, dirty=true, new maskCanvas:', !!maskCanvas);
  },

  clearSolventMask: () => {
    const newCanvas = createEmptyMaskCanvas();
    set({
      solventMask: { canvas: newCanvas, dirty: true, version: 0 },
      solventTrail: [],
    });
  },

  markMaskDirty: () =>
    set((s) => ({
      solventMask: { ...s.solventMask, dirty: true },
    })),

  incrementMaskVersion: () =>
    set((s) => ({
      solventMask: { ...s.solventMask, version: s.solventMask.version + 1 },
    })),

  updateFromTool: (tool, solventProgress) => {
    void solventProgress;
    const base: Record<LayerId, LayerConfig> = JSON.parse(
      JSON.stringify(defaultLayers),
    );

    switch (tool) {
      case 'uv':
        base.uv.visible = true;
        base.uv.opacity = 0.95;
        base.varnish.opacity *= 0.22;
        break;
      case 'ir':
        base.ir.visible = true;
        base.ir.opacity = 0.85;
        base.varnish.opacity *= 0.18;
        break;
      case 'grid':
        base.ir.visible = true;
        base.ir.opacity = 0.6;
        base.varnish.opacity *= 0.55;
        break;
      case 'stack':
        base.uv.visible = true;
        base.uv.opacity = 0.55;
        base.ir.visible = true;
        base.ir.opacity = 0.5;
        base.starmap.visible = true;
        base.starmap.opacity = 0.75;
        base.overlay.visible = true;
        base.varnish.opacity *= 0.1;
        break;
      case 'solvent':
        base.solvent.visible = true;
        base.solvent.opacity = 1;
        break;
      case 'none':
      default:
        break;
    }

    set({ layers: base });
  },
}));
