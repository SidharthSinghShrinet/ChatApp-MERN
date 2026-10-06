import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/userSlice'
import { createContext } from 'react'

export const SocketContext = createContext();

const ProtectedRoute = ({ children }) => {
  const authUser = useSelector((state) => state.user.authUser);
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const authUser = useSelector((state) => state.user.authUser);
  if (authUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const App = () => {
  let dispatch = useDispatch();
  let authUser = useSelector((state) => state.user.authUser);
  let { socket } = useSelector((state) => state.socket);
  let themeMode = useSelector((state) => state.theme?.mode) || 'dark';
  let [socketObj, setSocketObj] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    if (authUser) {
      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        query: {
          userId: authUser._id,
        },
      });
      socket.on('connect', () => {
        // console.log("Socket Connected ✅:",socket.id);
        setSocketObj(socket);
        dispatch(setSocket(socket.id));
      });
      socket.on('connect_error', (err) => {
        console.log("Socket connect_error:", err?.message);
      });
      socket.on('getOnlineUsers', (onlineUsers) => {
        // console.log(onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
      });
      return () => socket.close();
    } else {
      if (socketObj) {
        socketObj.close();
        setSocketObj(null);
        dispatch(setSocket(null));
      }
    }
  }, [authUser]);

  return (
    <div className='min-h-[100dvh] w-full flex flex-col items-center justify-center p-0 sm:p-3 md:p-6 relative overflow-x-hidden overflow-y-auto'>
      {/* Ambient glow mesh */}
      <div className="absolute top-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <SocketContext.Provider value={socketObj}>
        <RouterProvider router={routes} />
      </SocketContext.Provider>
    </div>
  );
};

export default App;