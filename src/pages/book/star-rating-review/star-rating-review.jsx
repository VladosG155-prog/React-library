import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './star-rating-review.module.scss';
import { Icon } from '../../../components/icon/icon';

export const StarRatingReview = ({ value, onChange }) => {
  const [activeStars, setActiveStars] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i <= value; i++) {
      arr.push(i);
    }
    setActiveStars(arr);
  }, [value]);

  const onMouseEnter = (item) => {
    const stars = [];
    setIsClicked(false);
    for (let i = 0; i <= item; ++i) {
      stars.push(i);
    }

    setActiveStars(stars);
  };

  const onMouseLeave = () => {
    if (!isClicked) {
      setActiveStars([]);
    }
  };

  const onClick = (item) => {
    const stars = [];
    for (let i = 0; i <= item; ++i) {
      stars.push(i);
    }
    setIsClicked(true);
    setActiveStars(stars);
    onChange(item);
  };

  return (
    <div className={styles.root} data-test-id='rating' onMouseLeave={onMouseLeave}>
      {[1, 2, 3, 4, 5].map((item) => (
        <button
          type='button'
          className={classNames('', {
            [styles.active]: activeStars.includes(item),
          })}
          onClick={() => onClick(item)}
          onMouseEnter={() => onMouseEnter(item)}
          data-test-id='star'
          key={item}
        >
          <Icon name='star' dataTest={activeStars.includes(item) ? 'star-active' : ''} />
        </button>
      ))}
    </div>
  );
};
