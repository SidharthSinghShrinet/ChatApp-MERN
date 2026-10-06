import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '../redux/messageSlice';
import { SocketContext } from '../App';

const useGetRealTimeMessages = () => {
  const socketObj = useContext(SocketContext);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state)=>state.user.selectedUser);
  const authUser = useSelector((state)=>state.user.authUser);

  const selectedId = selectedUser?._id;
  const myId = authUser?._id;

  useEffect(()=>{
    if(!socketObj) return;
    const handler = (newMessage)=>{
      // Only append messages belonging to the currently open conversation,
      // otherwise a message from user A pops into user C's chat window.
      if(!selectedId || !myId) return;
      const sender = String(newMessage?.senderId || "");
      const receiver = String(newMessage?.receiverId || "");
      const isCurrentConversation =
        (sender === String(selectedId) && receiver === String(myId)) ||
        (sender === String(myId) && receiver === String(selectedId));
      if(isCurrentConversation){
        dispatch(addMessage(newMessage));
      }
    };
    socketObj.on("newMessage", handler);
    return ()=>{
      socketObj.off("newMessage", handler);
    };
  },[socketObj, selectedId, myId, dispatch]);

  return null;
}

export default useGetRealTimeMessages