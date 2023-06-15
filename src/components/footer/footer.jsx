import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '../icon/icon';

import './footer.scss';

const iconsList = [
  { href: '/facebook', icon: 'facebook' },
  { href: '/instagram', icon: 'instagram' },
  { href: '/vk', icon: 'vk' },
  { href: '/linkedin', icon: 'linkedin' },
];

export const Footer = () => {
  const [socialLinks, setSocialLinks] = useState(iconsList);

  const copyRightText = '© 2020-2023 Cleverland. Все права защищены.';

  return (
    <div className='container'>
      <div className='footer'>
        <div className='copyright'>{copyRightText}</div>
        <div className='social-links'>
          {socialLinks.map((link) => (
            <Link key={link.icon} to={link.href}>
              <Icon name={link.icon} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
