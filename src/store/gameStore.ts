import { create } from 'zustand';
import {
  ToolType,
  ClueId,
  PASSWORD_ANSWER,
  CLUE_HOTSPOTS,
} from '@/data/paintingData';

interface GameState {
  currentTool: ToolType;
  solventProgress: number;
  discoveredClues: ClueId[];
  passwordInput: [string, string, string, string];
  isVictory: boolean;
  attempts: number;
  wrongAttempt: boolean;
  showHint: boolean;
  hintIndex: number;
  resetCounter: number;
  setTool: (t: ToolType) => void;
  applySolvent: (amount: number) => void;
  addClue: (id: ClueId) => void;
  hasClue: (id: ClueId) => boolean;
  setPasswordDigit: (i: number, v: string) => void;
  checkPassword: () => boolean;
  setShowHint: (v: boolean) => void;
  nextHint: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentTool: 'none',
  solventProgress: 0,
  discoveredClues: [],
  passwordInput: ['-', '-', '-', '-'],
  isVictory: false,
  attempts: 0,
  wrongAttempt: false,
  showHint: false,
  hintIndex: 0,
  resetCounter: 0,

  setTool: (t) => {
    const prev = get().currentTool;
    set({ currentTool: prev === t ? 'none' : t, wrongAttempt: false });
  },

  applySolvent: (amount) => {
    set((s) => ({
      solventProgress: Math.min(100, s.solventProgress + amount),
    }));
  },

  addClue: (id) => {
    set((s) =>
      s.discoveredClues.includes(id)
        ? s
        : { discoveredClues: [...s.discoveredClues, id] },
    );
  },

  hasClue: (id) => get().discoveredClues.includes(id),

  setPasswordDigit: (i, v) => {
    const digits = [...get().passwordInput] as [string, string, string, string];
    if (v === '') {
      digits[i] = '-';
    } else if (/^\d$/.test(v)) {
      digits[i] = v;
    }
    set({ passwordInput: digits, wrongAttempt: false });
  },

  checkPassword: () => {
    const { passwordInput } = get();
    const correct =
      passwordInput[0] === PASSWORD_ANSWER[0] &&
      passwordInput[1] === PASSWORD_ANSWER[1] &&
      passwordInput[2] === PASSWORD_ANSWER[2] &&
      passwordInput[3] === PASSWORD_ANSWER[3];
    if (correct) {
      set({
        isVictory: true,
        attempts: get().attempts + 1,
        wrongAttempt: false,
        discoveredClues: Array.from(
          new Set([...get().discoveredClues, ...CLUE_HOTSPOTS.map((c) => c.id)]),
        ),
      });
      return true;
    } else {
      set({
        attempts: get().attempts + 1,
        wrongAttempt: true,
      });
      setTimeout(() => set({ wrongAttempt: false }), 1200);
      return false;
    }
  },

  setShowHint: (v) => set({ showHint: v }),
  nextHint: () => set((s) => ({ hintIndex: (s.hintIndex + 1) % PASSWORD_ANSWER.length })),

  resetGame: () =>
    set({
      currentTool: 'none',
      solventProgress: 0,
      discoveredClues: [],
      passwordInput: ['-', '-', '-', '-'],
      isVictory: false,
      attempts: 0,
      wrongAttempt: false,
      showHint: false,
      hintIndex: 0,
      resetCounter: get().resetCounter + 1,
    }),
}));
