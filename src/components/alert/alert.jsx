import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import styles from './alert.module.scss';
import { Icon } from '../icon/icon';
import { useTimer } from '../../hooks/use-timer';

import { setToast } from '../../store/slices/global-slice';

export const Alert = ({ open, title, type, setOpen }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let timer = null;
    timer = setTimeout(() => {
      dispatch(setToast({ show: false, text: '', type: '' }));
    }, 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  const onClose = () => {
    dispatch(setToast({ show: false, text: '', type: '' }));
  };

  return (
    open && (
      <div
        className={classNames(styles.root, {
          [styles.success]: type === 'success',
          [styles.rejected]: type === 'rejected',
        })}
        data-test-id='error'
      >
        {type === 'success' ? <Icon name='alertDone' /> : <Icon name='warning' />}
        <span>{title} </span>
        <button data-test-id='alert-close' type='button' onClick={onClose} className={styles.close}>
          <Icon name='close' />
        </button>
      </div>
    )
  );
};
