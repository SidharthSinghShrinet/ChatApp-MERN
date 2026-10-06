import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";

function getDateBadge(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();

  const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = todayDate.getTime() - dDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) {
    return d.toLocaleDateString(undefined, { weekday: "long" }); // "Saturday", "Sunday", etc.
  }
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function isDifferentDay(d1Str, d2Str) {
  if (!d1Str || !d2Str) return true;
  const d1 = new Date(d1Str);
  const d2 = new Date(d2Str);
  return (
    d1.getFullYear() !== d2.getFullYear() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getDate() !== d2.getDate()
  );
}

const Message = ({ messages, isTyping }) => {
  const authUser = useSelector((state) => state.user.authUser);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const unreadCounts = useSelector((state) => state.message?.unreadCounts) || {};
  const scroll = useRef();

  const [unreadBoundaryId, setUnreadBoundaryId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const initialLoadDoneRef = useRef(false);

  function formatTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Reset unread tracking on conversation switch
  useEffect(() => {
    initialLoadDoneRef.current = false;
    setUnreadBoundaryId(null);
    setUnreadCount(0);
  }, [selectedUser?._id]);

  // Determine unread boundary once per conversation load
  useEffect(() => {
    if (!messages || messages.length === 0 || !authUser?._id || !selectedUser?._id) return;
    if (initialLoadDoneRef.current) return;

    const storageKey = `lastRead_${authUser._id}_${selectedUser._id}`;
    const lastReadAt = localStorage.getItem(storageKey);

    let count = 0;
    let firstUnreadId = null;

    if (lastReadAt) {
      const lastReadTime = new Date(lastReadAt).getTime();
      messages.forEach((m) => {
        const isFromOther = String(m.senderId) !== String(authUser._id);
        const msgTime = new Date(m.createdAt).getTime();
        if (isFromOther && msgTime > lastReadTime) {
          count++;
          if (!firstUnreadId) firstUnreadId = m._id;
        }
      });
    }

    // Fallback to active Redux unread count if storage had no previous marker
    const reduxCount = unreadCounts[selectedUser._id] || 0;
    if (reduxCount > 0 && count === 0) {
      const incoming = messages.filter((m) => String(m.senderId) !== String(authUser._id));
      const slice = incoming.slice(-reduxCount);
      if (slice.length > 0) {
        firstUnreadId = slice[0]._id;
        count = slice.length;
      }
    }

    if (count > 0 && firstUnreadId) {
      setUnreadBoundaryId(firstUnreadId);
      setUnreadCount(count);
    }

    initialLoadDoneRef.current = true;

    // Record last read timestamp for future visits
    const latest = messages[messages.length - 1];
    if (latest?.createdAt) {
      localStorage.setItem(storageKey, latest.createdAt);
    }
  }, [messages, authUser?._id, selectedUser?._id, unreadCounts]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!messages || messages.length === 0) {
    return (
      <div className="h-full flex flex-col justify-end p-2 min-h-0">
        {isTyping ? (
          <div ref={scroll} className="flex items-end gap-2.5 flex-row animate-mobile-fade-in py-2">
            <div className="flex-shrink-0 mb-1">
              <Avatar
                src={selectedUser?.profilePhoto}
                alt={selectedUser?.fullname || "Contact"}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(100, 116, 139, 0.25)',
                  color: 'var(--text-heading)',
                  border: '1px solid var(--card-border-elevated)'
                }}
              >
                {selectedUser?.fullname ? selectedUser.fullname.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-xs bg-[var(--msg-incoming-bg)] border border-[var(--msg-incoming-border)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-subtle)] my-auto">
            <p className="text-sm font-medium text-[var(--text-muted)]">No messages yet.</p>
            <p className="text-xs text-[var(--text-subtle)] mt-0.5">Send a message below to start the conversation!</p>
          </div>
        )}
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

        const prevMessage = idx > 0 ? messages[idx - 1] : null;
        const showDatePill = !prevMessage || isDifferentDay(prevMessage?.createdAt, message?.createdAt);
        const showUnreadPill = unreadBoundaryId && String(message?._id) === String(unreadBoundaryId);

        return (
          <React.Fragment key={message?._id || idx}>
            {/* WhatsApp Style Date Pill */}
            {showDatePill && (
              <div className="flex justify-center my-2.5 select-none">
                <span className="px-3.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide bg-slate-800/85 dark:bg-[#182232]/95 text-slate-300 dark:text-slate-300 border border-slate-700/50 dark:border-white/10 shadow-sm backdrop-blur-md">
                  {getDateBadge(message.createdAt)}
                </span>
              </div>
            )}

            {/* WhatsApp Style Unread Messages Banner */}
            {showUnreadPill && (
              <div className="flex items-center my-3 select-none w-full animate-mobile-fade-in">
                <div className="flex-1 h-[1px] bg-cyan-500/20" />
                <span className="mx-3 px-3.5 py-1 rounded-full bg-slate-900/95 dark:bg-[#111a2e]/95 border border-cyan-500/40 text-cyan-400 dark:text-cyan-300 text-xs font-semibold shadow-sm backdrop-blur-md">
                  {unreadCount} {unreadCount === 1 ? "unread message" : "unread messages"}
                </span>
                <div className="flex-1 h-[1px] bg-cyan-500/20" />
              </div>
            )}

            <div
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
          </React.Fragment>
        );
      })}

      {/* Live Typing Bouncing Bubble */}
      {isTyping && (
        <div ref={scroll} className="flex items-end gap-2.5 flex-row animate-mobile-fade-in py-1">
          <div className="flex-shrink-0 mb-1">
            <Avatar
              src={selectedUser?.profilePhoto}
              alt={selectedUser?.fullname || "Contact"}
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.8rem',
                fontWeight: 700,
                bgcolor: 'rgba(100, 116, 139, 0.25)',
                color: 'var(--text-heading)',
                border: '1px solid var(--card-border-elevated)'
              }}
            >
              {selectedUser?.fullname ? selectedUser.fullname.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-xs bg-[var(--msg-incoming-bg)] border border-[var(--msg-incoming-border)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
