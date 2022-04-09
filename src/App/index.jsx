import { useRoutes } from 'react-router-dom';
import routes from '../routes';

const App = () => {
  const a = useRoutes(routes);
  return a;
};

export default App;
