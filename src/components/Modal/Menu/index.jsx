

import React,{useState, useContext } from 'react'
import ReactSVG from 'components/ReactSVG'
import {ModalContext} from '../index'
import style from './style.scss'
import logo from 'assets/images/logo.png'


const Menu = ()=>{

  const navs = ['汉服', '头饰', '婚纱', '旗袍', '鞋子']
  const categories = {
    '0':['汉服秦制',
      '汉服汉制',
      '汉服唐制',
      '汉服宋制',
      '汉服明制',
      '清朝服饰'],
    '1':['发髻',
      '簪子',
      '纱巾',
      '蝴蝶结'],
    '2':['翘头鞋',
      '登云履',
      '皂靴',
      '布帛袜'],
    '3':['标准旗袍',
      '改良旗袍'],
    '4':[],
  }
  const [activeIndex, setActiveIndex] = useState('0')
  const {closeModal} = useContext(ModalContext)
  return (
    <div className={`${style.menu}`}>
        <div className={`${style.menu}__header`}>
          <img className={`${style.menu}__logo`} src={logo} alt="ssr-responsive-shop" />
          <div className={`${style.menu}__close`} onClick={closeModal}>
            <ReactSVG name='close' width={24} height={24} />
          </div>
        </div>
        <div className={`${style.menu}__body`}>
          <div className={`${style.menu}__side`}>
            <ul>
              {navs && 
              navs.map((item, i)=>(
                <li key={i} className={activeIndex==i?`${style.menu}__select`:''}>
                  <span>{item}</span>
                </li>
              ))
              }
            </ul>
          </div>
          <div className={`${style.menu}__main`}>
            nei rong
          </div>
        </div>
    </div>
  )
}

export default Menu
