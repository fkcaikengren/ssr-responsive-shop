import React from 'react';
import WrapPage from 'components/WrapPage';

function Introduce() {
  return <div>introduce ...</div>;
}
// const loadData = (store) => {
//     return store.dispatch(load())
// }
export default WrapPage({
  title: 'SSR Responsive Shop | Introduce',
  loadData: null,
})(Introduce);
