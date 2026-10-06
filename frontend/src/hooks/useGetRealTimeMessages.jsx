import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, incrementUnread } from '../redux/messageSlice';
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
      if(!myId) return;
      const sender = String(newMessage?.senderId || "");
      const receiver = String(newMessage?.receiverId || "");

      const isCurrentConversation =
        selectedId &&
        ((sender === String(selectedId) && receiver === String(myId)) ||
        (sender === String(myId) && receiver === String(selectedId)));

      if(isCurrentConversation){
        dispatch(addMessage(newMessage));
      } else if (sender !== String(myId)) {
        // Message arrived from someone else while user is on another screen
        dispatch(incrementUnread(sender));
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