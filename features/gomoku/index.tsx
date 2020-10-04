import React from 'react';

import Board from './Board';
import { Mark } from './types';

export default function Gomoku(): JSX.Element {
  return (
    <Board
      userMark={Mark.x}
      isUserTurn
      xMoves={[]}
      oMoves={[]}
      move={(coordinator) => {
        // TODO
      }}
      quit={() => {
        // TODO
      }}
      score={{
        [Mark.o]: 0,
        [Mark.x]: 0
      }}
    />
  );
}
