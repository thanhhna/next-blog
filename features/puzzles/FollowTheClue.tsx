import React from "react";
import cn from "classnames";
import styles from "./FollowTheClue.module.scss";

interface FollowTheClueProps {
  className?: string;
}

export default function FollowTheClue(props: FollowTheClueProps) {
  const { className } = props;

  return (
    <div className={cn(className, styles.main)}>
      <div></div>
      <div>{"=>"}</div>
      <div className={styles.vertical}>
        <div>2</div>
        <div>5</div>
      </div>
      <div></div>
      <div className={styles.center}>
        <input className={styles.input} />
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div>Enter key</div>
    </div>
  );
}
