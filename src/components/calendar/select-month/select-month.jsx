import React, { useState } from 'react';
import classNames from 'classnames';
import { Icon } from '../../icon/icon';

import styles from './select-month.module.scss';

export const SelectMonth = ({ items, value, year, onChange }) => {
  const [isOpenSelect, setIsOpenSelect] = useState(false);

  const onOpenSelect = () => {
    setIsOpenSelect((prev) => !prev);
  };

  const onSelectMonth = (value) => {
    onChange(value);
    setIsOpenSelect(false);
  };

  return (
    <div className={styles.root}>
      <button data-test-id='month-select' onClick={onOpenSelect} type='button'>
        {`${items[value].displayValue} ${year}`}
        <Icon name='arrowDropDown' />
      </button>

      {isOpenSelect && (
        <div className={styles.select}>
          {items.map((item) => (
            <button
              type='button'
              className={classNames('', {
                [styles.active]: item.displayValue === items[value].displayValue,
              })}
              key={item.value}
              onClick={() => onSelectMonth(item.value)}
            >
              {item.displayValue}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
