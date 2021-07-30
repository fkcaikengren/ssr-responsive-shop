import React from 'react'
import {Link} from 'react-router-dom'
import style from './style.scss'
import ReactSVG from '@/components/ReactSVG'
import logo from '@/assets/images/logo.png'


function Header() {
  return (
    <div className={`${style.header} `}>
      <div className={`${style.header}__menuIcon`}>
        <ReactSVG name='menu' width={24} height={24} ></ReactSVG>
      </div>
      <a className={`${style.header}__logo`}>
        <img src={logo} alt="ssr-responsive-shop" />
      </a>
      <nav className={`${style.header}__nav`}>
        <Link to='/'>汉服</Link>
        <Link to='/'>头饰</Link>
        <Link to='/'>婚纱</Link>
        <Link to='/'>旗袍</Link>
        <Link to='/'>鞋子</Link>
      </nav>
      <div className={`${style.header}__cart`}>
        <ReactSVG name='cart' width={24} height={24} ></ReactSVG>
      </div>
    </div>
  )
}

export default Header
