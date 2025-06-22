import React from 'react';
import cn from '@lib/classnames';
import styles from './Sequence.module.scss';
import utilsStyles from '@styles/utils.scss';
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
  onClick,
  checked
}: BoxProps): JSX.Element {
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
    <div className={styles.box} style={style}>
      <div className={cn(styles.dot)}>
        {data !== undefined && (
          <span
            style={contentStyle}
            onClick={handleClick}
            className={cn(
              checked ? styles.checked : '',
              !checked ? utilsStyles.pointer : ''
            )}
          >
            {data.value + 1}
          </span>
        )}
      </div>
    </div>
  );
}
