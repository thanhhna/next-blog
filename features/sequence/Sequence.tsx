import React, { useState, useCallback, useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import range from 'range';
import random from 'random';
import Board from './Board';
import { Coordinate, BoxData, Position } from './types';
import styles from './Sequence.module.scss';

const GRID_WIDTH = isMobileOnly ? 40 : 70;
const RANDOM_GAP = isMobileOnly ? 10 : 20;

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
  const [gridSize, setGridSize] = useState({col: 0, row: 0});
  
  const containerRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current.getBoundingClientRect();
      const size = {
        col: Math.floor(element.width / GRID_WIDTH),
        row: Math.floor(element.height / GRID_WIDTH)
      };
      const DEFAULT_ROW_NUMBER = 8;
      if (size.row <= 0) {
        size.row = DEFAULT_ROW_NUMBER;
      }
      if (isMobileOnly) {
        size.row = size.row - 1;
      }
      setGridSize(size);
    }
  }, []);

  const allCoordinates: Coordinate[] = [];

  range.range(0, gridSize.row - 1).forEach((y: number) => {
    range.range(0, gridSize.col).forEach((x: number) => {
      allCoordinates.push({ x, y });
    });
  });

  function genPositions () {
    const positions = randPositions(gameMode.sequenceMax, allCoordinates);
    setSequencePositions(positions);
  }

  const genBoxData = useCallback(() => {
    return allCoordinates.map((pos: Coordinate, index: number) => {
      const posExists = sequencePositions.find(p => p.x === pos.x && p.y === pos.y);


      let left = random.int(-RANDOM_GAP, RANDOM_GAP);
      let top = random.int(-RANDOM_GAP, RANDOM_GAP);

      if (pos.x === gridSize.col - 1) {
        left = -1 * Math.abs(left);
      }
      if (pos.x === 0) {
        left = Math.abs(left);
      }
      if (pos.y === gridSize.row - 1) {
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
  }, [sequencePositions, allCoordinates, gridSize]);

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
    <div className={styles.container} >
      <div ref={containerRef}>
        <Board
          timeLimit={gameMode.timeLimit}
          boxesData={boxesData}
          gridWidth={GRID_WIDTH}
          sequenceMaxNumber={gameMode.sequenceMax}
          onFinishGame={handleFinishGame}
          onResetGame={handleResetGame}
          onStartGame={handleStartGame}
        />
      </div>
    </div>
  );
}