import { IoSend } from "react-icons/io5";
import React, { useState } from "react";
import { axiosInstance } from "../routes/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/messageSlice";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.user.selectedUser);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || !selectedUser?._id || isSending) return;

    const trimmedMsg = message.trim();
    setIsSending(true);
    try {
      let response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        { message: trimmedMsg },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.message) {
        dispatch(addMessage(response.data.message));
      }
      setMessage("");
    } catch (error) {
      console.log("Send message error:", error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="p-2.5 sm:p-4 pb-[max(0.625rem,env(safe-area-inset-bottom,0px))] border-t border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] backdrop-blur-xl flex-shrink-0 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          aria-label="Type your message"
          className="glass-input w-full pl-4 pr-14 py-2.5 sm:py-3 rounded-full text-[16px] sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-cyan-400"
        />
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          aria-label="Send message"
          className="absolute right-1.5 sm:right-2 w-8 sm:w-9 h-8 sm:h-9 rounded-full gradient-btn flex items-center justify-center text-white text-xs sm:text-sm shadow-md cursor-pointer disabled:opacity-40 disabled:pointer-events-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-cyan-400"
          title="Send Message"
        >
          <IoSend className="translate-x-[1px]" />
        </button>
      </form>
    </div>
  );
};

export default SendInput;
