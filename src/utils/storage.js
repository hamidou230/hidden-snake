/**
 * Utilitaires de stockage local pour Hidden Snake
 * Gère la persistance du meilleur score et des préférences
 */

const STORAGE_KEYS = {
  HIGH_SCORE: 'hidden_snake_high_score',
  SOUND_ENABLED: 'hidden_snake_sound_enabled',
  GAMES_PLAYED: 'hidden_snake_games_played',
};

/**
 * Récupère le meilleur score depuis le localStorage
 * @returns {number} Le meilleur score ou 0 si non défini
 */
export const getHighScore = () => {
  try {
    const score = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.warn('Impossible de lire le meilleur score:', error);
    return 0;
  }
};

/**
 * Sauvegarde le meilleur score
 * @param {number} score - Le score à sauvegarder
 * @returns {boolean} True si la sauvegarde a réussi
 */
export const setHighScore = (score) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    return true;
  } catch (error) {
    console.warn('Impossible de sauvegarder le meilleur score:', error);
    return false;
  }
};

/**
 * Met à jour le meilleur score si le nouveau score est supérieur
 * @param {number} newScore - Le nouveau score à comparer
 * @returns {boolean} True si c'est un nouveau record
 */
export const updateHighScore = (newScore) => {
  const currentHighScore = getHighScore();
  if (newScore > currentHighScore) {
    setHighScore(newScore);
    return true;
  }
  return false;
};

/**
 * Récupère la préférence de son
 * @returns {boolean} True si le son est activé
 */
export const getSoundEnabled = () => {
  try {
    const enabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    // Par défaut, le son est activé
    return enabled === null ? true : enabled === 'true';
  } catch (error) {
    return true;
  }
};

/**
 * Sauvegarde la préférence de son
 * @param {boolean} enabled - True pour activer le son
 */
export const setSoundEnabled = (enabled) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled.toString());
  } catch (error) {
    console.warn('Impossible de sauvegarder la préférence de son:', error);
  }
};

/**
 * Incrémente le compteur de parties jouées
 * @returns {number} Le nouveau nombre de parties
 */
export const incrementGamesPlayed = () => {
  try {
    const current = parseInt(localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED) || '0', 10);
    const newCount = current + 1;
    localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, newCount.toString());
    return newCount;
  } catch (error) {
    return 0;
  }
};

/**
 * Récupère le nombre de parties jouées
 * @returns {number} Le nombre de parties
 */
export const getGamesPlayed = () => {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED) || '0', 10);
  } catch (error) {
    return 0;
  }
};

/**
 * Réinitialise toutes les données sauvegardées
 */
export const resetAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Impossible de réinitialiser les données:', error);
  }
};

export default {
  getHighScore,
  setHighScore,
  updateHighScore,
  getSoundEnabled,
  setSoundEnabled,
  incrementGamesPlayed,
  getGamesPlayed,
  resetAllData,
};
