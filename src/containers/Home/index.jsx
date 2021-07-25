import React from 'react'
import WrapPage from '../../components/WrapPage'

function Home() {
  return (
    <div>
      homex
    </div>
  )
}

const loadData = null
// const loadData = (store) => {
//   return store.dispatch(load())
// }
export default WrapPage({ title: 'SSR Responsive Shop | Home', loadData })(Home)