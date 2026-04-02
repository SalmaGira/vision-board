import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Board, Card, CanvasState, BoardTemplate } from '../types';

interface BoardStore {
  boards: Board[];
  activeBoardId: string | null;

  // Board operations
  createBoard: (name: string) => string;
  createBoardFromTemplate: (name: string, template: BoardTemplate) => string;
  deleteBoard: (id: string) => void;
  renameBoard: (id: string, name: string) => void;
  setActiveBoard: (id: string | null) => void;
  updateBoardBackground: (id: string, backgroundColor: string, backgroundPattern: Board['backgroundPattern']) => void;
  getActiveBoard: () => Board | undefined;

  // Card operations
  addCard: (boardId: string, card: Omit<Card, 'id' | 'createdAt' | 'zIndex'>) => void;
  updateCard: (boardId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  bringCardToFront: (boardId: string, cardId: string) => void;

  // Canvas state (not persisted per-board, just local)
  canvasState: CanvasState;
  setCanvasState: (state: Partial<CanvasState>) => void;
  resetCanvas: () => void;
}

const DEFAULT_CANVAS: CanvasState = { x: 0, y: 0, scale: 1 };

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      boards: [],
      activeBoardId: null,
      canvasState: DEFAULT_CANVAS,

      createBoard: (name) => {
        const id = uuidv4();
        const board: Board = {
          id,
          name,
          backgroundColor: '#f5f0e8',
          backgroundPattern: 'cork',
          cards: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ boards: [...state.boards, board] }));
        return id;
      },

      createBoardFromTemplate: (name, template) => {
        const id = uuidv4();
        const now = Date.now();
        const cards: Card[] = template.cards.map((c, idx) => ({
          ...c,
          id: uuidv4(),
          createdAt: now + idx,
        }));
        const board: Board = {
          id,
          name,
          backgroundColor: template.backgroundColor,
          backgroundPattern: template.backgroundPattern,
          cards,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ boards: [...state.boards, board] }));
        return id;
      },

      deleteBoard: (id) => {
        set((state) => ({
          boards: state.boards.filter((b) => b.id !== id),
          activeBoardId: state.activeBoardId === id ? null : state.activeBoardId,
        }));
      },

      renameBoard: (id, name) => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === id ? { ...b, name, updatedAt: Date.now() } : b
          ),
        }));
      },

      setActiveBoard: (id) => {
        set({ activeBoardId: id, canvasState: DEFAULT_CANVAS });
      },

      updateBoardBackground: (id, backgroundColor, backgroundPattern) => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === id ? { ...b, backgroundColor, backgroundPattern, updatedAt: Date.now() } : b
          ),
        }));
      },

      getActiveBoard: () => {
        const { boards, activeBoardId } = get();
        return boards.find((b) => b.id === activeBoardId);
      },

      addCard: (boardId, card) => {
        const board = get().boards.find((b) => b.id === boardId);
        const maxZ = board ? Math.max(0, ...board.cards.map((c) => c.zIndex)) : 0;
        const newCard: Card = {
          ...card,
          id: uuidv4(),
          createdAt: Date.now(),
          zIndex: maxZ + 1,
        };
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, cards: [...b.cards, newCard], updatedAt: Date.now() }
              : b
          ),
        }));
      },

      updateCard: (boardId, cardId, updates) => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  cards: b.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
                  updatedAt: Date.now(),
                }
              : b
          ),
        }));
      },

      deleteCard: (boardId, cardId) => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId
              ? { ...b, cards: b.cards.filter((c) => c.id !== cardId), updatedAt: Date.now() }
              : b
          ),
        }));
      },

      bringCardToFront: (boardId, cardId) => {
        const board = get().boards.find((b) => b.id === boardId);
        if (!board) return;
        const maxZ = Math.max(0, ...board.cards.map((c) => c.zIndex));
        get().updateCard(boardId, cardId, { zIndex: maxZ + 1 });
      },

      setCanvasState: (state) => {
        set((s) => ({ canvasState: { ...s.canvasState, ...state } }));
      },

      resetCanvas: () => {
        set({ canvasState: DEFAULT_CANVAS });
      },
    }),
    {
      name: 'vision-board-storage',
      partialize: (state) => ({ boards: state.boards, activeBoardId: state.activeBoardId }),
    }
  )
);
