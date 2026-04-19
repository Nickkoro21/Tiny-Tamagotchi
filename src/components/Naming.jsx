import { useState } from 'preact/hooks';

/**
 * Pet naming screen — shown on first launch.
 */
export function Naming({ onNameSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length >= 1 && trimmed.length <= 16) {
      onNameSubmit(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const isValid = name.trim().length >= 1 && name.trim().length <= 16;

  return (
    <div class="naming-screen">
      <div class="scaffold-blob" />

      <h1 class="naming-title">SYSTEM BOOT</h1>
      <p class="naming-prompt">
        Enter designation for new digital lifeform:
      </p>

      <input
        class="naming-input"
        type="text"
        value={name}
        onInput={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. NEXUS-7"
        maxLength={16}
        autoFocus
      />

      <span class="naming-charcount">
        {name.trim().length}/16
      </span>

      <button
        class="naming-submit"
        onClick={handleSubmit}
        disabled={!isValid}
      >
        ▸ INITIALIZE
      </button>
    </div>
  );
}
