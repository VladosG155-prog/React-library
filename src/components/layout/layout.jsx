import React from 'react';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

export const Layout = ({ children, dataTest }) => (
  <div data-test-id={dataTest}>
    <Header />
    {children}
    <Footer />
  </div>
);
