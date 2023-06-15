import React from 'react';

import moment from 'moment';

import { StarRating } from '../../../components/star-rating/star-rating';
import userAvatar from '../../../assets/avatar.png';
import styles from './comment-card.module.scss';
import { baseApiUrl } from '../../../settings/api';

export const CommentCard = ({ avatar, name, date, rating, text }) => (
  <div className={styles.root} data-test-id='comment-wrapper'>
    <div className={styles.commentTop}>
      <img src={avatar ? `${baseApiUrl}${avatar}` : userAvatar} alt='' />
      <div className={styles.commentInfo}>
        <span data-test-id='comment-author'>{name}</span>
        <time data-test-id='comment-date'>{moment(date).format('LL')}</time>
      </div>
    </div>
    <StarRating score={rating} />
    <p data-test-id='comment-text'>{text}</p>
  </div>
);
