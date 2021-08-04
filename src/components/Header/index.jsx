import React, {useContext} from 'react'
import style from './style.scss'
import ReactSVG from 'components/ReactSVG'
import {ModalContext} from 'components/Modal'
import Navigator from './Navigator'
import logo from 'assets/images/logo.png'


function Header() {

  const {openModal} = useContext(ModalContext)
  return (
    <div className={`${style.header} `}>
      <div className={`${style.header}__menuIcon`} onClick={()=>{openModal('menu')}}>
        <ReactSVG name='menu' width={24} height={24} ></ReactSVG>
      </div>
      <a className={`${style.header}__logo`}>
        <img src={logo} alt="ssr-responsive-shop" />
      </a>
      <Navigator />
      <div className={`${style.header}__right`}>
        <div className={`${style.header}__avatar`}>
          <ReactSVG name='avatar' width={24} height={24} ></ReactSVG>
        </div>
        <div className={`${style.header}__cart`}>
          <ReactSVG name='cart' width={24} height={24} ></ReactSVG>
        </div>
      </div>
    </div>
  )
}

export default Header
