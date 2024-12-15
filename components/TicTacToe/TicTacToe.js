import "./TicTacToe.css";

import { useState, useEffect, useCallback } from "react";
import { useDaily, useDailyEvent } from "@daily-co/daily-react";

export default function TicTacToe() {
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerTurn, setPlayerTurn] = useState("X");
  const [playerX, setPlayerX] = useState(null);
  const [playerO, setPlayerO] = useState(null);
  const [moveComplete, setMoveComplete] = useState(false);

  useDailyEvent(
    "participant-joined",
    useCallback(() => {
      const playerX = "X";
      const playerO = "O";

      setPlayerX(playerX);
      setPlayerO(playerO);
    })
  );

  useDailyEvent(
    "app-message",
    useCallback((event) => {
      if (event?.data?.type === "game-state-update") {
        setGameState(event.data.board);
        setIsXNext(event.data.isXNext);
        setWinner(event.data.winner);
        setPlayerTurn(event.data.playerTurn);
      }
    })
  );

  useDailyEvent(
    "app-message",
    useCallback((event) => {
      if (event?.data?.type === "game-state-reset") {
        setGameState(event.data.board);
        setIsXNext(event.data.isXNext);
        setWinner(event.data.winner);
        setPlayerTurn(event.data.playerTurn);
      }
    })
  );

  const daily = useDaily();

  useEffect(() => {
    if (daily && playerX && playerO && moveComplete) {
      daily.sendAppMessage({
        type: "game-state-update",
        board: gameState,
        isXNext: isXNext,
        winner: winner,
        playerTurn: playerTurn,
      });

      setMoveComplete(false);
    }
  }, [
    gameState,
    isXNext,
    winner,
    playerTurn,
    daily,
    playerX,
    playerO,
    moveComplete,
  ]);

  const handleClick = (index) => {
    if (gameState[index] || winner || playerTurn !== (isXNext ? "X" : "O"))
      return;

    const newGameState = [...gameState];
    newGameState[index] = playerTurn;

    const nextPlayer = isXNext ? "O" : "X";

    setGameState(newGameState);
    setIsXNext(!isXNext);
    setPlayerTurn(nextPlayer);

    checkWinner(newGameState);

    setMoveComplete(true);
  };

  const checkWinner = (gameState) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        gameState[a] &&
        gameState[a] === gameState[b] &&
        gameState[a] === gameState[c]
      ) {
        setWinner(gameState[a]);
        return;
      }
    }

    if (!gameState.includes(null)) setWinner("Draw");
  };

  const renderSquare = (index) => (
    <button onClick={() => handleClick(index)} key={index} className="square">
      {gameState[index]}
    </button>
  );

  const resetGame = () => {
    setGameState(Array(9).fill(null));
    setIsXNext(true);
    setPlayerTurn("X");
    setWinner(null);
    setMoveComplete(false);

    if (daily && playerX && playerO) {
      daily.sendAppMessage({
        type: "game-state-reset",
        board: Array(9).fill(null),
        isXNext: true,
        winner: null,
        playerTurn: "X",
      });
    }
  };

  return (
    <div className="game">
      <button onClick={resetGame} className="reset-button">
        Reset Game
      </button>

      <div className="board">
        {gameState.map((_, index) => renderSquare(index))}
      </div>
      {winner && (
        <p className="winner">
          {winner === "Draw" ? "It's a draw!" : `${winner} wins!`}
        </p>
      )}
      <p>It's {playerTurn}'s turn</p>
    </div>
  );
}
