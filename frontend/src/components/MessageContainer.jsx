import React, { useEffect, useState, useContext } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { IoChatbubblesOutline, IoShieldCheckmarkOutline, IoArrowBack } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";
import { SocketContext } from "../App";

const MessageContainer = () => {
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const onlineUsers = useSelector((state) => state.user.onlineUsers) || [];
  const authUser = useSelector((state) => state.user.authUser);
  const dispatch = useDispatch();
  const socketObj = useContext(SocketContext);
  const [isContactTyping, setIsContactTyping] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser([]));
    };
  }, [dispatch]);

  // Keyboard shortcut: Press Escape to return to contact list
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedUser?._id) {
        dispatch(setSelectedUser([]));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedUser, dispatch]);

  // Live typing socket listeners
  useEffect(() => {
    setIsContactTyping(false);
    if (!socketObj || !selectedUser?._id) return;

    const handleTyping = ({ senderId }) => {
      if (String(senderId) === String(selectedUser._id)) {
        setIsContactTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (String(senderId) === String(selectedUser._id)) {
        setIsContactTyping(false);
      }
    };

    socketObj.on("typing", handleTyping);
    socketObj.on("stopTyping", handleStopTyping);

    return () => {
      socketObj.off("typing", handleTyping);
      socketObj.off("stopTyping", handleStopTyping);
    };
  }, [socketObj, selectedUser?._id]);

  const isUserSelected = selectedUser && selectedUser._id;
  const isSelectedUserOnline = isUserSelected && onlineUsers.includes(selectedUser._id);

  return (
    <main className="flex-1 flex flex-col h-full bg-[var(--msg-container-bg)] relative min-w-0 min-h-0 overflow-hidden transition-colors duration-300">
      {!isUserSelected ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 min-h-0 overflow-y-auto momentum-scroll">
          <div className="my-auto py-6 flex flex-col items-center max-w-sm">
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-3xl bg-indigo-50/80 dark:bg-gradient-to-tr dark:from-indigo-600/30 dark:via-indigo-500/20 dark:to-cyan-400/30 border border-indigo-200/80 dark:border-white/15 flex items-center justify-center shadow-md dark:shadow-[0_0_35px_rgba(99,102,241,0.25)]">
                <IoChatbubblesOutline className="text-4xl text-indigo-600 dark:text-cyan-300" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 blur-sm pointer-events-none" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100/70 dark:bg-white/[0.04] border border-indigo-200/80 dark:border-white/10 text-xs font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
              Hi, {authUser?.fullname || "Friend"}! 👋
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-heading)] tracking-tight mb-2">
              Let's Start Conversation
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-sm font-medium leading-relaxed mb-6">
              Select a contact from the sidebar to send and receive real-time direct messages.
            </p>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/[0.03] border border-slate-300/50 dark:border-white/10 text-[11px] font-medium text-[var(--text-subtle)]">
              <IoShieldCheckmarkOutline className="text-emerald-500 dark:text-emerald-400 text-sm" />
              <span>End-to-End Real-Time Relay</span>
            </div>
          </div>
        </div>
      ) : (
        /* Active Chat State */
        <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden">
          {/* Active Chat Header */}
          <div className="h-14 sm:h-16 px-2.5 sm:px-5 border-b border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] backdrop-blur-xl flex items-center justify-between flex-shrink-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => dispatch(setSelectedUser([]))}
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-heading)] hover:bg-slate-200/50 dark:hover:bg-white/10 active:scale-90 active:bg-slate-300/60 dark:active:bg-white/20 transition-all cursor-pointer flex-shrink-0"
                aria-label="Back to contacts list"
                title="Back to contacts"
              >
                <IoArrowBack className="text-xl" />
              </button>

              <div className="relative flex-shrink-0">
                <Avatar
                  src={selectedUser?.profilePhoto}
                  alt={selectedUser?.fullname || "Contact"}
                  sx={{
                    width: 42,
                    height: 42,
                    fontSize: '1rem',
                    fontWeight: 700,
                    bgcolor: 'rgba(99, 102, 241, 0.25)',
                    color: 'var(--text-heading)',
                    border: '1px solid var(--card-border-elevated)'
                  }}
                >
                  {selectedUser?.fullname ? selectedUser.fullname.charAt(0).toUpperCase() : "C"}
                </Avatar>
                {isSelectedUserOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0d1326] shadow-sm z-10" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-heading)] truncate">
                  {selectedUser.fullname}
                </h3>
                <div className="text-[11px] font-medium flex items-center gap-1.5 min-h-[16px]">
                  {isContactTyping ? (
                    <span className="text-cyan-500 dark:text-cyan-400 font-semibold flex items-center gap-1.5 animate-pulse">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      typing...
                    </span>
                  ) : (
                    <>
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          isSelectedUserOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                        }`}
                      />
                      <span className={isSelectedUserOnline ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-subtle)]"}>
                        {isSelectedUserOnline ? "Active now" : "Offline"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Timeline */}
          <Messages isTyping={isContactTyping} />

          {/* Message Input Bar */}
          <SendInput />
        </div>
      )}
    </main>
  );
};

export default MessageContainer;
