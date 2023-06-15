import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { URLS } from './settings/urls';
import { Layout } from './components/layout/layout';
import { ProfilePage, RegisterPage, MainPage, InfoPage, ForgotPass, BookPage, AuthPage } from './pages';
import { setUser } from './store/slices/global-slice';
import { useAuthMeQuery } from './store/api/auth-api';
import { Loader } from './components/loader/loader';
import { store } from './store';

export const App = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const isAuthPages = pathname === URLS.auth || pathname === URLS.forgotPass || pathname === URLS.registration;

  const { data, refetch } = useAuthMeQuery();

  useEffect(() => {
    if (token) {
      dispatch(setUser(data));
    }
    return () => null;
    // eslint-disable-next-line
  }, []);

  const isPrivateRoute = (element) => {
    if (!token) {
      return <Navigate to='/auth' />;
    }

    return element;
  };

  return (
    <Routes>
      <Route path={URLS.base} element={<Navigate to='books/all' />} />
      <Route path={URLS.registration} element={<RegisterPage />} />
      <Route path={URLS.auth} element={<AuthPage />} />
      <Route path={URLS.forgotPass} element={<ForgotPass />} />
      <Route
        path={URLS.mainPage}
        element={isPrivateRoute(
          <Layout dataTest='main-page'>
            <MainPage />
          </Layout>
        )}
      />
      <Route
        path={URLS.bookPage}
        element={isPrivateRoute(
          <Layout>
            <BookPage />
          </Layout>
        )}
      />
      <Route
        path={URLS.rules}
        element={isPrivateRoute(
          <Layout>
            <InfoPage title='Правила пользования' />
          </Layout>
        )}
      />
      <Route
        path={URLS.ofert}
        element={isPrivateRoute(
          <Layout>
            <InfoPage title='Договор оферты' />
          </Layout>
        )}
      />
      <Route
        path={URLS.profile}
        element={isPrivateRoute(
          <Layout>
            <ProfilePage title='Договор оферты' />
          </Layout>
        )}
      />
    </Routes>
  );
};
