import React from 'react'
import {Link} from 'react-router-dom'
import WrapPage from '../../components/WrapPage'
import style from './style.scss'

function Home() {
  return (
    <div className={style.home} >
      <Link to='/introduce'>Go</Link>
    </div>
  )
}

const loadData = null
// const loadData = (store) => {
//   return store.dispatch(load())
// }
export default WrapPage({ title: 'SSR Responsive Shop | Home', loadData })(Home)