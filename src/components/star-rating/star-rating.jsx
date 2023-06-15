import React from 'react';

import { Icon } from '../icon/icon';

import './star-rating.scss';

export const StarRating = ({ score }) => {
  const noScoreInfo = score ? '' : 'ещё нет оценок';

  return (
    <div className='stars-wrap' data-test-id='rating'>
      {score ? (
        [0, 1, 2, 3, 4].map((num, i) =>
          i < score ? (
            <div key={num} data-test-id='star-wrap' className='star'>
              <Icon name='starFilled' dataTest='star-active' />
            </div>
          ) : (
            <div key={num} data-test-id='star-wrap' className='star'>
              <Icon name='star' />
            </div>
          )
        )
      ) : (
        <span>{noScoreInfo}</span>
      )}
    </div>
  );
};
