import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";

const Message = ({ messages }) => {
  const authUser = useSelector((state) => state.user.authUser);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const scroll = useRef();

  function formatTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-subtle)]">
        <p className="text-sm font-medium text-[var(--text-muted)]">No messages yet.</p>
        <p className="text-xs text-[var(--text-subtle)] mt-0.5">Send a message below to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-2">
      {messages.map((message, idx) => {
        const isFromMe = authUser?._id === message?.senderId;
        const isLast = idx === messages.length - 1;
        const avatarSrc = isFromMe ? authUser?.profilePhoto : selectedUser?.profilePhoto;
        const displayName = isFromMe ? authUser?.fullname : selectedUser?.fullname;
        const fallbackInitial = displayName ? displayName.charAt(0).toUpperCase() : (isFromMe ? "M" : "U");

        return (
          <div
            key={message?._id || idx}
            ref={isLast ? scroll : null}
            className={`flex items-end gap-2.5 ${isFromMe ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* MUI Avatar */}
            <div className="flex-shrink-0 mb-1">
              <Avatar
                src={avatarSrc}
                alt={displayName || "Avatar"}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  bgcolor: isFromMe ? 'rgba(99, 102, 241, 0.35)' : 'rgba(100, 116, 139, 0.25)',
                  color: isFromMe ? '#ffffff' : 'var(--text-heading)',
                  border: '1px solid var(--card-border-elevated)'
                }}
              >
                {fallbackInitial}
              </Avatar>
            </div>

            {/* Bubble & Metadata */}
            <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%] min-w-0 ${isFromMe ? "items-end" : "items-start"}`}>
              <div
                style={{
                  backgroundColor: !isFromMe ? "var(--msg-incoming-bg)" : undefined,
                  color: !isFromMe ? "var(--msg-incoming-text)" : undefined,
                  borderColor: !isFromMe ? "var(--msg-incoming-border)" : undefined,
                }}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-normal leading-relaxed break-words [overflow-wrap:anywhere] shadow-md transition-colors duration-200 ${
                  isFromMe
                    ? "bg-gradient-to-r from-indigo-600 via-indigo-600 to-cyan-600 text-white rounded-2xl rounded-br-xs border border-indigo-400/20 shadow-indigo-600/20"
                    : "rounded-2xl rounded-bl-xs border shadow-sm"
                }`}
              >
                {message?.message}
              </div>

              {/* Timestamp & Status */}
              <div
                className={`flex items-center gap-1.5 mt-1 px-1 text-[10px] text-[var(--text-subtle)] font-medium ${
                  isFromMe ? "justify-end" : "justify-start"
                }`}
              >
                <time>{formatTime(message?.createdAt)}</time>
                {isFromMe && (
                  <span className="flex items-center gap-0.5 text-cyan-600 dark:text-cyan-400 font-semibold">
                    <IoCheckmarkDoneOutline className="text-xs" />
                    <span>Delivered</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Message;
