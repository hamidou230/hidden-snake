import { useCallback, useRef } from 'react';

/**
 * Contrôles tactiles compacts et responsive
 */
const MobileControls = ({ 
  onDirection, 
  onPause, 
  onRestart, 
  onClose,
  onMute,
  isPaused,
  isMuted,
}) => {
  const intervalRef = useRef(null);

  const handleStart = useCallback((dir) => {
    onDirection(dir);
    intervalRef.current = setInterval(() => onDirection(dir), 100);
  }, [onDirection]);

  const handleEnd = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const dirHandlers = (dir) => ({
    onTouchStart: (e) => { e.preventDefault(); handleStart(dir); },
    onTouchEnd: (e) => { e.preventDefault(); handleEnd(); },
    onTouchCancel: handleEnd,
  });

  // Tailles adaptatives
  const dirBtn = `
    flex items-center justify-center select-none
    w-12 h-12 sm:w-14 sm:h-14
    rounded-xl sm:rounded-2xl
    bg-black/70 backdrop-blur-sm
    border-2 border-green-400/50
    text-green-400 text-xl sm:text-2xl font-bold
    active:scale-90 active:bg-green-500/30
    transition-transform duration-75
  `;
  
  const actionBtn = `
    flex items-center justify-center select-none
    w-10 h-10 sm:w-12 sm:h-12
    rounded-lg sm:rounded-xl
    bg-black/60 backdrop-blur-sm
    border border-green-400/30
    text-base sm:text-lg
    active:scale-90 active:bg-green-500/20
    transition-transform duration-75
  `;

  return (
    <div className="w-full flex flex-col items-center gap-2 sm:gap-3 px-2 pb-4 safe-bottom select-none">
      {/* Boutons action - ligne compacte */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <button className={actionBtn} onTouchEnd={(e) => { e.preventDefault(); onMute(); }} aria-label="Son">
          {isMuted ? '🔇' : '🔊'}
        </button>
        <button className={actionBtn} onTouchEnd={(e) => { e.preventDefault(); onPause(); }} aria-label="Pause">
          {isPaused ? '▶️' : '⏸️'}
        </button>
        <button className={actionBtn} onTouchEnd={(e) => { e.preventDefault(); onRestart(); }} aria-label="Restart">
          🔄
        </button>
        <button className={`${actionBtn} !border-red-500/50`} onTouchEnd={(e) => { e.preventDefault(); onClose(); }} aria-label="Fermer">
          <span className="text-red-400">✕</span>
        </button>
      </div>

      {/* D-Pad compact */}
      <div className="relative" style={{ width: '156px', height: '156px' }}>
        {/* Haut */}
        <button className={`${dirBtn} absolute left-1/2 -translate-x-1/2 top-0`} {...dirHandlers('UP')} aria-label="Haut">▲</button>
        {/* Gauche */}
        <button className={`${dirBtn} absolute top-1/2 -translate-y-1/2 left-0`} {...dirHandlers('LEFT')} aria-label="Gauche">◀</button>
        {/* Centre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20" />
        {/* Droite */}
        <button className={`${dirBtn} absolute top-1/2 -translate-y-1/2 right-0`} {...dirHandlers('RIGHT')} aria-label="Droite">▶</button>
        {/* Bas */}
        <button className={`${dirBtn} absolute left-1/2 -translate-x-1/2 bottom-0`} {...dirHandlers('DOWN')} aria-label="Bas">▼</button>
      </div>
    </div>
  );
};

export default MobileControls;
