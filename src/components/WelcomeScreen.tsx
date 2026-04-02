import React, { useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import { TemplateSelector } from './TemplateSelector';
import type { BoardTemplate } from '../types';

export const WelcomeScreen: React.FC = () => {
  const { createBoard, createBoardFromTemplate, setActiveBoard } = useBoardStore();
  const [showTemplates, setShowTemplates] = useState(false);

  const handleCreate = () => {
    const id = createBoard('My Vision Board');
    setActiveBoard(id);
  };

  const handleTemplateSelect = (template: BoardTemplate, name: string) => {
    const id = createBoardFromTemplate(name, template);
    setActiveBoard(id);
    setShowTemplates(false);
  };

  return (
    <>
      <div className="welcome-screen">
        <div className="welcome-content">
          <div className="welcome-icon">📌</div>
          <h1 className="welcome-title">Vision Board</h1>
          <p className="welcome-subtitle">
            Your personal space for ideas, dreams, and inspirations.
          </p>
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">🗺️</span>
              <span>Infinite canvas to map your thoughts</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <span>Notes, to-dos, quotes, images & links</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📌</span>
              <span>Pin & arrange cards freely</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <span>Customise colors and backgrounds</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>Works on mobile, tablet & desktop</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>11 ready-made templates to get started</span>
            </div>
          </div>
          <div className="welcome-actions">
            <button className="welcome-btn welcome-btn--template" onClick={() => setShowTemplates(true)}>
              🎨 Start from a Template
            </button>
            <button className="welcome-btn welcome-btn--blank" onClick={handleCreate}>
              ⬜ Blank Board
            </button>
          </div>
          <p className="welcome-tip">
            Or select an existing board from the sidebar →
          </p>
        </div>
      </div>

      {showTemplates && (
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </>
  );
};

