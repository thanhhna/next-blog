import React from 'react';
import { Position, Coordinate } from './types';
import { StyleObject } from '@utils/commonType';

interface BoxProps {
  coordinate: Coordinate;
  style?: StyleObject;
  data?: Position;
  contentStyle?: StyleObject;
  checked: boolean;
  onClick: (data: Position) => void;
}

export default function Box({
  style,
  contentStyle,
  data,
  onClick
}: BoxProps): React.ReactNode {
  function handleClick(event: React.MouseEvent) {
    if (event.clientX === 0 || event.clientY === 0) {
      return;
    }
    if (data === undefined) {
      return;
    }
    onClick(data);
  }

  return (
    <div style={style}>
      <div>
        {data !== undefined && (
          <span style={contentStyle} onClick={handleClick}>
            {data.value + 1}
          </span>
        )}
      </div>
    </div>
  );
}
