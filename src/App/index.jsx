import React from 'react';
import { useRoutes } from 'react-router-dom';
import Modal from 'components/Modal';
import routes from '../routes';

function App() {
  const routesElement = useRoutes(routes);
  return <Modal>{routesElement}</Modal>;
}

export default App;
