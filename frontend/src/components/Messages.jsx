import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMessages from '../hooks/useGetRealTimeMessages';

const Messages = () => {
  const messages = useSelector((state) => state.message.messages);
  useGetMessages();
  useGetRealTimeMessages();

  return (
    <div className='flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3 min-h-0 momentum-scroll select-text'>
      <Message messages={messages || []} />
    </div>
  );
};

export default Messages;