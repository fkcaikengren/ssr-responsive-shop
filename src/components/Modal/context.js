import { createContext } from 'react';

export default createContext({
  isOpen: false,
  closeModal: () => null,
  openModal: () => null,
});
