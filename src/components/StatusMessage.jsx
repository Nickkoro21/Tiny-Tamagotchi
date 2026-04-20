/**
 * Status message — displays contextual personality messages.
 * Phase 3: Basic state messages
 * Phase 4: Dynamic personality system with cycling messages
 */
import { useState, useEffect, useRef } from 'preact/hooks';
import { getMessage } from '../engine/personality.js';

const MESSAGE_CYCLE_MS = 5000; // Update message every 5 seconds

export function StatusMessage({ gameState, forceUpdate }) {
  const [displayText, setDisplayText] = useState('');
  const [colorVar, setColorVar] = useState('--accent-cyan');
  const [fading, setFading] = useState(false);
  const lastTextRef = useRef(null);
  const cycleRef = useRef(null);

  // Get and display a new message
  const updateMessage = () => {
    if (!gameState) return;

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
