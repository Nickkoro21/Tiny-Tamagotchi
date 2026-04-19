import { useState, useEffect, useRef } from 'preact/hooks';
import { createInitialState } from './engine/gameState.js';
import { applyDecay, feedPet, playWithPet, restPet } from './engine/vitals.js';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './persistence/localStorage.js';
import { exportToJson, importFromJson } from './persistence/jsonExport.js';
import { Stats } from './components/Stats.jsx';
import { Actions } from './components/Actions.jsx';
import { Naming } from './components/Naming.jsx';

const TICK_INTERVAL_MS = 1000;
const AUTOSAVE_INTERVAL_MS = 30000;

export function App() {
  // Try loading saved state; if none, start in naming mode
  const [gameState, setGameState] = useState(() => {
    const saved = loadFromLocalStorage();
    return saved || null;
  });

  const [showNaming, setShowNaming] = useState(gameState === null);
  const lastTickRef = useRef(Date.now());
  const fileInputRef = useRef(null);

  // --- Timer: decay tick ---
  useEffect(() => {
    if (showNaming || !gameState) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      setGameState((prev) => {
        if (!prev) return prev;
        const next = applyDecay(prev, elapsed);
        const changed =
          Math.round(next.pet.hunger) !== Math.round(prev.pet.hunger) ||
          Math.round(next.pet.happiness) !== Math.round(prev.pet.happiness) ||
          Math.round(next.pet.energy) !== Math.round(prev.pet.energy);
        return changed ? next : prev;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [showNaming, gameState !== null]);

  // --- Auto-save every 30s ---
  useEffect(() => {
    if (showNaming || !gameState) return;

    const interval = setInterval(() => {
      setGameState((current) => {
        if (current) saveToLocalStorage(current);
        return current;
      });
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [showNaming, gameState !== null]);

  // --- Naming complete ---
  const handleNameSubmit = (name) => {
    const initial = createInitialState(name);
    setGameState(initial);
    setShowNaming(false);
    lastTickRef.current = Date.now();
    saveToLocalStorage(initial);
  };

  // --- Care actions (save after each) ---
  const handleAction = (actionFn) => {
    setGameState((prev) => {
      const next = actionFn(prev);
      saveToLocalStorage(next);
      return next;
    });
  };

  // --- JSON export ---
  const handleExport = () => {
    if (gameState) exportToJson(gameState);
  };

  // --- JSON import ---
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imported = await importFromJson(file);
    if (imported) {
      setGameState(imported);
      saveToLocalStorage(imported);
      lastTickRef.current = Date.now();
    }
    // Reset input so same file can be re-imported
    e.target.value = '';
  };

  // --- Reset / New Pet ---
  const handleReset = () => {
    if (confirm('⚠ Wipe current lifeform and start fresh?')) {
      clearLocalStorage();
      setGameState(null);
      setShowNaming(true);
    }
  };

  // --- Naming Screen ---
  if (showNaming) {
    return <Naming onNameSubmit={handleNameSubmit} />;
  }

  // --- Main Game ---
  if (!gameState) return null;

  const { hunger, happiness, energy, name } = gameState.pet;

  return (
    <div class="app-layout">
      {/* Pet blob + name */}
      <div class="scaffold-screen" style={{ minHeight: 'auto', paddingTop: '48px' }}>
        <div class="scaffold-blob" />
        <h1 class="scaffold-title" style={{ fontSize: '1.6rem' }}>TINY TAMAGOTCHI</h1>
        {name && <span class="pet-name">[ {name} ]</span>}
      </div>

      {/* Stats */}
      <Stats hunger={hunger} happiness={happiness} energy={energy} />

      {/* Actions */}
      <Actions
        onFeed={() => handleAction(feedPet)}
        onPlay={() => handleAction(playWithPet)}
        onRest={() => handleAction(restPet)}
      />

      {/* Status line */}
      <p class="text-muted text-center" style={{ fontSize: 'var(--font-size-xs)' }}>
        ▸ CARE SYSTEMS ONLINE
      </p>

      {/* Footer: save/load/reset */}
      <div class="footer-actions">
        <button class="footer-btn" onClick={handleExport}>SAVE TO FILE</button>
        <button class="footer-btn" onClick={handleImportClick}>LOAD FROM FILE</button>
        <button class="footer-btn footer-btn--danger" onClick={handleReset}>NEW PET</button>
        <input
          ref={fileInputRef}
          class="hidden-input"
          type="file"
          accept=".json"
          onChange={handleImportFile}
        />
      </div>
    </div>
  );
}
