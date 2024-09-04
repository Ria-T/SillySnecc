import React, { useState, useEffect } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  // Define the initial state
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const cellSize = 20;
  const boardSize = 20;

  // Function to handle key presses for controlling the snake and pausing the game
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault(); // Prevent default space bar behavior
      setPaused(!paused);
      return;
    }
    if (!paused && !gameOver) {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    const moveSnake = () => {
      if (paused || gameOver) return;

      let newSnake = [...snake];
      let head = { ...newSnake[0] };

      // Move the head of the snake in the current direction
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      // Check for collision with walls
      if (
        head.x < 0 ||
        head.x >= boardSize ||
        head.y < 0 ||
        head.y >= boardSize ||
        newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      // Add the new head to the snake
      newSnake.unshift(head);

      // Check if the snake has eaten the food
      if (head.x === food.x && head.y === food.y) {
        setScore(score + 1);
        setFood({
          x: Math.floor(Math.random() * boardSize),
          y: Math.floor(Math.random() * boardSize),
        });
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, 200);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction, food, score, gameOver, paused]);

  return (
    <div className="snake-game" role="application" aria-label="Snake Game">
      <div className="game-board">
        {Array.from({ length: boardSize }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: boardSize }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${snake.some(segment => segment.x === colIndex && segment.y === rowIndex) ? 'snake' : ''} ${food.x === colIndex && food.y === rowIndex ? 'food' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="score">
        Score: {score}
      </div>
      {paused && !gameOver && <div className="paused">Game Paused</div>}
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default SnakeGame;
