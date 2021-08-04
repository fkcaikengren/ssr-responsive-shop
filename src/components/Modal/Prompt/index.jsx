

import React,{ useContext } from 'react'
import {ModalContext} from '../index'


const Prompt = ()=>{
  const {closeModal} = useContext(ModalContext)
  return (
    <div>
       <button onClick={closeModal}>关闭</button>
      prompt
    </div>
  )
}

export default Prompt
