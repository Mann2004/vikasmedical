import { createBrowserRouter } from 'react-router';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

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
  {
    path: '/admin-login',
    Component: AdminLogin,
  },
  {
    path: '/admin-panel',
    Component: AdminPanel,
  },
]);