import { useState } from 'react';
import { useBoardStore } from './store/boardStore';
import { Sidebar } from './components/Sidebar';
import { Board } from './components/Board';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
  const { activeBoardId } = useBoardStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onBoardSelect={() => setSidebarOpen(false)}
      />

      <main className="app-main">
        {/* Mobile hamburger button */}
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {activeBoardId ? (
          <Board boardId={activeBoardId} />
        ) : (
          <WelcomeScreen />
        )}
      </main>
    </div>
  );
}

export default App;

