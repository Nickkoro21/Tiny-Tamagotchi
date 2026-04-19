/**
 * JSON export/import — manual save/load to file
 * Phase 2: Care Loop
 */

import { validateState } from './localStorage.js';

/**
 * Export game state as a downloadable JSON file.
 */
export function exportToJson(state) {
  try {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().slice(0, 10);
    const filename = `tamagotchi_save_${today}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.warn('Failed to export JSON:', e);
    return false;
  }
}

/**
 * Import game state from a JSON file.
 * Returns a Promise that resolves to the parsed state, or null if invalid.
 */
export function importFromJson(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const state = JSON.parse(e.target.result);
        if (validateState(state)) {
          resolve(state);
        } else {
          alert('Invalid save file: structure or version mismatch.');
          resolve(null);
        }
      } catch {
        alert('Invalid file: could not parse JSON.');
        resolve(null);
      }
    };

    reader.onerror = () => {
      alert('Error reading file.');
      resolve(null);
    };

    reader.readAsText(file);
  });
}
