import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './calendar.module.scss';

import { Icon } from '../icon/icon';
import { SelectMonth } from './select-month/select-month';

const days = {
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
};
const years = [
  { id: 2022, value: 2022, displayValue: '2022' },
  { id: 2021, value: 2021, displayValue: '2021' },
  { id: 2020, value: 2020, displayValue: '2020' },
];
const months = [
  { id: 0, value: 0, displayValue: 'Январь' },
  { id: 1, value: 1, displayValue: 'Февраль' },
  { id: 2, value: 2, displayValue: 'Март' },
  { id: 3, value: 3, displayValue: 'Апрель' },
  { id: 4, value: 4, displayValue: 'Май' },
  { id: 5, value: 5, displayValue: 'Июнь' },
  { id: 6, value: 6, displayValue: 'Июль' },
  { id: 7, value: 7, displayValue: 'Август' },
  { id: 8, value: 8, displayValue: 'Сентябрь' },
  { id: 9, value: 9, displayValue: 'Октябрь' },
  { id: 10, value: 10, displayValue: 'Ноябрь' },
  { id: 11, value: 11, displayValue: 'Декабрь' },
];
export const Calendar = ({ value, onChange, locale }) => {
  const date = new Date(value ? value : Date.now());
  const [fullDate, setFullDate] = useState({
    month: date.getMonth(),
    year: date.getFullYear(),
    day: value ? date.getDate() : 0,
  });
  const isToday = new Date(Date.now()).getDate();

  const changeMonth = (value) => {
    setFullDate({ ...fullDate, month: value, day: 0 });

    const date = new Date(fullDate.year, fullDate.month, value);
    const utcDate = date.getTime();
    const offset = date.getTimezoneOffset() * 60000;
    onChange(new Date(utcDate - offset).toISOString());
  };
  const changeYear = (value) => {
    setFullDate({ ...fullDate, year: value });
  };
  const changeDay = (value) => {
    setFullDate({ ...fullDate, day: value });
    const date = new Date(fullDate.year, fullDate.month, value);
    const utcDate = date.getTime();
    const offset = date.getTimezoneOffset() * 60000;
    onChange(new Date(utcDate - offset).toISOString());
  };

  const onMonthPrev = () => {
    const { month } = fullDate;
    if (month === 0) {
      setFullDate({ ...fullDate, month: 11, day: 0, year: fullDate.year - 1 });
    } else {
      setFullDate({ ...fullDate, month: month - 1, day: 0 });
    }
  };
  const onMonthNext = () => {
    const { month } = fullDate;
    if (month === 11) {
      setFullDate({ ...fullDate, month: 0, day: 0, year: fullDate.year + 1 });
    } else {
      setFullDate({ ...fullDate, month: month + 1, day: 0 });
    }
  };

  const checkDayToPeek = (dayList) => {
    const date = new Date(Date.now());
    const today = dayList.find((day) => day.dayNumber === date.getDate() && day.dayNumberWeek === date.getDay());
    const indexOfToday = dayList.indexOf(today);

    const weekArray = dayList.slice(indexOfToday, indexOfToday + 6);

    const monday = weekArray.find((day) => day.dayNumberWeek === 1);
    const mondayIndex = dayList.indexOf(monday);

    if (!today) return;

    if (today.dayNumberWeek === 6 || today.dayNumberWeek === 0) {
      dayList[mondayIndex] = { ...dayList[mondayIndex], freeToPick: true };
      // eslint-disable-next-line
    } else if (today.dayNumberWeek === 5) {
      dayList[indexOfToday] = { ...dayList[indexOfToday], freeToPick: true };
      dayList[mondayIndex] = { ...dayList[mondayIndex], freeToPick: true };
    } else {
      dayList[indexOfToday] = { ...dayList[indexOfToday], freeToPick: true };
      dayList[indexOfToday + 1] = { ...dayList[indexOfToday + 1], freeToPick: true };
    }
  };

  const getDays = (month, year) => {
    const resultDays = [];
    const date = new Date(year, month + 1, 0);
    const firstElemDate = new Date(year, month, 1);
    const lastElemDate = new Date(year, month + 2, 1);

    const nextDate = new Date(year, month + 1, 0).getDay();
    const prevDate = new Date(year, month, 0).getDate();

    const sundayDay = firstElemDate.getDay() === 0 ? 7 : firstElemDate.getDay();

    for (let i = 0; i < sundayDay - 1; i++) {
      resultDays.push({ dayNumber: prevDate + 1 - (sundayDay - 1) + i, id: `prev-${i}` });
    }

    for (let i = 1; i <= date.getDate(); i++) {
      const today = new Date(year, month, i);

      resultDays.push({ dayNumber: i, dayNumberWeek: today.getDay(), id: `current-${i}`, month });
    }

    for (let i = 0; i <= 7 - nextDate - 1; i++) {
      resultDays.push({ dayNumber: lastElemDate.getDate() + i, id: `next-${i}` });
    }

    checkDayToPeek(resultDays);
    return resultDays;
  };
  return (
    <div className={styles.root} data-test-id='calendar'>
      <div className={styles.calendarHeader}>
        <SelectMonth
          items={months}
          year={fullDate.year}
          value={fullDate.month}
          onChange={(value) => changeMonth(value)}
        />
        <div className={styles.navigationButtons}>
          <button onClick={onMonthPrev} data-test-id='button-prev-month' type='button'>
            <Icon name='arrowUp' />
          </button>
          <button onClick={onMonthNext} data-test-id='button-next-month' type='button'>
            <Icon name='arrowDown' />
          </button>
        </div>
      </div>

      <div className={styles.days}>
        {days.ru?.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.dayNumbers}>
        {getDays(fullDate.month, fullDate.year).map((elem, index) => (
          <button
            key={elem.id}
            type='button'
            data-test-id='day-button'
            disabled={!elem.freeToPick}
            onClick={() => changeDay(elem.dayNumber)}
            className={classNames({
              [styles.active]: fullDate.day === elem.dayNumber && fullDate.month === elem.month,
              [styles.today]: elem.dayNumber === isToday && date.getMonth() === fullDate.month,
              [styles.weekend]: elem.dayNumberWeek === 6 || elem.dayNumberWeek === 0,
              [styles.activeToPeek]: elem.freeToPick && date.getMonth() === fullDate.month,
            })}
          >
            {elem.dayNumber}
          </button>
        ))}
      </div>
    </div>
  );
};
