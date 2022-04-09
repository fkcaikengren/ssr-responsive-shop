import React, { useContext } from 'react';
import ReactSVG from 'components/ReactSVG';
import ModalContext from 'components/Modal/context';
import logo from 'assets/images/logo.png';
import Navigator from './Navigator';
import style from './style.scss';

function Header() {
  const { openModal } = useContext(ModalContext);
  return (
    <div className={`${style.header} `}>
      <div
        role="button"
        className={`${style.header}__menuIcon`}
        onClick={() => {
          openModal('menu');
        }}
      >
        <ReactSVG name="menu" width={24} height={24} />
      </div>
      <a href="/" className={`${style.header}__logo`}>
        <img src={logo} alt="ssr-responsive-shop" />
      </a>
      <Navigator />
      <div className={`${style.header}__right`}>
        <div className={`${style.header}__avatar`}>
          <ReactSVG name="avatar" width={24} height={24} />
        </div>
        <div className={`${style.header}__cart`}>
          <ReactSVG name="cart" width={24} height={24} />
        </div>
      </div>
    </div>
  );
}

export default Header;
