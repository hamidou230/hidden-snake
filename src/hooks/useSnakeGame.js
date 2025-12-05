import { useState, useCallback, useRef, useEffect } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 140;
const SPEED_INCREMENT = 4;
const MIN_SPEED = 50;

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const getInitialSnake = () => [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const generateFood = (snake) => {
  let food, attempts = 0;
  do {
    food = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    attempts++;
  } while (attempts < 100 && snake.some(s => s.x === food.x && s.y === food.y));
  return food;
};

const getHighScore = () => {
  try { return parseInt(localStorage.getItem('snake_hs') || '0', 10); } catch { return 0; }
};

const saveHighScore = (score) => {
  try {
    if (score > getHighScore()) {
      localStorage.setItem('snake_hs', score.toString());
      return true;
    }
  } catch {}
  return false;
};

export const useSnakeGame = (onEat, onGameOver) => {
  const [snake, setSnake] = useState(getInitialSnake);
  const [food, setFood] = useState(() => generateFood(getInitialSnake()));
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const dirRef = useRef(DIRECTIONS.RIGHT);
  const nextDirRef = useRef(DIRECTIONS.RIGHT);
  const snakeRef = useRef(getInitialSnake());
  const foodRef = useRef(food);
  const scoreRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);
  const stateRef = useRef('idle');
  const loopRef = useRef(null);
  const lastRef = useRef(0);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { stateRef.current = gameState; }, [gameState]);

  const gameOver = useCallback(() => {
    stateRef.current = 'gameOver';
    setGameState('gameOver');
    onGameOver?.();
    if (saveHighScore(scoreRef.current)) {
      setIsNewRecord(true);
      setHighScore(scoreRef.current);
    }
  }, [onGameOver]);

  const move = useCallback(() => {
    if (stateRef.current !== 'playing') return;

    const s = [...snakeRef.current];
    const f = foodRef.current;
    const d = nextDirRef.current;
    dirRef.current = d;

    const head = s[0];
    const newHead = { x: head.x + d.x, y: head.y + d.y };

    // Collision murs
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      gameOver();
      return;
    }

    // Collision corps
    if (s.slice(0, -1).some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      gameOver();
      return;
    }

    const newSnake = [newHead, ...s];

    // Manger
    if (newHead.x === f.x && newHead.y === f.y) {
      onEat?.();
      scoreRef.current += 10;
      setScore(scoreRef.current);
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
      foodRef.current = generateFood(newSnake);
      setFood(foodRef.current);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    setSnake(newSnake);
  }, [gameOver, onEat]);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      return;
    }

    const loop = (ts) => {
      if (stateRef.current !== 'playing') return;
      if (ts - lastRef.current >= speedRef.current) {
        move();
        lastRef.current = ts;
      }
      loopRef.current = requestAnimationFrame(loop);
    };

    lastRef.current = performance.now();
    loopRef.current = requestAnimationFrame(loop);

    return () => { if (loopRef.current) cancelAnimationFrame(loopRef.current); };
  }, [gameState, move]);

  const changeDirection = useCallback((dir) => {
    if (stateRef.current !== 'playing') return;
    const d = DIRECTIONS[dir];
    if (!d) return;
    const c = dirRef.current;
    if ((c.x && c.x === -d.x) || (c.y && c.y === -d.y)) return;
    nextDirRef.current = d;
  }, []);

  const startGame = useCallback(() => {
    const s = getInitialSnake();
    const f = generateFood(s);
    snakeRef.current = s;
    foodRef.current = f;
    dirRef.current = DIRECTIONS.RIGHT;
    nextDirRef.current = DIRECTIONS.RIGHT;
    scoreRef.current = 0;
    speedRef.current = INITIAL_SPEED;
    setSnake(s);
    setFood(f);
    setScore(0);
    setIsNewRecord(false);
    stateRef.current = 'playing';
    setGameState('playing');
  }, []);

  const togglePause = useCallback(() => {
    if (stateRef.current === 'playing') {
      stateRef.current = 'paused';
      setGameState('paused');
    } else if (stateRef.current === 'paused') {
      stateRef.current = 'playing';
      setGameState('playing');
      lastRef.current = performance.now();
    }
  }, []);

  return {
    snake, food, gameState, score, highScore, isNewRecord,
    gridSize: GRID_SIZE, cellSize: CELL_SIZE,
    startGame, togglePause, restartGame: startGame, changeDirection,
  };
};

export default useSnakeGame;
