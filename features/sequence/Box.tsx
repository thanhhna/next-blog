import React from 'react';
import cn from 'classnames';
import styles from './Sequence.module.scss';
import utilsStyles from 'styles/utils.module.scss';
import { Position, Coordinate } from './types';

interface BoxProps {
  coordinate: Coordinate,
  style?: object,
  data?: Position,
  contentStyle?: object,
  checked: boolean,
  onClick: (data: Position) => void
}

export default function Box({ style, contentStyle, data, onClick, checked }: BoxProps) {
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
              style={contentStyle}
              onClick={handleClick}
              className={cn(
                checked ? styles.checked : '',
                data !== undefined && !checked ? utilsStyles.pointer : ''
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