import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Activation secrète : Konami Code + Long Press
 */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];

const SecretActivator = ({ onActivate }) => {
  const [progress, setProgress] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const sequenceRef = useRef([]);
  const timerRef = useRef(null);
  const pressTimerRef = useRef(null);
  const pressIntervalRef = useRef(null);

  // Konami Code
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      sequenceRef.current.push(e.code);
      
      // Vérifier
      const seq = sequenceRef.current;
      const expected = KONAMI.slice(0, seq.length);
      
      if (seq.join(',') === expected.join(',')) {
        setProgress((seq.length / KONAMI.length) * 100);
        
        if (seq.length === KONAMI.length) {
          onActivate?.();
          sequenceRef.current = [];
          setProgress(0);
        }
      } else {
        // Reset si mauvaise touche
        if (e.code === KONAMI[0]) {
          sequenceRef.current = [e.code];
          setProgress((1 / KONAMI.length) * 100);
        } else {
          sequenceRef.current = [];
          setProgress(0);
        }
      }
      
      // Reset timeout
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        sequenceRef.current = [];
        setProgress(0);
      }, 2000);
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      clearTimeout(timerRef.current);
    };
  }, [onActivate]);

  // Long Press
  const startPress = useCallback(() => {
    setIsPressed(true);
    const startTime = Date.now();
    
    pressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const prog = Math.min((elapsed / 2000) * 100, 100);
      setPressProgress(prog);
    }, 50);
    
    pressTimerRef.current = setTimeout(() => {
      onActivate?.();
      setIsPressed(false);
      setPressProgress(0);
      clearInterval(pressIntervalRef.current);
    }, 2000);
  }, [onActivate]);

  const endPress = useCallback(() => {
    setIsPressed(false);
    setPressProgress(0);
    clearTimeout(pressTimerRef.current);
    clearInterval(pressIntervalRef.current);
  }, []);

  return (
    <>
      {/* Barre Konami */}
      {progress > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-sm">🎮</span>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Zone Long Press */}
      <div
        className="fixed bottom-4 right-4 w-12 h-12 z-50 rounded-full cursor-pointer opacity-10 hover:opacity-30 transition-opacity"
        style={{
          background: isPressed 
            ? `conic-gradient(#22c55e ${pressProgress}%, transparent ${pressProgress}%)`
            : 'radial-gradient(#22c55e, transparent)',
        }}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={(e) => { e.preventDefault(); startPress(); }}
        onTouchEnd={endPress}
        onTouchCancel={endPress}
        aria-label="Zone secrète"
      />
    </>
  );
};

export default SecretActivator;
