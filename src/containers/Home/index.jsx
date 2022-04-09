import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ModalContext from 'components/Modal/context';
import WrapPage from 'components/WrapPage';
import style from './style.scss';

function Home() {
  const { openModal } = useContext(ModalContext);
  return (
    <div className={style.home}>
      <h2>水墨风</h2>
      <p>this is description </p>
    </div>
  );
}

const loadData = null;
// const loadData = (store) => {
//   return store.dispatch(load())
// }
export default WrapPage({ title: 'SSR Responsive Shop | Home', loadData })(
  Home
);
