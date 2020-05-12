import React, { useState, useEffect } from 'react';
import styles from './GoTop.module.scss';

export default function GoTop() {
  const initVisible = typeof window !== 'undefined' && window.scrollY > 0;
  const [isVisible, setIsVisible] = useState(initVisible);

  function handleClick() {
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    function handleScroll () {
      if (window.scrollY > 0 && !isVisible) {
        setIsVisible(true);
      }
      else if (window.scrollY === 0 && isVisible) {
        setIsVisible(false);
      }
    }

    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('scroll', handleScroll);

    return (() => {
      window.removeEventListener('scroll', handleScroll);
    });
  });

  return isVisible ? (
    <button onClick={handleClick} className={styles.goTop}><i className="fa fa-angle-up"></i></button>
  ) : null;
}
