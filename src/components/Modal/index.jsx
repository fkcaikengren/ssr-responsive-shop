/*
 * Modal三种情况，1.已知modal 2.临时创建的modal
 *
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import modals from './modals';
import ModalContext from './context';
import style from './style.scss';

function Modal(props) {
  const [hasDom, setHasDom] = useState(false);
  const [modalNames, setModalNames] = useState([]);

  useEffect(() => {
    setHasDom(true);
  }, [setHasDom]);

  const openModal = useCallback(
    (name) => {
      if (typeof name === 'string' && name !== '') {
        setModalNames(modalNames.concat(name));
      }
    },
    [modalNames, setModalNames]
  );

  const closeModal = useCallback(() => {
    setModalNames(modalNames.slice(0, -1));
  }, [modalNames, setModalNames]);

  const onClickMask = useCallback(
    (e) => {
      if (e.target && e.target.classList.contains(style.modal)) {
        closeModal();
      }
    },
    [closeModal]
  );

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {props.children}
      {hasDom &&
        modalNames.map((modalName) => {
          const Module = modals[modalName];
          return modals[modalName]
            ? createPortal(
                <div className={style.modal} onClick={onClickMask}>
                  <Module />
                </div>,
                document.getElementById('root')
              )
            : null;
        })}
    </ModalContext.Provider>
  );
}

export default Modal;
