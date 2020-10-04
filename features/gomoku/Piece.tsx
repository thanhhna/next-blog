import React, { useState } from 'react';
import cn from 'classnames';

import { Coordinator, Mark } from './types';
import styles from './Piece.module.scss';

interface PieceProps {
  occupyingMark?: Mark;
  move: (coordinator: Coordinator) => void;
  coordinator: Coordinator;
  userMark: Mark;
  isUserTurn: boolean;
}

export default function Piece(props: PieceProps): JSX.Element {
  const { occupyingMark = Mark.EMPTY } = props;

  const [hoverMark, setHoverMark] = useState(Mark.EMPTY);

  const isOccupied = occupyingMark !== Mark.EMPTY;

  function handleClick() {
    if (isOccupied) {
      return;
    }

    props.move(props.coordinator);
  }

  function handleMouseOver() {
    const { userMark, isUserTurn } = props;

    if (isOccupied || isUserTurn) {
      return;
    }

    setHoverMark(userMark);
  }

  function handleMouseOut() {
    setHoverMark(Mark.EMPTY);
  }

  const hoverClass = hoverMark !== Mark.EMPTY ? styles.hover : '';

  const className = cn(styles.piece, styles[occupyingMark], hoverClass);

  return (
    <td
      onClick={handleClick}
      className={className}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {props.occupyingMark}
      {hoverMark}
    </td>
  );
}
