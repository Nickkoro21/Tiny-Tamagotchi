import { getStatLevel } from '../engine/vitals.js';

/**
 * Single stat bar with label, fill, and numeric value.
 */
function StatBar({ label, value, icon, colorVar }) {
  const level = getStatLevel(value);
  const displayValue = Math.round(value);

  return (
    <div class={`stat-bar stat-bar--${level}`}>
      <div class="stat-bar__header">
        <span class="stat-bar__icon">{icon}</span>
        <span class="stat-bar__label">{label}</span>
        <span class="stat-bar__value">{displayValue}</span>
      </div>
      <div class="stat-bar__track">
        <div
          class="stat-bar__fill"
          style={{
            width: `${displayValue}%`,
            backgroundColor: `var(${colorVar})`,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Stats panel — displays all three vital stat bars.
 */
export function Stats({ hunger, happiness, energy }) {
  return (
    <div class="stats-container">
      <StatBar label="HUNGER" value={hunger} icon="⚡" colorVar="--stat-hunger" />
      <StatBar label="HAPPINESS" value={happiness} icon="✧" colorVar="--stat-happiness" />
      <StatBar label="ENERGY" value={energy} icon="◉" colorVar="--stat-energy" />
    </div>
  );
}
