'use client';
import React, { useEffect, useRef } from 'react';
import $ from 'jquery';

import { Coordinator, Mark } from './types';
import Piece from './Piece';
import styles from './Board.module.scss';

const BOARD_ROW = 40;
const BOARD_COL = 40;

const CONTAINER_ID = 'container';
const BOARD_ID = 'gomoku';

interface Score {
  [Mark.x]: number;
  [Mark.o]: number;
}

interface BoardProps {
  userMark: Mark;
  isUserTurn: boolean;
  xMoves: Coordinator[];
  oMoves: Coordinator[];
  move: (coordinator: Coordinator) => void;
  quit: () => void;
  score: Score;
}

export default function Board(props: BoardProps): React.ReactNode {
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      const container = $(`#${CONTAINER_ID}`);
      const board = $(`#${BOARD_ID}`);

      if (typeof container === 'undefined' || typeof board === 'undefined') {
        return;
      }

      const innerWidth = container.width() || 0;
      const outerWidth = board.width() || 0;

      container.scrollLeft((innerWidth - outerWidth) / 2);
      window.scrollTo(0, window.innerHeight / 2);

      firstLoad.current = false;
    }
  });

  function move(coordinator: Coordinator) {
    if (props.isUserTurn) {
      props.move(coordinator);
    }
  }

  function pieceOccupiedBy(coordinator: Coordinator): Mark {
    const { xMoves, oMoves } = props;

    const isXOccupied = xMoves.some(
      (m) => m.x === coordinator.x && m.y === coordinator.y
    );

    if (isXOccupied) {
      return Mark.x;
    }

    const isOOccupied = oMoves.some(
      (m) => m.x === coordinator.x && m.y === coordinator.y
    );

    if (isOOccupied) {
      return Mark.o;
    }

    return Mark.EMPTY;
  }

  function drawBoard() {
    const rowNumber = BOARD_ROW;
    const colNumber = BOARD_COL;

    const grid = [];

    for (let i = 0; i < rowNumber; i++) {
      const children = [];

      for (let j = 0; j < colNumber; j++) {
        const coordinator = {
          x: i,
          y: j
        };

        children.push(
          <Piece
            key={`${i}${j}`}
            coordinator={coordinator}
            move={move}
            userMark={props.userMark}
            isUserTurn={props.isUserTurn}
            occupyingMark={pieceOccupiedBy(coordinator)}
          />
        );
      }

      grid.push(<tr key={i}>{children}</tr>);
    }

    return (
      <table id={BOARD_ID} className={styles.gomoku}>
        <tbody>{grid}</tbody>
      </table>
    );
  }

  return (
    <div id={CONTAINER_ID} className={styles.container}>
      {drawBoard()}
    </div>
  );
}
