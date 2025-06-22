import React, { useState, useEffect, useRef } from 'react';
import cn from '@lib/classnames';
import { BoxData, Position } from './types';
import Box from './Box';
import styles from './Sequence.module.scss';
import utilsStyle from '@styles/utils.scss';

const MILLISECOND = 1000;

interface BoardProps {
  gridWidth: number;
  boxesData: BoxData[];
  sequenceMaxNumber: number;
  onStartGame: () => void;
  onFinishGame: () => void;
  onResetGame: () => void;
  timeLimit: number;
}

enum GameStatus {
  idle,
  playing,
  lost,
  won
}

export default function Board(props: BoardProps): JSX.Element {
  const {
    boxesData,
    gridWidth,
    sequenceMaxNumber,
    onStartGame,
    onFinishGame,
    onResetGame,
    timeLimit
  } = props;

  const timeInMilli = timeLimit * MILLISECOND;

  const timerInterval = useRef<any>(undefined);

  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [timer, setTimer] = useState(timeInMilli);
  const [gameStatus, setGameStatus] = useState(GameStatus.idle);
  const [didReset, setDidReset] = useState(false);

  useEffect(() => {
    function runTimer() {
      timerInterval.current = setInterval(() => {
        setTimer((timer) => timer - 100);
      }, 100);
    }
    if (gameStatus === GameStatus.playing) {
      runTimer();
    }

    return function () {
      clearInterval(timerInterval.current);
    };
  }, [gameStatus, setTimer, timerInterval]);

  useEffect(() => {
    function handleLostGame() {
      setGameStatus(GameStatus.lost);
      clearInterval(timerInterval.current);
    }
    if (timer <= 0 && gameStatus === GameStatus.playing) {
      handleLostGame();
    }
    if (timer <= Math.floor(timeInMilli / 2) && !didReset) {
      onResetGame();
      setDidReset(true);
    }
  }, [timer, timeInMilli, onResetGame, gameStatus, didReset]);

  function handleClick(pos: Position | undefined) {
    if (pos === undefined) {
      return;
    }
    if (checkedValues.some((v) => v === pos.value)) {
      return;
    }
    if (pos.value === 0 || checkedValues.some((v) => v + 1 === pos.value)) {
      setCheckedValues((checkedValues) => [...checkedValues, pos.value]);

      if (pos.value === sequenceMaxNumber - 1) {
        handleFinishGame();
      }
    }
  }

  const boxStyle = { width: gridWidth, height: gridWidth };

  const boxes = boxesData.map((d) => (
    <Box
      coordinate={d.coordinate}
      key={d.id}
      style={boxStyle}
      contentStyle={d.style}
      data={d.position}
      onClick={() => handleClick(d.position)}
      checked={checkedValues.some(
        (v) => d.position !== undefined && v === d.position.value
      )}
    />
  ));

  function handleStartGame() {
    setGameStatus(GameStatus.playing);
    setCheckedValues([]);
    onStartGame();
    setTimer(timeInMilli);
    setDidReset(false);
  }

  function handleResetGame() {
    onResetGame();
  }

  function handleFinishGame() {
    setGameStatus(GameStatus.won);
    onFinishGame();
  }

  let message: string | React.ReactNode = '';

  switch (gameStatus) {
    case GameStatus.idle:
      message = (
        <>
          <p>Find numbers by order from the smallest to the biggest.</p>
          <p>Press Start to begin.</p>
        </>
      );
      break;
    case GameStatus.won:
      message = <p>You won :)</p>;
      break;
    case GameStatus.lost:
      message = <p className={styles.lost}>You lost :(</p>;
      break;
    default:
      break;
  }

  let timeLeft = (timer / MILLISECOND).toString();
  timeLeft = timeLeft.indexOf('.') < 0 ? `${timeLeft}.0` : timeLeft;

  return (
    <>
      {gameStatus !== GameStatus.playing && (
        <div className={styles.overlay}>
          <div className={styles.message}>{message}</div>
          <button onClick={handleStartGame} className={utilsStyle.btn}>
            {gameStatus === GameStatus.idle ? 'Start' : 'Play again'}
          </button>
        </div>
      )}
      {gameStatus === GameStatus.playing && (
        <>
          <div className={styles.controlBoard}>
            <div className={cn(styles.timer, utilsStyle.primaryText)}>
              Time: {timeLeft}s
            </div>
          </div>
          <div className={styles.board}>{boxes}</div>
        </>
      )}
    </>
  );
}
