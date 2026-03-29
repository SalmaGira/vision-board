import { useBoardStore } from './store/boardStore';
import { Sidebar } from './components/Sidebar';
import { Board } from './components/Board';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
  const { activeBoardId } = useBoardStore();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
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
