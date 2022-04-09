import React, { useContext } from 'react';
import ModalContext from '../context';

function Prompt() {
  const { closeModal } = useContext(ModalContext);
  return (
    <div>
      <button onClick={closeModal}>关闭</button>
      prompt
    </div>
  );
}

export default Prompt;
