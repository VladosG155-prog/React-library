import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LoaderElem } from './loader-elem/loader-elem';
import styles from './loader.modules.scss';

export const Loader = () =>
  createPortal(
    <div id='overlay' data-test-id='loader'>
      <LoaderElem />
    </div>,
    document.getElementById('portal')
  );
