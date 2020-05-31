import React, { useState, useMemo } from 'react';
import range from 'range';
import cn from 'classnames';

import styles from './Sequence.module.scss';
import utilsStyle from 'styles/utils.module.scss';

const BOARD_SIZE = 600;
const NUMBER = 10;

interface Position {
  x: number,
  y: number,
  value: number
}

function randPositions(max: number, size: number): Position[] {
  function genPosRandom(value: number){
    return {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
      value
    };
  }

  const positions: Position[] = [];

  range.range(0, max).forEach((number: number) => {
    function gen(prePos?: Position, retry: number = 0): Position {
      const pos = prePos || genPosRandom(number);

      // too close
      const overlap = positions.some(p =>
        Math.abs(p.x - pos.x) < 2 &&
        Math.abs(p.y - pos.y) < 2
      );

      if (overlap) {
        if (retry > 100) {
          // too many retry, give up
          return pos;
        }

        return gen(genPosRandom(number), retry+1);
      }

      return pos;
    }

    positions.push(gen());
  });

  return positions;
}

function Box(
  { style, data, pos, onClick, checked }:
  {
    style?: object,
    data?: Position,
    pos: object,
    checked: boolean,
    onClick: (data: Position) => void
  }
) {
  function handleClick() {
    if (data === undefined) {
      return;
    }
    onClick(data);
  }

  return (
    <div className={styles.box} style={ style }>
      <div className={cn(styles.dot)}>
        {
          data !== undefined && (
            <span
              style={pos}
              onClick={handleClick}
              className={cn(
                checked ? styles.checked : '',
                data !== undefined && !checked ? utilsStyle.pointer : ''
              )}
            >
              {data.value+1}
            </span>
          )
        }
      </div>
    </div>
  );
}

function Board(
  { positions, size, boxesData }:
  {
    positions: Position[],
    size: number,
    boxesData: {
      number: number,
      position?: Position,
      posStyle: object
    }[]
  }
) {
  const [checkedValues, setCheckedValues] = useState<number[]>([]);

  function handleClick(pos: Position | undefined) {
    if (pos === undefined) {
      return;
    }
    if (checkedValues.some(v => v === pos.value)) {
      return;
    }
    if (pos.value === 0 || checkedValues.some(v => v + 1 === pos.value)) {
      setCheckedValues(checkedValues => [...checkedValues, pos.value]);
    }
  }

  const boxStyle = { width: size, height: size };

  const boxes = boxesData.map(d => (
    <Box
      key={d.number}
      style={boxStyle}
      data={d.position}
      pos={d.posStyle}
      onClick={() => handleClick(d.position)}
      checked={checkedValues.some(v => d.position !== undefined && v === d.position.value)}
    />
  ));

  return (
    <div className={styles.board} style={{ height: BOARD_SIZE, width: BOARD_SIZE }}>
      {boxes}
    </div>
  );
}

export default function Sequence() {
  const size = BOARD_SIZE / NUMBER;

  const positions = randPositions(NUMBER*2, NUMBER);

  const boxesData = range.range(0, NUMBER * NUMBER).map((number: number) => {
    const pos = {
      x: number < 10 ? number : parseInt(number.toString()[1], 10),
      y: number < 10 ? 0 : parseInt(number.toString()[0], 10)
    };

    const posExists = positions.find(p => p.x === pos.x && p.y === pos.y);

    const posStyle = {
      left: Math.floor(Math.random() * 50),
      top: Math.floor(Math.random() * 50)
    };

    return {
      number,
      posStyle,
      position: posExists
    };
  });

  return(
    <div className={styles.container} >
      <Board positions={positions} boxesData={boxesData} size={size} />
    </div>
  );
}