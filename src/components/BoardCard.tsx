import React, { useState } from 'react';
import Draggable from 'react-draggable';
import type { Card } from '../types';
import { useBoardStore } from '../store/boardStore';
import { CardEditor } from './CardEditor';

interface BoardCardProps {
  boardId: string;
  card: Card;
}

export const BoardCard: React.FC<BoardCardProps> = ({ boardId, card }) => {
  const { updateCard, deleteCard, bringCardToFront } = useBoardStore();
  const [editing, setEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const handleDragStop = (_: unknown, data: { x: number; y: number }) => {
    updateCard(boardId, card.id, { x: data.x, y: data.y });
  };

  const handleMouseDown = () => {
    bringCardToFront(boardId, card.id);
    setShowMenu(false);
  };

  const toggleTodo = (todoId: string) => {
    const updated = (card.todos ?? []).map((t) =>
      t.id === todoId ? { ...t, completed: !t.completed } : t
    );
    updateCard(boardId, card.id, { todos: updated });
  };

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    width: card.width,
    backgroundColor: card.color,
    transform: `rotate(${card.rotation}deg)`,
    zIndex: card.zIndex,
    cursor: 'grab',
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef as React.RefObject<HTMLElement>}
        position={{ x: card.x, y: card.y }}
        onStop={handleDragStop}
        onStart={handleMouseDown}
        bounds={false}
        handle=".card-drag-handle"
      >
        <div ref={nodeRef} style={cardStyle} className="board-card">
          {/* Pin */}
          {card.pinned && (
            <div
              className="card-pin"
              style={{ backgroundColor: card.pinColor }}
              onClick={(e) => {
                e.stopPropagation();
                updateCard(boardId, card.id, { pinned: false });
              }}
              title="Click to unpin"
            >
              <div className="card-pin-head" />
              <div className="card-pin-needle" />
            </div>
          )}

          {/* Card Actions Menu */}
          <div className="card-menu-trigger" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
            ⋮
          </div>
          {showMenu && (
            <div className="card-menu">
              <button className="card-menu-item" onClick={(e) => { e.stopPropagation(); setEditing(true); setShowMenu(false); }}>
                ✏️ Edit
              </button>
              <button
                className="card-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  updateCard(boardId, card.id, { pinned: !card.pinned });
                  setShowMenu(false);
                }}
              >
                {card.pinned ? '📌 Unpin' : '📌 Pin'}
              </button>
              <button
                className="card-menu-item card-menu-item--danger"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCard(boardId, card.id);
                  setShowMenu(false);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}

          {/* Drag Handle */}
          <div className="card-drag-handle">
            <div className="card-content">
              {/* Title */}
              {card.title && <div className="card-title">{card.title}</div>}

              {/* Content based on type */}
              {card.type === 'note' && card.content && (
                <p className="card-text">{card.content}</p>
              )}

              {card.type === 'quote' && (
                <blockquote className="card-quote">
                  <p>"{card.content}"</p>
                </blockquote>
              )}

              {card.type === 'image' && card.imageUrl && (
                <img
                  src={card.imageUrl}
                  alt={card.title || 'Image'}
                  className="card-image"
                  draggable={false}
                />
              )}

              {card.type === 'link' && (
                <div className="card-link">
                  {card.content && <p className="card-text">{card.content}</p>}
                  {card.linkUrl && (
                    <a
                      href={card.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link-url"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔗 {card.linkUrl.replace(/^https?:\/\//, '').substring(0, 30)}
                    </a>
                  )}
                </div>
              )}

              {card.type === 'todo' && card.todos && (
                <div className="card-todos">
                  {card.todos.map((todo) => (
                    <label key={todo.id} className="card-todo-item">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={todo.completed ? 'card-todo-done' : ''}>{todo.text}</span>
                    </label>
                  ))}
                  <div className="card-todo-progress">
                    {card.todos.filter((t) => t.completed).length}/{card.todos.length} done
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Draggable>

      {editing && (
        <CardEditor
          boardId={boardId}
          card={card}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
};
