
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@app/providers';
import { router } from './app/router';
import { AddToHomeScreen } from '@components/ui';


function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <AddToHomeScreen />
    </AppProviders>
  );
}

export default App;
