import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../Header';
import Footer from '../Footer';

function WrapPage({ title, loadData }) {
  return (Main) => {
    function WrapperComponent() {
      return (
        <>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <Header />
          <Main />
          <Footer />
        </>
      );
    }
    if (loadData) {
      WrapperComponent.loadData = loadData;
    }
    return WrapperComponent;
  };
}

export default WrapPage;
