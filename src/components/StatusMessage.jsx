/**
 * Status message — displays pet state context.
 * Phase 3: Dynamic States
 * Phase 4: Will be extended with personality messages.
 */

const STATE_MESSAGES = {
  normal:  { text: '▸ ALL SYSTEMS NOMINAL', colorVar: '--accent-cyan' },
  sick:    { text: '⚠ CRITICAL ERROR: Systems degraded', colorVar: '--accent-danger' },
  evolved: { text: '★ FIRMWARE v2.0 — Enhanced protocols active', colorVar: '--accent-evolved' },
};

export function StatusMessage({ petState }) {
  const config = STATE_MESSAGES[petState] || STATE_MESSAGES.normal;

  return (
    <p
      class="status-message"
      style={{ color: `var(${config.colorVar})` }}
    >
      {config.text}
    </p>
  );
}
