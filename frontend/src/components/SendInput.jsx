import { IoSend } from "react-icons/io5";
import React, {useState } from "react";
import { axiosInstance } from "../routes/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const SendInput = () => {
  const [message,setMessage] = useState("");
  // console.log(message);
  const dispatch = useDispatch();
  let selectedUser = useSelector((state)=>state.user.selectedUser);
  let messages = useSelector((state)=>state.message.messages);
  async function handleSubmit(e){
    e.preventDefault();
    try {
      let response = await axiosInstance.post(`/messages/send/${selectedUser?._id}`,{message},{
        headers:{
          "Content-Type":"application/json"
        }
      });
      // console.log(response);
      // alert(message);
      dispatch(setMessages([...messages,response.data.message]));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="px-4">
      <div className="relative">
        <input
          type="text"
          name=""
          id=""
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          placeholder="Send Message..."
          className="w-full bg-black p-2 text-lg block pr-9 text-gray-300 tracking-wide outline-none rounded-lg"
        />
        <button type="submit" className="absolute inset-y-0 end-3 items-center block">
          <IoSend />
        </button>
      </div>
    </form>
  );
};

export default SendInput;
