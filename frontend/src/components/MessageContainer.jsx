import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
const MessageContainer = () => {
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const onlineUsers = useSelector((state)=>state.user.onlineUsers);
  const authUser = useSelector((state)=> state.user.authUser);
  const dispatch = useDispatch();
  useEffect(()=>{
    return ()=>{
      dispatch(setSelectedUser([]))
    }
  },[])
  // console.log(selectedUser);
  return (
    <>
      {selectedUser.length === 0 ? (
        <div className="md:min-w-[575px] flex flex-col justify-center items-center">
          <p className="text-3xl text-red-900 capitalize font-bold">Hi, {authUser?.fullname || ""}</p>
          <h1 className="text-4xl text-black font-bold">Let's Start Conversation</h1>
        </div>
      ) : (
        <div className="md:min-w-[575px] flex flex-col">
          <div className="h-13 flex gap-2 bg-zinc-800 text-white px-3 mb-2 relative">
            <div className="w-full h-full flex items-center gap-3">
              <img
                className="w-11 h-11 rounded-full object-cover"
                src={selectedUser.profilePhoto}
                alt=""
              />
              {onlineUsers.includes(selectedUser._id)?(<span className="absolute block w-2 h-2 ml-8 mt-8 bg-green-500 rounded-full ring-2 ring-white"></span>):""}
              <p className="text-xl tracking-wider font-bold">
                {selectedUser.fullname}
              </p>
            </div>
          </div>
          <Messages />
          <SendInput />
        </div>
      )}
    </>
  );
};

export default MessageContainer;
