import React from 'react'
import {Link} from 'react-router-dom'
import style from './style.scss'

function Footer() {
  return (
    <div className={`${style.footer}`}>
      <div className={`${style.footer}__main`}>
        <div className={`${style.footer}__nav`}>
          <h3>购物指南</h3>
          <ul>
            <li><Link to='/'>购物流程</Link></li>
            <li>联系我们</li>
            <li><Link to='/'>联系客服</Link></li>
            <li><Link to='/'>常见问题</Link></li>
          </ul>
        </div>
        <div className={`${style.footer}__nav`}>
          <h3>支付方式</h3>
          <ul>
            <li><Link to='/'>货到付款</Link></li>
            <li>在线付款</li>
            <li><Link to='/'>分期付款</Link></li>
          </ul>
        </div>
        <div className={`${style.footer}__nav`}>
          <h3>售后服务</h3>
          <ul>
            <li><Link to='/'>售后政策</Link></li>
            <li><Link to='/'>退款说明</Link></li>
            <li><Link to='/'>退换货</Link></li>
            <li><Link to='/'>取消订单</Link></li>
          </ul>
        </div>
      </div>
      <div className={`${style.footer}__bottom`}>
        互联网ICP备案：粤ICP备123456号-x
      </div>
    </div>
  )
}

export default Footer