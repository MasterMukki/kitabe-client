import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home';
import NewBook from '@/pages/NewBook';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout, 
    children: [
      {
        index: true, 
        Component: Home,
      },
      {
        path: '/add/new-book',
        Component: NewBook, 
      }
    ],
  },
]);

export default router;
