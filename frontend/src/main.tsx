import { createRoot } from 'react-dom/client';
import { createBrowserRouter,RouterProvider } from 'react-router';
import './index.css'
import LandingPage from './screens/LandingPage.tsx';
import GamePage from './screens/GameStartPage.tsx';
import {UserContextProvider} from "./store/contextProvider";
import { SocketContextProvider } from './store/socketProvider.tsx';
import UserGamePage from './screens/GamePage.tsx';

const router = createBrowserRouter([
  {path: '/',element: <LandingPage/>},
  {path: '/game',element: <GamePage/>},
  {path: "/game/:gameId", element: <UserGamePage/>}

])

createRoot(document.getElementById('root')!).render(
    <UserContextProvider>
      <SocketContextProvider>
        <RouterProvider router={router}/>
      </SocketContextProvider>
    </UserContextProvider>
)
