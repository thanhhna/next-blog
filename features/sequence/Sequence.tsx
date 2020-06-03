import React, { useState, useCallback } from 'react';
import range from 'range';
import random from 'random';
import Board from './Board';
import { Coordinate, BoxData, Position } from './types';

const BOARD_SIZE = 800;
const GRID_SIZE = 10;

interface GameMode {
  label: string,
  sequenceMax: number,
  timeLimit: number
}

const MODE: GameMode[] = [
  {
    label: 'Easy',
    sequenceMax: 30,
    timeLimit: 30
  },
  {
    label: 'Medium',
    sequenceMax: 40,
    timeLimit: 50
  },
  {
    label: 'Hard',
    sequenceMax: 50,
    timeLimit: 70
  }
];

function randPositions(sequenceMaxNumber: number, coordinates: Coordinate[]): Position[] {
  const positions: Position[] = [];

  range.range(0, sequenceMaxNumber).forEach((value: number) => {
    const remainCoordinates = coordinates.filter(
      c => !positions.some(p => p.x === c.x && p.y === c.y)
    );

    const index = random.int(0, remainCoordinates.length - 1);

    positions.push({
      ...remainCoordinates[index],
      value
    });
  });

  return positions;
}

export default function Sequence() {
  const [sequencePositions, setSequencePositions] = useState<Position[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>(MODE[0]);

  const allCoordinates = range.range(0, GRID_SIZE * GRID_SIZE).map((index: number) => {
    const pos = {
      x: index < 10 ? 0 : parseInt(index.toString()[0], 10),
      y: index < 10 ? index : parseInt(index.toString()[1], 10)
    };

    return pos;
  });

  function genPositions () {
    const positions = randPositions(gameMode.sequenceMax, allCoordinates);
    setSequencePositions(positions);
  }

  const genBoxData = useCallback(() => {
    return allCoordinates.map((pos: Coordinate, index: number) => {
      const posExists = sequencePositions.find(p => p.x === pos.x && p.y === pos.y);

      const GAP = 20;

      let left = random.int(-GAP, GAP);
      let top = random.int(-GAP, GAP);

      if (pos.x === GRID_SIZE - 1) {
        left = -1 * Math.abs(left);
      }
      if (pos.x === 0) {
        left = Math.abs(left);
      }
      if (pos.y === GRID_SIZE - 1) {
        top = -1 * Math.abs(top);
      }
      if (pos.y === 0) {
        top = Math.abs(top);
      }

      const style = {
        left: left,
        top: top
      };

      const data: BoxData = {
        coordinate: pos,
        id: index,
        position: posExists,
        style
      };

      return data;
    });
  }, [sequencePositions, allCoordinates]);

  const boxesData: BoxData[] = genBoxData();

  function handleResetGame() {
    genPositions();
  }

  function handleFinishGame() {

  }

  function handleStartGame() {
    genPositions();
  }

  return(
    <Board
      timeLimit={gameMode.timeLimit}
      boxesData={boxesData}
      boardSize={BOARD_SIZE}
      gridSize={GRID_SIZE}
      sequenceMaxNumber={gameMode.sequenceMax}
      onFinishGame={handleFinishGame}
      onResetGame={handleResetGame}
      onStartGame={handleStartGame}
    />
  );
}