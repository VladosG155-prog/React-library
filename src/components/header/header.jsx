import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { URLS } from '../../settings/urls';
import { Aside } from '../aside/aside';
import avatar from '../../assets/avatar.png';

import { screens, useMediaQuery } from '../../hooks/use-media-query';
import { Icon } from '../icon/icon';

import './header.scss';
import { useClickOutside } from '../../hooks/use-click-outside';
import { useAuthMeQuery } from '../../store/api/auth-api';
import { baseApiUrl } from '../../settings/api';

export const Header = () => {
  const isTablet = useMediaQuery(screens.tablet);

  const { data: user } = useAuthMeQuery();

  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [isActiveMenu, setIsActiveMenu] = useState(false);

  const [isActiveProfileMenu, setIsActiveProfileMenu] = useState(false);

  useClickOutside(menuRef, () => setIsActiveMenu(false), burgerRef);

  const toggleMenu = () => {
    setIsActiveMenu((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    navigate(URLS.auth);
  };

  return (
    <div
      className={classNames('header', {
        active: isActiveProfileMenu,
      })}
    >
      <div className='container'>
        <div className='header-first'>
          <Link
            to='/books/all'
            className={classNames('', {
              hidden: isTablet,
            })}
          >
            <Icon name='logo' />
          </Link>
          <button
            type='button'
            ref={burgerRef}
            data-test-id='button-burger'
            onClick={toggleMenu}
            data-ignore-outside={true}
            className={classNames('burger-button', {
              active: isActiveMenu,
              hidden: !isTablet,
            })}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        {isTablet && (
          <Aside asideRef={menuRef} isActiveMobileMenu={isActiveMenu} onClose={() => setIsActiveMenu(false)} />
        )}
        <h3>{pathname === URLS.profile ? 'Личный кабинет' : 'Библиотека'}</h3>
        {!isTablet && (
          <div className='user-menu'>
            <span>Привет, {user?.firstName}!</span>
            <img src={user?.avatar ? `${baseApiUrl}${user?.avatar}` : avatar} alt='' />

            <div className='user-navigation'>
              <button data-test-id='profile-button' type='button' onClick={() => navigate('/profile')} to='/profile'>
                Профиль
              </button>

              <button type='button' onClick={logout}>
                Выход
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
