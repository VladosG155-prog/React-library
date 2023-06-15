import React from 'react';

import styles from './auth-wrapper.module.scss';

export const AuthWrapper = ({ children }) => (
  <div data-test-id='auth' className={styles.root}>
    {children}
  </div>
);
