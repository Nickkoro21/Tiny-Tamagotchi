import { useState, useEffect, useRef } from 'preact/hooks';
import { createInitialState } from './engine/gameState.js';
import { applyDecay, feedPet, playWithPet, restPet } from './engine/vitals.js';
import { evaluateStateTransition, getDecayMultiplier } from './engine/states.js';
import { checkMilestone, getEasterEggGreeting } from './engine/personality.js';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './persistence/localStorage.js';
import { exportToJson, importFromJson } from './persistence/jsonExport.js';
import { Pet } from './components/Pet.jsx';
import { Stats } from './components/Stats.jsx';
import { Actions } from './components/Actions.jsx';
import { Naming } from './components/Naming.jsx';
import { StatusMessage } from './components/StatusMessage.jsx';

const TICK_INTERVAL_MS = 1000;
const AUTOSAVE_INTERVAL_MS = 30000;

export function App() {
  // Try loading saved state; if none, start in naming mode
  const [gameState, setGameState] = useState(() => {
    const saved = loadFromLocalStorage();
    return saved || null;
  });

  const [showNaming, setShowNaming] = useState(gameState === null);
  const [messageForceUpdate, setMessageForceUpdate] = useState(0);
  const [easterEggMsg, setEasterEggMsg] = useState(null);
  const lastTickRef = useRef(Date.now());
  const fileInputRef = useRef(null);

  // --- Timer: decay tick + state evaluation + milestone check ---
  useEffect(() => {
    if (showNaming || !gameState) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;

      setGameState((prev) => {
        if (!prev) return prev;

        // Phase 3: Get decay multiplier based on current state
        const multiplier = getDecayMultiplier(prev.pet.state);

        // Step 1: Apply decay with state-based multiplier
        const afterDecay = applyDecay(prev, elapsed, multiplier);

        // Step 2: Evaluate state transitions
        const afterState = evaluateStateTransition(afterDecay, now);

        // Only re-render if something actually changed
        const changed =
          Math.round(afterState.pet.hunger) !== Math.round(prev.pet.hunger) ||
          Math.round(afterState.pet.happiness) !== Math.round(prev.pet.happiness) ||
          Math.round(afterState.pet.energy) !== Math.round(prev.pet.energy) ||
          afterState.pet.state !== prev.pet.state ||
          afterState.pet.sustainedGoodCareStart !== prev.pet.sustainedGoodCareStart;

        return changed ? afterState : prev;
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

    // Phase 4: Check for easter egg name
    const greeting = getEasterEggGreeting(name);
    if (greeting) {
      setEasterEggMsg(greeting);
      setTimeout(() => setEasterEggMsg(null), 5000);
    }
  };

  // --- Care actions (save after each + evaluate state + milestone) ---
  const handleAction = (actionFn) => {
    setGameState((prev) => {
      const afterAction = actionFn(prev);
      // Phase 3: Evaluate state transitions after care action
      const afterState = evaluateStateTransition(afterAction);

      // Phase 4: Check for milestone
      const milestone = checkMilestone(
        afterState.pet.totalCareActions,
        afterState.pet.lastMilestoneShown || 0
      );

      let finalState = afterState;
      if (milestone) {
        finalState = {
          ...afterState,
          pet: {
            ...afterState.pet,
            lastMilestoneShown: milestone.threshold,
          },
        };
      }

      saveToLocalStorage(finalState);
      return finalState;
    });

    // Force StatusMessage to update immediately
    setMessageForceUpdate((c) => c + 1);
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
    e.target.value = '';
  };

  // --- Reset / New Pet ---
  const handleReset = () => {
    if (confirm('⚠ Wipe current lifeform and start fresh?')) {
      clearLocalStorage();
      setGameState(null);
      setShowNaming(true);
      setEasterEggMsg(null);
    }
  };

  // --- Naming Screen ---
  if (showNaming) {
    return <Naming onNameSubmit={handleNameSubmit} />;
  }

  // --- Main Game ---
  if (!gameState) return null;

  const { hunger, happiness, energy, name, state: petState } = gameState.pet;

  return (
    <div class={`app-layout app-layout--${petState}`}>
      {/* Pet blob + name (Phase 3: state-aware component) */}
      <Pet state={petState} name={name} />

      <h1 class="scaffold-title" style={{ fontSize: '1.6rem' }}>TINY TAMAGOTCHI</h1>

      {/* Status message (Phase 4: dynamic personality) */}
      {easterEggMsg ? (
        <p class="status-message" style={{ color: 'var(--accent-success)' }}>
          {easterEggMsg}
        </p>
      ) : (
        <StatusMessage
          gameState={gameState}
          forceUpdate={messageForceUpdate}
        />
      )}

      {/* Stats */}
      <Stats hunger={hunger} happiness={happiness} energy={energy} />

      {/* Actions */}
      <Actions
        onFeed={() => handleAction(feedPet)}
        onPlay={() => handleAction(playWithPet)}
        onRest={() => handleAction(restPet)}
      />

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
