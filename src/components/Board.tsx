import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { BoardCard } from './BoardCard';
import { CardEditor } from './CardEditor';
import type { CardType, BackgroundPattern } from '../types';

interface BoardProps {
  boardId: string;
}

const BOARD_BACKGROUNDS: { id: string; label: string; bg: string; pattern: string }[] = [
  { id: 'cork', label: '🪵 Cork', bg: '#c8a96e', pattern: 'cork' },
  { id: 'cream', label: '🍦 Cream', bg: '#fdf6e3', pattern: 'none' },
  { id: 'navy', label: '🌊 Navy', bg: '#1e3a5f', pattern: 'dots' },
  { id: 'sage', label: '🌿 Sage', bg: '#8fac8c', pattern: 'none' },
  { id: 'lavender', label: '💜 Lavender', bg: '#e8e0f0', pattern: 'dots' },
  { id: 'charcoal', label: '🖤 Charcoal', bg: '#2d2d2d', pattern: 'grid' },
  { id: 'white', label: '⬜ White', bg: '#ffffff', pattern: 'grid' },
  { id: 'rosewood', label: '🌹 Rose', bg: '#f9e4e4', pattern: 'dots' },
];

export const Board: React.FC<BoardProps> = ({ boardId }) => {
  const { getActiveBoard, canvasState, setCanvasState, resetCanvas, updateBoardBackground } =
    useBoardStore();
  const board = getActiveBoard();

  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [addingCard, setAddingCard] = useState(false);
  const [newCardType, setNewCardType] = useState<CardType>('note');
  const [newCardPos, setNewCardPos] = useState({ x: 0, y: 0 });
  const [showBgPicker, setShowBgPicker] = useState(false);

  const { x, y, scale } = canvasState;

  // Pan (middle click or space+drag)
  const [spaceDown, setSpaceDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setSpaceDown(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceDown(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || spaceDown) {
        e.preventDefault();
        isPanning.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [spaceDown]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setCanvasState({ x: x + dx, y: y + dy });
    },
    [x, y, setCanvasState]
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.2), 3);

      // Zoom toward cursor
      const rect = canvasRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const newX = cx - ((cx - x) / scale) * newScale;
      const newY = cy - ((cy - y) / scale) * newScale;

      setCanvasState({ scale: newScale, x: newX, y: newY });
    },
    [scale, x, y, setCanvasState]
  );

  const handleCanvasDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.board-card')) return;
      // Convert screen coords to canvas coords
      const rect = canvasRef.current!.getBoundingClientRect();
      const cx = (e.clientX - rect.left - x) / scale;
      const cy = (e.clientY - rect.top - y) / scale;
      setNewCardPos({ x: cx - 110, y: cy - 100 });
      setNewCardType('note');
      setAddingCard(true);
    },
    [x, y, scale]
  );

  const handleAddCard = (type: CardType) => {
    setNewCardType(type);
    const cx = (window.innerWidth / 2 - x) / scale;
    const cy = (window.innerHeight / 2 - y) / scale;
    // Spread cards out with a random offset so they don't all stack
    const offsetX = (Math.random() - 0.5) * 500;
    const offsetY = (Math.random() - 0.5) * 350;
    setNewCardPos({ x: cx - 110 + offsetX, y: cy - 100 + offsetY });
    setAddingCard(true);
  };

  if (!board) return null;

  const bgStyle = getBoardBackground(board.backgroundColor, board.backgroundPattern);

  return (
    <div className="board-container" style={bgStyle}>
      {/* Toolbar */}
      <div className="board-toolbar">
        <div className="toolbar-left">
          <span className="board-name">{board.name}</span>
        </div>
        <div className="toolbar-center">
          {([
            { type: 'note', icon: '📝', label: 'Note' },
            { type: 'todo', icon: '✅', label: 'To-Do' },
            { type: 'image', icon: '🖼️', label: 'Image' },
            { type: 'quote', icon: '💬', label: 'Quote' },
            { type: 'link', icon: '🔗', label: 'Link' },
          ] as { type: CardType; icon: string; label: string }[]).map((item) => (
            <button
              key={item.type}
              className="toolbar-btn"
              onClick={() => handleAddCard(item.type)}
              title={`Add ${item.label}`}
            >
              <span>{item.icon}</span>
              <span className="toolbar-btn-label">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <div className="bg-picker-wrapper">
            <button
              className="toolbar-btn toolbar-btn--bg"
              onClick={() => setShowBgPicker(!showBgPicker)}
              title="Change Background"
            >
              🎨 Background
            </button>
            {showBgPicker && (
              <div className="bg-picker-dropdown">
                {BOARD_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    className={`bg-option ${board.backgroundColor === bg.bg ? 'bg-option--active' : ''}`}
                    style={{ backgroundColor: bg.bg }}
                    onClick={() => {
                      updateBoardBackground(boardId, bg.bg, bg.pattern as BackgroundPattern);
                      setShowBgPicker(false);
                    }}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="toolbar-btn" onClick={resetCanvas} title="Reset view">
            🎯 Reset
          </button>
          <div className="zoom-indicator">{Math.round(scale * 100)}%</div>
        </div>
      </div>

      {/* Hint */}
      {board.cards.length === 0 && (
        <div className="board-hint">
          <div className="board-hint-content">
            <div className="board-hint-icon">📌</div>
            <h3>Your board is empty!</h3>
            <p>Double-click anywhere to add a note, or use the toolbar above.</p>
            <p className="board-hint-sub">Scroll to zoom • Middle-click to pan • Space+drag to pan</p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`board-canvas ${spaceDown ? 'board-canvas--panning' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleCanvasDoubleClick}
      >
        <div
          className="board-canvas-inner"
          style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}
        >
          {board.cards.map((card) => (
            <BoardCard key={card.id} boardId={boardId} card={card} />
          ))}
        </div>
      </div>

      {/* Add Card Modal */}
      {addingCard && (
        <CardEditor
          boardId={boardId}
          defaultType={newCardType}
          defaultPosition={newCardPos}
          onClose={() => setAddingCard(false)}
        />
      )}
    </div>
  );
};

type BoardBg = BackgroundPattern;

function getBoardBackground(
  color: string,
  pattern: BoardBg
): React.CSSProperties {
  if (pattern === 'cork') {
    return {
      backgroundColor: color,
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(139,90,43,0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(100,60,20,0.12) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")
      `,
    };
  }
  if (pattern === 'dots') {
    return {
      backgroundColor: color,
      backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
    };
  }
  if (pattern === 'grid') {
    return {
      backgroundColor: color,
      backgroundImage: `
        linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
    };
  }
  if (pattern === 'lines') {
    return {
      backgroundColor: color,
      backgroundImage: `linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)`,
      backgroundSize: '24px 24px',
    };
  }
  return { backgroundColor: color };
}

