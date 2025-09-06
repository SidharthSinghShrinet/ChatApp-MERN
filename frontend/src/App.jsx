import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import {io} from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/userSlice'
import { createContext } from 'react'

export const SocketContext = createContext();

const routes = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/signup",
    element:<SignupPage/>
  },
  {
    path:"/login",
    element:<LoginPage/>
  }
])

const App = () => {
  let dispatch = useDispatch();
  let authUser = useSelector((state)=>state.user.authUser);
  let {socket} = useSelector((state)=>state.socket);
  let [socketObj,setSocketObj] = useState(null);
  useEffect(()=>{
    if(authUser){
      const socket = io(import.meta.env.VITE_BACKEND_URL,{
        withCredentials:true,
        transports:["websocket","polling"],
        query:{
          userId:authUser._id
        }
      })
      socket.on('connect',()=>{
        // console.log("Socket Connected ✅:",socket.id);
        setSocketObj(socket);
        dispatch(setSocket(socket.id));
      })
      socket.on('getOnlineUsers',(onlineUsers)=>{
        // console.log(onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
      }) 
      return ()=> socket.close();
    }else{
      if(socketObj){
        socketObj.close();
        dispatch(setSocket(null));
      }
    }
  },[authUser]);
  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      <SocketContext.Provider value={socketObj}>
        <RouterProvider router={routes}/>
      </SocketContext.Provider>
    </div>
  )
}

export default App