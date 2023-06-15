import React from 'react';

import { icons } from '../../icons';

import './icon.scss';

export const Icon = ({ name, size = 'default', dataTest }) => (
  <i className='icon' data-test-id={dataTest} data-size={size} dangerouslySetInnerHTML={{ __html: icons[name] }} />
);
