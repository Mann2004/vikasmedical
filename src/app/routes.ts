import { createBrowserRouter } from 'react-router';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/auth',
    Component: AuthPage,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
]);
