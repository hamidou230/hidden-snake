import { useEffect, useRef, useCallback, useState } from 'react';
import Modal from './Modal';
import MobileControls from './MobileControls';
import useSnakeGame from '../hooks/useSnakeGame';

// ===== SON PC + MOBILE =====
class GameSound {
  constructor() { this.ctx = null; this.enabled = true; }
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = this.ctx.createBuffer(1, 1, 22050);
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.connect(this.ctx.destination);
      src.start(0);
    } catch (e) {}
  }
  resume() { if (this.ctx?.state === 'suspended') this.ctx.resume(); }
  play(freq, dur, type = 'sine', vol = 0.2) {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {}
  }
  eat() { this.play(520, 0.08, 'sine', 0.3); setTimeout(() => this.play(660, 0.08, 'sine', 0.25), 50); setTimeout(() => this.play(780, 0.1, 'sine', 0.2), 100); }
  die() { this.play(200, 0.25, 'sawtooth', 0.25); setTimeout(() => this.play(140, 0.35, 'sawtooth', 0.2), 180); }
  click() { this.play(600, 0.04, 'square', 0.15); }
}
const sound = new GameSound();

const HiddenSnake = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasDisplaySize, setCanvasDisplaySize] = useState(300);

  // Détecter mobile
  useEffect(() => {
    const check = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) || ('ontouchstart' in window && window.innerWidth < 900));
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Calculer taille canvas responsive
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Sur mobile, laisser de la place pour les contrôles
      let maxSize;
      if (isMobile) {
        // Hauteur disponible = écran - header(60) - scores(60) - contrôles(220) - marges(40)
        const availableHeight = vh - 380;
        const availableWidth = vw - 32; // padding 16px de chaque côté
        maxSize = Math.min(availableWidth, availableHeight, 320);
      } else {
        maxSize = Math.min(vw - 80, vh - 200, 400);
      }
      
      setCanvasDisplaySize(Math.max(200, maxSize));
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isMobile]);

  const onEat = useCallback(() => sound.eat(), []);
  const onGameOver = useCallback(() => sound.die(), []);

  const { snake, food, gameState, score, highScore, isNewRecord, gridSize, cellSize, startGame, togglePause, restartGame, changeDirection } = useSnakeGame(onEat, onGameOver);

  const initSound = useCallback(() => { sound.init(); sound.resume(); }, []);
  useEffect(() => { sound.enabled = !isMuted; }, [isMuted]);

  // Clavier PC
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      initSound();
      const map = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT', KeyW: 'UP', KeyS: 'DOWN', KeyA: 'LEFT', KeyD: 'RIGHT' };
      if (map[e.code]) { e.preventDefault(); changeDirection(map[e.code]); }
      if (e.code === 'Space') { e.preventDefault(); sound.click(); gameState === 'idle' || gameState === 'gameOver' ? startGame() : togglePause(); }
      if (e.code === 'KeyR') { e.preventDefault(); sound.click(); restartGame(); }
      if (e.code === 'KeyM') { e.preventDefault(); setIsMuted(m => !m); }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [isOpen, gameState, changeDirection, startGame, togglePause, restartGame, initSound]);

  // Swipe
  const touchRef = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e) => { initSound(); touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) < 35 && Math.abs(dy) < 35) return;
    if (Math.abs(dx) > Math.abs(dy)) changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    else changeDirection(dy > 0 ? 'DOWN' : 'UP');
  };

  // ===== DESSIN CANVAS =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = gridSize * cellSize;

    // Fond
    const bg = ctx.createLinearGradient(0, 0, W, W);
    bg.addColorStop(0, '#0c1015');
    bg.addColorStop(0.5, '#111820');
    bg.addColorStop(1, '#0c1015');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, W);

    // Grille
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.07)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, W); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cellSize); ctx.lineTo(W, i * cellSize); ctx.stroke();
    }

    // Pomme
    if (food) {
      const fx = food.x * cellSize + cellSize / 2;
      const fy = food.y * cellSize + cellSize / 2;
      const r = cellSize / 2 - 2;
      ctx.shadowColor = '#ff3b3b';
      ctx.shadowBlur = 18;
      const appleGrad = ctx.createRadialGradient(fx - 2, fy - 2, 0, fx, fy, r);
      appleGrad.addColorStop(0, '#ff6b6b');
      appleGrad.addColorStop(0.7, '#dc2626');
      appleGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = appleGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#78350f';
      ctx.fillRect(fx - 1.5, fy - r - 4, 3, 5);
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(fx + 4, fy - r - 1, 4, 2.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(fx - r / 3, fy - r / 3, r / 3.5, r / 4.5, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Serpent
    if (snake && snake.length) {
      snake.forEach((seg, i) => {
        const x = seg.x * cellSize;
        const y = seg.y * cellSize;
        const isHead = i === 0;
        const isTail = i === snake.length - 1;

        if (isHead) { ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 15; } else { ctx.shadowBlur = 0; }

        const light = isHead ? 58 : Math.max(32, 52 - i * 1.8);
        const sat = isHead ? 75 : 65;
        const segGrad = ctx.createRadialGradient(x + cellSize/2, y + cellSize/2, 0, x + cellSize/2, y + cellSize/2, cellSize);
        segGrad.addColorStop(0, `hsl(145, ${sat}%, ${light + 12}%)`);
        segGrad.addColorStop(0.6, `hsl(145, ${sat}%, ${light}%)`);
        segGrad.addColorStop(1, `hsl(145, ${sat - 10}%, ${light - 10}%)`);
        ctx.fillStyle = segGrad;

        const p = 1.5, s = cellSize - p * 2, rad = isHead ? 7 : isTail ? 5 : 4;
        ctx.beginPath();
        ctx.moveTo(x + p + rad, y + p);
        ctx.lineTo(x + p + s - rad, y + p);
        ctx.quadraticCurveTo(x + p + s, y + p, x + p + s, y + p + rad);
        ctx.lineTo(x + p + s, y + p + s - rad);
        ctx.quadraticCurveTo(x + p + s, y + p + s, x + p + s - rad, y + p + s);
        ctx.lineTo(x + p + rad, y + p + s);
        ctx.quadraticCurveTo(x + p, y + p + s, x + p, y + p + s - rad);
        ctx.lineTo(x + p, y + p + rad);
        ctx.quadraticCurveTo(x + p, y + p, x + p + rad, y + p);
        ctx.fill();

        if (!isHead && i % 2 === 0) {
          ctx.fillStyle = `hsla(145, 60%, ${light + 8}%, 0.3)`;
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 5, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isHead) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.ellipse(x + cellSize / 2 - 4, y + cellSize / 2.5, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(x + cellSize / 2 + 4, y + cellSize / 2.5, 3.5, 4, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.beginPath(); ctx.arc(x + cellSize / 2 - 4, y + cellSize / 2.5, 2, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + cellSize / 2 + 4, y + cellSize / 2.5, 2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(x + cellSize / 2 - 5, y + cellSize / 2.5 - 1, 1, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x + cellSize / 2 + 3, y + cellSize / 2.5 - 1, 1, 0, Math.PI * 2); ctx.fill();
          if (gameState === 'playing') {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(x + cellSize / 2, y + cellSize - 2);
            ctx.lineTo(x + cellSize / 2 - 2, y + cellSize + 4);
            ctx.lineTo(x + cellSize / 2, y + cellSize + 2);
            ctx.lineTo(x + cellSize / 2 + 2, y + cellSize + 4);
            ctx.closePath();
            ctx.fill();
          }
        }
      });
      ctx.shadowBlur = 0;
    }

    // Overlay
    if (gameState !== 'playing') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
      ctx.fillRect(0, 0, W, W);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (gameState === 'idle') {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#4ade80';
        ctx.fillText('🐍 SNAKE', W / 2, W / 2 - 25);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#9ca3af';
        ctx.fillText('Appuyez pour jouer', W / 2, W / 2 + 12);
      } else if (gameState === 'paused') {
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('⏸ PAUSE', W / 2, W / 2);
      } else if (gameState === 'gameOver') {
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('💀 GAME OVER', W / 2, W / 2 - 30);
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#4ade80';
        ctx.fillText('Score: ' + score, W / 2, W / 2 + 5);
        if (isNewRecord) {
          ctx.font = 'bold 14px Arial';
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('🏆 NOUVEAU RECORD!', W / 2, W / 2 + 35);
        }
        ctx.font = '12px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Appuyez pour rejouer', W / 2, W / 2 + 60);
      }
    }
  }, [snake, food, gameState, gridSize, cellSize, score, isNewRecord]);

  const canvasSize = gridSize * cellSize;

  const handleClick = () => {
    initSound();
    if (gameState === 'idle' || gameState === 'gameOver') { sound.click(); startGame(); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🐍 Hidden Snake">
      <div 
        ref={containerRef}
        className="flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-4" 
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
      >
        {/* Scores - compact sur mobile */}
        <div className="w-full flex justify-between items-center px-2">
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Score</div>
            <div className="text-xl sm:text-3xl font-bold text-green-400">{score}</div>
          </div>
          
          {/* Boutons PC */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <button onClick={() => { initSound(); setIsMuted(m => !m); }} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-sm sm:text-lg" aria-label="Son">{isMuted ? '🔇' : '🔊'}</button>
              <button onClick={() => { initSound(); sound.click(); togglePause(); }} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-sm sm:text-lg" aria-label="Pause">{gameState === 'paused' ? '▶️' : '⏸️'}</button>
              <button onClick={() => { initSound(); sound.click(); restartGame(); }} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-sm sm:text-lg" aria-label="Restart">🔄</button>
              <button onClick={onClose} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-900/50 hover:bg-red-800/50 flex items-center justify-center text-sm sm:text-lg text-red-400" aria-label="Fermer">✕</button>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Record</div>
            <div className="text-xl sm:text-3xl font-bold text-yellow-400">{highScore}</div>
          </div>
        </div>

        {/* Canvas responsive */}
        <div 
          className="relative rounded-xl overflow-hidden flex-shrink-0" 
          style={{ 
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.2), inset 0 0 20px rgba(0,0,0,0.5)', 
            border: '2px solid rgba(34, 197, 94, 0.4)' 
          }}
        >
          <canvas 
            ref={canvasRef} 
            width={canvasSize} 
            height={canvasSize} 
            onClick={handleClick}
            onTouchEnd={(e) => {
              if (gameState === 'idle' || gameState === 'gameOver') {
                e.preventDefault();
                handleClick();
              }
            }}
            className="block cursor-pointer" 
            style={{ 
              width: canvasDisplaySize, 
              height: canvasDisplaySize,
            }} 
          />
        </div>

        {/* Contrôles MOBILE UNIQUEMENT */}
        {isMobile && (
          <MobileControls
            onDirection={(d) => { initSound(); changeDirection(d); }}
            onPause={() => { initSound(); sound.click(); togglePause(); }}
            onRestart={() => { initSound(); sound.click(); restartGame(); }}
            onClose={onClose}
            onMute={() => { initSound(); setIsMuted(m => !m); }}
            isPaused={gameState === 'paused'}
            isMuted={isMuted}
          />
        )}

        {/* Instructions PC */}
        {!isMobile && (
          <p className="text-[10px] sm:text-xs text-gray-500 text-center px-2">
            <span className="text-green-400">↑↓←→</span> déplacer • <span className="text-green-400">Espace</span> pause • <span className="text-green-400">R</span> restart • <span className="text-green-400">M</span> mute
          </p>
        )}
      </div>
    </Modal>
  );
};

export default HiddenSnake;
