import React, { useState } from 'react';
import type { Card, CardType } from '../types';
import { useBoardStore } from '../store/boardStore';
import { v4 as uuidv4 } from 'uuid';

interface CardEditorProps {
  boardId: string;
  card?: Card;
  onClose: () => void;
  defaultType?: CardType;
  defaultPosition?: { x: number; y: number };
}

const CARD_COLORS = [
  '#fef9c3', '#fde68a', '#fcd34d',
  '#bbf7d0', '#86efac', '#4ade80',
  '#bfdbfe', '#93c5fd', '#60a5fa',
  '#fecaca', '#fca5a5', '#f87171',
  '#e9d5ff', '#d8b4fe', '#c084fc',
  '#fed7aa', '#fdba74', '#fb923c',
  '#ffffff', '#f1f5f9', '#e2e8f0',
];

const PIN_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export const CardEditor: React.FC<CardEditorProps> = ({
  boardId,
  card,
  onClose,
  defaultType = 'note',
  defaultPosition = { x: 200, y: 200 },
}) => {
  const { addCard, updateCard } = useBoardStore();

  const [type, setType] = useState<CardType>(card?.type ?? defaultType);
  const [title, setTitle] = useState(card?.title ?? '');
  const [content, setContent] = useState(card?.content ?? '');
  const [color, setColor] = useState(card?.color ?? '#fef9c3');
  const [pinColor, setPinColor] = useState(card?.pinColor ?? '#ef4444');
  const [pinned, setPinned] = useState(card?.pinned ?? true);
  // Slight random rotation for new cards to feel like a real corkboard
  const [rotation, setRotation] = useState(
    card?.rotation ?? Math.round((Math.random() - 0.5) * 6)
  );
  const [imageUrl, setImageUrl] = useState(card?.imageUrl ?? '');
  const [linkUrl, setLinkUrl] = useState(card?.linkUrl ?? '');
  const [todos, setTodos] = useState(
    card?.todos ?? [{ id: uuidv4(), text: '', completed: false }]
  );

  const handleSave = () => {
    const base = {
      type,
      title,
      content,
      color,
      pinColor,
      pinned,
      rotation,
      imageUrl,
      linkUrl,
      todos,
      x: card?.x ?? defaultPosition.x,
      y: card?.y ?? defaultPosition.y,
      width: card?.width ?? (type === 'image' ? 240 : 220),
      height: card?.height ?? (type === 'image' ? 280 : 200),
    };

    if (card) {
      updateCard(boardId, card.id, base);
    } else {
      addCard(boardId, base);
    }
    onClose();
  };

  const addTodo = () => {
    setTodos([...todos, { id: uuidv4(), text: '', completed: false }]);
  };

  const updateTodo = (id: string, text: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const cardTypes: { value: CardType; label: string; icon: string }[] = [
    { value: 'note', label: 'Note', icon: '📝' },
    { value: 'todo', label: 'To-Do', icon: '✅' },
    { value: 'image', label: 'Image', icon: '🖼️' },
    { value: 'quote', label: 'Quote', icon: '💬' },
    { value: 'link', label: 'Link', icon: '🔗' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{card ? 'Edit Card' : 'New Card'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Card Type */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-picker">
            {cardTypes.map((ct) => (
              <button
                key={ct.value}
                className={`type-btn ${type === ct.value ? 'type-btn--active' : ''}`}
                onClick={() => setType(ct.value)}
              >
                <span>{ct.icon}</span>
                <span>{ct.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="Card title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content based on type */}
        {(type === 'note' || type === 'quote') && (
          <div className="form-group">
            <label className="form-label">{type === 'quote' ? 'Quote' : 'Content'}</label>
            <textarea
              className="form-textarea"
              placeholder={type === 'quote' ? 'Write your quote...' : 'Write something...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
        )}

        {type === 'image' && (
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="image-preview"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>
        )}

        {type === 'link' && (
          <>
            <div className="form-group">
              <label className="form-label">URL</label>
              <input
                className="form-input"
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="What is this link about?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
              />
            </div>
          </>
        )}

        {type === 'todo' && (
          <div className="form-group">
            <label className="form-label">Tasks</label>
            <div className="todos-list">
              {todos.map((todo) => (
                <div key={todo.id} className="todo-item-editor">
                  <input
                    className="form-input"
                    placeholder="Task..."
                    value={todo.text}
                    onChange={(e) => updateTodo(todo.id, e.target.value)}
                  />
                  <button
                    className="todo-remove-btn"
                    onClick={() => removeTodo(todo.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button className="add-todo-btn" onClick={addTodo}>
                + Add task
              </button>
            </div>
          </div>
        )}

        {/* Colors */}
        <div className="form-group">
          <label className="form-label">Card Color</label>
          <div className="color-grid">
            {CARD_COLORS.map((c) => (
              <button
                key={c}
                className={`color-swatch ${color === c ? 'color-swatch--active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Pin */}
        <div className="form-group">
          <label className="form-label">Pin</label>
          <div className="pin-row">
            <label className="pin-toggle">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
              <span>Show pin</span>
            </label>
            {pinned && (
              <div className="pin-colors">
                {PIN_COLORS.map((pc) => (
                  <button
                    key={pc}
                    className={`pin-color-btn ${pinColor === pc ? 'pin-color-btn--active' : ''}`}
                    style={{ backgroundColor: pc }}
                    onClick={() => setPinColor(pc)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rotation */}
        <div className="form-group">
          <label className="form-label">Rotation: {rotation}°</label>
          <input
            type="range"
            min={-15}
            max={15}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="form-range"
          />
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            {card ? 'Save Changes' : 'Add Card'}
          </button>
        </div>
      </div>
    </div>
  );
};
