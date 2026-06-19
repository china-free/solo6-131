import { create } from 'zustand';
import type { ClueId } from '@/data/paintingData';
import { CLUE_HOTSPOTS } from '@/data/paintingData';

interface ClueState {
  clues: ClueId[];
  boardOpen: boolean;
  activeClue: ClueId | null;
  manualNotes: Record<ClueId, string>;
  addClue: (id: ClueId) => void;
  hasClue: (id: ClueId) => boolean;
  toggleBoard: () => void;
  setBoardOpen: (v: boolean) => void;
  setActiveClue: (id: ClueId | null) => void;
  setNote: (id: ClueId, note: string) => void;
  getClueInfo: (id: ClueId) => typeof CLUE_HOTSPOTS[number] | undefined;
  discoveredCount: number;
  totalCount: number;
}

const emptyNotes = CLUE_HOTSPOTS.reduce<Record<string, string>>(
  (acc, c) => ({ ...acc, [c.id]: '' }),
  {},
);

export const useClueStore = create<ClueState>((set, get) => ({
  clues: [],
  boardOpen: true,
  activeClue: null,
  manualNotes: emptyNotes as Record<ClueId, string>,
  discoveredCount: 0,
  totalCount: CLUE_HOTSPOTS.length,

  addClue: (id) =>
    set((s) =>
      s.clues.includes(id)
        ? s
        : { clues: [...s.clues, id], discoveredCount: s.clues.length + 1, activeClue: id },
    ),

  hasClue: (id) => get().clues.includes(id),

  toggleBoard: () => set((s) => ({ boardOpen: !s.boardOpen })),
  setBoardOpen: (v) => set({ boardOpen: v }),
  setActiveClue: (id) => set({ activeClue: id }),
  setNote: (id, note) =>
    set((s) => ({ manualNotes: { ...s.manualNotes, [id]: note } })),

  getClueInfo: (id) => CLUE_HOTSPOTS.find((c) => c.id === id),
}));
