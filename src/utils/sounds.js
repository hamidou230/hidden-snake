/**
 * Gestion des sons du jeu Snake
 * Utilise l'API Web Audio pour des sons réactifs
 */

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.initialized = false;
  }

  /**
   * Initialise le contexte audio (doit être appelé après une interaction utilisateur)
   */
  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.warn('Web Audio API non supportée:', error);
    }
  }

  /**
   * Active ou désactive les sons
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Crée un son de type "bip" synthétique
   * @param {number} frequency - Fréquence en Hz
   * @param {number} duration - Durée en secondes
   * @param {string} type - Type d'oscillateur (sine, square, sawtooth, triangle)
   * @param {number} volume - Volume (0-1)
   */
  playTone(frequency, duration, type = 'square', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    try {
      // Reprendre le contexte si suspendu
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      // Envelope pour un son plus agréable
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      // Silently fail si le son ne peut pas être joué
    }
  }

  /**
   * Son quand le serpent mange la nourriture
   */
  playEat() {
    if (!this.initialized) this.init();
    
    // Son montant agréable
    this.playTone(440, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(554, 0.1, 'sine', 0.2), 50);
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.15), 100);
  }

  /**
   * Son de game over
   */
  playGameOver() {
    if (!this.initialized) this.init();
    
    // Son descendant dramatique
    this.playTone(440, 0.15, 'sawtooth', 0.2);
    setTimeout(() => this.playTone(349, 0.15, 'sawtooth', 0.2), 150);
    setTimeout(() => this.playTone(294, 0.2, 'sawtooth', 0.15), 300);
    setTimeout(() => this.playTone(220, 0.4, 'sawtooth', 0.1), 450);
  }

  /**
   * Son de nouveau record
   */
  playNewRecord() {
    if (!this.initialized) this.init();
    
    // Fanfare simple
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.2), i * 100);
    });
  }

  /**
   * Son de clic/interaction
   */
  playClick() {
    if (!this.initialized) this.init();
    this.playTone(800, 0.05, 'square', 0.1);
  }

  /**
   * Son de pause
   */
  playPause() {
    if (!this.initialized) this.init();
    this.playTone(300, 0.1, 'sine', 0.15);
  }

  /**
   * Son de reprise
   */
  playResume() {
    if (!this.initialized) this.init();
    this.playTone(500, 0.1, 'sine', 0.15);
  }

  /**
   * Son d'activation du jeu secret
   */
  playSecretActivation() {
    if (!this.initialized) this.init();
    
    // Mélodie mystérieuse
    const melody = [262, 330, 392, 523, 659, 784];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.15), i * 80);
    });
  }
}

// Instance singleton
const soundManager = new SoundManager();

export default soundManager;
