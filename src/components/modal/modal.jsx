import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.scss';
import { Icon } from '../icon/icon';

export const Modal = ({ title, onClose, children, dataTest = 'booking-modal' }) => {
  const overlayRef = useRef(null);

  const modalRef = useRef(null);

  const onClickOutside = (e) => {
    if (e.composedPath().includes(overlayRef.current) && !e.composedPath().includes(modalRef.current)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
    // eslint-disable-next-line
  }, []);

  return createPortal(
    <div id='overlay' data-test-id='modal-outer' ref={overlayRef}>
      <div className={styles.root} data-test-id={dataTest} ref={modalRef}>
        <h4 data-test-id='modal-title'>{title}</h4>
        <button data-test-id='modal-close-button' type='button' className={styles.close} onClick={onClose}>
          <Icon name='closeModal' />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('portal')
  );
};
