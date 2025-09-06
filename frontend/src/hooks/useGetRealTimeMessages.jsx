import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../redux/messageSlice';
import { useContext } from 'react';
import { SocketContext } from '../App';

const useGetRealTimeMessages = () => {
  const socketObj = useContext(SocketContext);
    const {socket} = useSelector((state)=>state.socket);
    const dispatch = useDispatch();
    const messages = useSelector((state)=>state.message.messages);
    // console.log(messages);
    // console.log(socket);
    useEffect(()=>{
        socketObj?.on("newMessage",(newMessage)=>{
            dispatch(setMessages([...messages,newMessage]))
        })
    },[socket,setMessages,messages]);
  return (
    <div>useGetRealTimeMessages</div>
  )
}

export default useGetRealTimeMessages