import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ messages }) => {
  let authUser = useSelector((state)=>state.user.authUser);
  let selectedUser = useSelector((state)=>state.user.selectedUser);
  // console.log(messages);
  function formatTime(dateString){
    const date = new Date(dateString);
    return date.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  }
  const scroll = useRef();
  useEffect(()=>{
    scroll.current?.scrollIntoView({behavior:"smooth"})
  },[messages])
  return (
    <div>
      {messages.length === 0 ? (
        ""
      ) : (
        messages.map((message, idx) => (
          <div className={`chat ${authUser?._id===message?.senderId?'chat-end':'chat-start'}`} key={message?._id || idx} ref={idx===messages.length-1?scroll:null}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src={authUser?._id===message?.senderId ? authUser.profilePhoto:selectedUser.profilePhoto}
                />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50">{formatTime(message.createdAt)}</time>
            </div>
            <div className={`chat-bubble chat ${authUser?._id===message?.senderId?'bg-green-800 text-white':'bg-black text-white'}`}>{message.message}</div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>
        ))
      )}
    </div>
  );
};

export default Message;
