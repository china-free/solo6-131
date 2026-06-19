import { create } from 'zustand';
import type { LayerId, ToolType } from '@/data/paintingData';

interface LayerConfig {
  visible: boolean;
  opacity: number;
  blend: GlobalCompositeOperation;
}

interface LayerState {
  layers: Record<LayerId, LayerConfig>;
  scanPosition: { x: number; y: number } | null;
  solventMask: Float32Array | null;
  toolForcedVisibility: Partial<Record<LayerId, boolean>>;
  setLayerVisible: (id: LayerId, v: boolean) => void;
  setLayerOpacity: (id: LayerId, o: number) => void;
  setScanPos: (p: { x: number; y: number } | null) => void;
  setSolventMask: (m: Float32Array | null) => void;
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

export const useLayerStore = create<LayerState>((set) => ({
  layers: JSON.parse(JSON.stringify(defaultLayers)),
  scanPosition: null,
  solventMask: null,
  toolForcedVisibility: {},

  setLayerVisible: (id, v) =>
    set((s) => ({
      layers: { ...s.layers, [id]: { ...s.layers[id], visible: v } },
    })),

  setLayerOpacity: (id, o) =>
    set((s) => ({
      layers: { ...s.layers, [id]: { ...s.layers[id], opacity: o } },
    })),

  setScanPos: (p) => set({ scanPosition: p }),

  setSolventMask: (m) => set({ solventMask: m }),

  updateFromTool: (tool, solventProgress) => {
    const base: Record<LayerId, LayerConfig> = JSON.parse(
      JSON.stringify(defaultLayers),
    );

    base.varnish.opacity = Math.max(0.15, 1 - solventProgress / 140);

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
        if (solventProgress > 5) {
          base.solvent.visible = true;
          base.solvent.opacity = Math.min(1, (solventProgress - 5) / 50);
        }
        break;
      case 'none':
      default:
        break;
    }

    set({ layers: base });
  },
}));
