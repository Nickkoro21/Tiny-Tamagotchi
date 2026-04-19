import { useState, useEffect } from 'preact/hooks';
import { COOLDOWNS, ACTION_EFFECTS } from '../engine/vitals.js';

/**
 * Single action button with cooldown timer.
 */
function ActionButton({ label, icon, actionKey, onClick, effectText }) {
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const cooldownDuration = COOLDOWNS[actionKey];

  const handleClick = () => {
    if (cooldownLeft > 0) return;
    onClick();
    setCooldownLeft(cooldownDuration);
  };

  // Cooldown countdown
  useEffect(() => {
    if (cooldownLeft <= 0) return;

    const timer = setTimeout(() => {
      setCooldownLeft((prev) => Math.max(0, prev - 100));
    }, 100);

    return () => clearTimeout(timer);
  }, [cooldownLeft]);

  const isOnCooldown = cooldownLeft > 0;
  const cooldownSec = (cooldownLeft / 1000).toFixed(1);

  return (
    <button
      class={`action-btn ${isOnCooldown ? 'action-btn--cooldown' : ''}`}
      onClick={handleClick}
      disabled={isOnCooldown}
      title={effectText}
    >
      <span class="action-btn__icon">{icon}</span>
      <span class="action-btn__label">{label}</span>
      {isOnCooldown && (
        <span class="action-btn__timer">{cooldownSec}s</span>
      )}
    </button>
  );
}

/**
 * Action buttons panel — Feed, Play, Rest.
 */
export function Actions({ onFeed, onPlay, onRest }) {
  return (
    <div class="actions-container">
      <ActionButton
        label="FEED"
        icon="⚡"
        actionKey="feed"
        onClick={onFeed}
        effectText="+30 Hunger, +5 Happiness"
      />
      <ActionButton
        label="PLAY"
        icon="✧"
        actionKey="play"
        onClick={onPlay}
        effectText="+25 Happiness, -10 Energy"
      />
      <ActionButton
        label="REST"
        icon="◉"
        actionKey="rest"
        onClick={onRest}
        effectText="+35 Energy, +5 Happiness"
      />
    </div>
  );
}
