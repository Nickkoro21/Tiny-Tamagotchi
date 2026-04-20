/**
 * Status message — displays contextual personality messages.
 * Phase 3: Basic state messages
 * Phase 4: Dynamic personality system with cycling messages
 * Replan (post-Phase-4): FR-9 Critical Stasis hint when all stats = 0
 */
import { useState, useEffect, useRef } from 'preact/hooks';
import { getMessage } from '../engine/personality.js';

const MESSAGE_CYCLE_MS = 5000; // Update message every 5 seconds

/**
 * Returns true if all three vital stats are exactly 0 (Critical Stasis).
 * Per FR-9: permanent death is prohibited; this is a recoverable state.
 */
function isInCriticalStasis(pet) {
  return pet.hunger === 0 && pet.happiness === 0 && pet.energy === 0;
}

export function StatusMessage({ gameState, forceUpdate }) {
  const [displayText, setDisplayText] = useState('');
  const [colorVar, setColorVar] = useState('--accent-cyan');
  const [fading, setFading] = useState(false);
  const lastTextRef = useRef(null);
  const cycleRef = useRef(null);

  // Get and display a new message
  const updateMessage = () => {
    if (!gameState) return;

    // FR-9: Critical Stasis override — all stats at 0
    if (isInCriticalStasis(gameState.pet)) {
      const hintText = '⚠ CRITICAL STASIS — Use Feed, Play, Rest to restore systems';
      if (hintText !== lastTextRef.current) {
        setFading(true);
        setTimeout(() => {
          setDisplayText(hintText);
          setColorVar('--accent-danger');
          lastTextRef.current = hintText;
          setFading(false);
        }, 300);
      }
      return;
    }

    const result = getMessage(gameState, lastTextRef.current);

    // Only animate if text actually changed
    if (result.text !== lastTextRef.current) {
      setFading(true);
      setTimeout(() => {
        setDisplayText(result.text);
        setColorVar(result.colorVar);
        lastTextRef.current = result.text;
        setFading(false);
      }, 300); // Match CSS fade duration
    }
  };

  // Cycle messages every 5 seconds
  useEffect(() => {
    if (!gameState) return;

    // Initial message
    updateMessage();

    cycleRef.current = setInterval(updateMessage, MESSAGE_CYCLE_MS);
    return () => clearInterval(cycleRef.current);
  }, [gameState?.pet?.state]); // Re-setup on state change

  // Force update on care actions or state transitions
  useEffect(() => {
    if (forceUpdate) updateMessage();
  }, [forceUpdate]);

  return (
    <p
      class={`status-message ${fading ? 'status-message--fading' : ''}`}
      style={{ color: `var(${colorVar})` }}
    >
      {displayText}
    </p>
  );
}
