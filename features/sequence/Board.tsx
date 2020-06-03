import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { BoxData, Position } from './types';
import Box from './Box';
import styles from './Sequence.module.scss';
import utilsStyle from 'styles/utils.module.scss';

interface BoardProps {
  gridSize: number,
  boardSize: number,
  boxesData: BoxData[],
  sequenceMaxNumber: number,
  onStartGame: () => void,
  onFinishGame: () => void,
  onResetGame: () => void,
  timeLimit: number
}

export default function Board(props: BoardProps) {
  const {
    gridSize,
    boardSize,
    boxesData,
    sequenceMaxNumber,
    onStartGame,
    onFinishGame,
    onResetGame,
    timeLimit
  } = props;

  const timerInterval = useRef<any>(undefined);

  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [timer, setTimer] = useState(timeLimit);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('Find numbers by order from the smallest to the biggest. Let\'s play');
  const [didReset, setDidReset] = useState(false);

  const boxSize = boardSize / gridSize;

  useEffect(() => {
    function runTimer() {
      timerInterval.current = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    }
    if (playing) {
      runTimer();
    }
    
    return function() {
      clearInterval(timerInterval.current);
    };
  }, [playing, setTimer, timerInterval]);

  useEffect(() => {
    function handleLostGame() {
      setPlaying(false);
      setMessage('Time ran out. You lost!');
      clearInterval(timerInterval.current);
    }
    if (timer <= 0 && playing) {
      handleLostGame();
    }
    if (timer <= Math.floor(timeLimit / 2) && !didReset) {
      onResetGame();
      setDidReset(true);
    }
  }, [timer, timeLimit, onResetGame, playing, didReset]);

  function handleClick(pos: Position | undefined) {
    if (pos === undefined) {
      return;
    }
    if (checkedValues.some(v => v === pos.value)) {
      return;
    }
    if (pos.value === 0 || checkedValues.some(v => v + 1 === pos.value)) {
      setCheckedValues(checkedValues => [...checkedValues, pos.value]);

      if (pos.value === sequenceMaxNumber - 1) {
        handleFinishGame();
      }
    }
  }

  const boxStyle = { width: boxSize, height: boxSize };

  const boxes = boxesData.map(d => (
    <Box
      coordinate={d.coordinate}
      key={d.id}
      style={boxStyle}
      contentStyle={d.style}
      data={d.position}
      onClick={() => handleClick(d.position)}
      checked={checkedValues.some(v => d.position !== undefined && v === d.position.value)}
    />
  ));

  function handleStartGame() {
    setPlaying(true);
    setCheckedValues([]);
    onStartGame();
    setTimer(timeLimit); 
    setDidReset(false);
  }

  function handleResetGame() {
    onResetGame();
  }

  function handleFinishGame() {
    setPlaying(false);
    setMessage('You won!');
    onFinishGame();
  }

  return (
    <div className={styles.container} >
      { !playing && (
          <div className={styles.overlay}>
            <div className={styles.message}>{message}</div>
            <button onClick={handleStartGame} className={utilsStyle.btn}>Start</button>
          </div>
        )
      }
      {
        playing && (
          <>
            <div className={styles.controlBoard}>
              <div className={cn(styles.timer, utilsStyle.primaryText)}>
                Time: {timer}s
              </div>
            </div>
            <div className={styles.board} style={{ height: boardSize, width: boardSize }}>
              {boxes}
            </div>
          </>
        )
      }
    </div>
  );
}