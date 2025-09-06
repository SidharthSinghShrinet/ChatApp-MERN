import React from 'react';
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages'
import { useSelector } from 'react-redux'
import useGetRealTimeMessages from '../hooks/useGetRealTimeMessages';
const Messages = () => {
  let messages = useSelector((state)=>state.message.messages);
  // console.log(messages);
  useGetMessages();
  useGetRealTimeMessages();
  return (
    <div className='flex-1 overflow-auto px-4'>
      <Message messages = {messages}/>
    </div>
  )
}

export default Messages