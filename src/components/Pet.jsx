/**
 * Pet display component — blob creature with state-based visuals.
 * Phase 3: Dynamic States
 *
 * Visual modes:
 *   .pet--normal  → cyan glow, smooth idle animation
 *   .pet--sick    → red glitch, distorted shape
 *   .pet--evolved → purple glow, shimmer effects, larger
 */
export function Pet({ state, name }) {
  const stateClass = `pet--${state || 'normal'}`;

  return (
    <div class={`pet-container ${stateClass}`}>
      <div class="pet-blob">
        <div class="pet-blob__eyes">
          <span class="pet-blob__eye pet-blob__eye--left" />
          <span class="pet-blob__eye pet-blob__eye--right" />
        </div>
      </div>

      {/* Evolved: shimmer particles */}
      {state === 'evolved' && (
        <div class="pet-particles">
          <span class="pet-particle" />
          <span class="pet-particle" />
          <span class="pet-particle" />
          <span class="pet-particle" />
          <span class="pet-particle" />
          <span class="pet-particle" />
        </div>
      )}

      {/* Sick: static noise overlay */}
      {state === 'sick' && (
        <div class="pet-static-overlay" />
      )}

      {name && <span class="pet-name">[ {name} ]</span>}
    </div>
  );
}
