import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import moment from 'moment';
import ru from 'moment/locale/ru';
import { App } from './app';
import { store } from './store';

import './index.scss';

moment.locale('ru');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
