import { useEffect } from "react";
import { axiosInstance } from "../routes/axiosInstance";
import {useSelector,useDispatch} from 'react-redux'
import { setMessages } from "../redux/messageSlice";
const useGetMessages = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state)=>state.user.selectedUser);
  async function fetchMessages(){
    try {
      let response = await axiosInstance.get(`/messages/${selectedUser?._id}`);
      // console.log(response.data.data.messages);
      dispatch(setMessages(response?.data?.data?.messages || []));
    } catch (error) {
      console.log(error);
    }    
  }
  useEffect(()=>{
    if(!selectedUser?._id) return;
    fetchMessages();
  },[selectedUser]);
  return(
    <></>
  )
};

export default useGetMessages