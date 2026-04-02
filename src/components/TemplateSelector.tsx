import React, { useState } from 'react';
import type { BoardTemplate } from '../types';
import { BOARD_TEMPLATES } from '../data/templates';

interface TemplateSelectorProps {
  onSelect: (template: BoardTemplate, name: string) => void;
  onClose: () => void;
}

type Category = 'all' | 'creative' | 'planning' | 'technical';

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [boardName, setBoardName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplate>(BOARD_TEMPLATES[0]);

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
    { id: 'planning', label: 'Planning', icon: '📋' },
    { id: 'technical', label: 'Technical', icon: '💻' },
  ];

  const filtered =
    activeCategory === 'all'
      ? BOARD_TEMPLATES
      : BOARD_TEMPLATES.filter((t) => t.category === activeCategory);

  const handleCreate = () => {
    const name = boardName.trim() || selectedTemplate.name;
    onSelect(selectedTemplate, name);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="template-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Choose a Template</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Category Tabs */}
        <div className="template-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`template-tab ${activeCategory === cat.id ? 'template-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="template-grid">
          {filtered.map((template) => (
            <button
              key={template.id}
              className={`template-card ${selectedTemplate.id === template.id ? 'template-card--active' : ''}`}
              onClick={() => setSelectedTemplate(template)}
              style={{ '--template-bg': template.backgroundColor } as React.CSSProperties}
            >
              <div className="template-card-preview" style={{ backgroundColor: template.backgroundColor }}>
                <span className="template-card-icon">{template.icon}</span>
                {template.cards.length > 0 && (
                  <div className="template-card-chips">
                    {template.cards.slice(0, 3).map((_, i) => (
                      <div key={i} className="template-card-chip" />
                    ))}
                  </div>
                )}
              </div>
              <div className="template-card-info">
                <div className="template-card-name">{template.name}</div>
                <div className="template-card-desc">{template.description}</div>
              </div>
              {selectedTemplate.id === template.id && (
                <div className="template-card-check">✓</div>
              )}
            </button>
          ))}
        </div>

        {/* Board name + Create */}
        <div className="template-footer">
          <input
            className="form-input"
            placeholder={`Board name (default: "${selectedTemplate.name}")`}
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="template-footer-actions">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleCreate}>
              Create Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
