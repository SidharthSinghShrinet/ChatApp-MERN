import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { clearUnread } from "../redux/messageSlice";
import { IoSearchOutline } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";

const OtherUser = () => {
  const dispatch = useDispatch();
  const allOtherUsers = useSelector((state) => state.user.allOthersUser);
  const onlineUsers = useSelector((state) => state.user.onlineUsers) || [];
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const unreadCounts = useSelector((state) => state.message?.unreadCounts) || {};
  const input = useSelector((state) => state.user.input);

  function selectedUserHandler(user) {
    dispatch(setSelectedUser(user));
    if (user?._id) {
      dispatch(clearUnread(user._id));
    }
  }

  const displayedUsers = (allOtherUsers || []).filter((user) => {
    if (!input || input.trim() === "") return true;
    return user?.fullname?.toLowerCase().includes(input.toLowerCase().trim());
  });

  if (!allOtherUsers || allOtherUsers.length === 0) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-200/50 dark:bg-white/[0.03] animate-pulse">
            <div className="w-10 h-10 rounded-full bg-slate-300/70 dark:bg-slate-700/50" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-300/70 dark:bg-slate-700/50 rounded w-3/4" />
              <div className="h-2.5 bg-slate-300/40 dark:bg-slate-800/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayedUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-200/60 dark:bg-white/5 flex items-center justify-center text-[var(--text-subtle)] mb-2">
          <IoSearchOutline className="text-xl" />
        </div>
        <p className="text-xs font-semibold text-[var(--text-muted)]">No contacts found</p>
        <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">Try searching with a different name</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 py-1" role="listbox" aria-label="Direct message contacts">
      {displayedUsers.map((user, idx) => {
        const isSelected = selectedUser?._id === user?._id;
        const isOnline = onlineUsers.includes(user?._id);

        return (
          <div
            key={user?._id || idx}
            role="option"
            tabIndex={0}
            aria-selected={isSelected}
            aria-label={`Chat with ${user?.fullname || "contact"}${isOnline ? ", currently online" : ", currently offline"}`}
            onClick={() => selectedUserHandler(user)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectedUserHandler(user);
              }
            }}
            style={{
              background: isSelected ? "var(--contact-item-active-bg)" : undefined,
              borderColor: isSelected ? "var(--contact-item-active-border)" : "transparent",
              color: isSelected ? "var(--contact-item-active-text)" : undefined,
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-150 relative border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-[0.98] active:bg-slate-200/50 dark:active:bg-white/10 ${
              isSelected
                ? "shadow-sm"
                : "hover:bg-[var(--contact-item-hover)] text-[var(--text-primary)] hover:text-[var(--text-heading)]"
            }`}
          >
            {/* Active vertical accent pill */}
            {isSelected && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-indigo-500 to-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            )}

            {/* MUI Avatar & Online status indicator */}
            <div className="relative flex-shrink-0">
              <Avatar
                src={user?.profilePhoto}
                alt={user?.fullname || "User avatar"}
                sx={{
                  width: 40,
                  height: 40,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  bgcolor: isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.18)',
                  color: isSelected ? '#ffffff' : 'var(--text-heading)',
                  border: '1px solid var(--card-border-elevated)'
                }}
              >
                {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
              </Avatar>
              {isOnline && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0d1326] shadow-sm z-10"
                />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold truncate leading-tight">
                  {user?.fullname || "User"}
                </p>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                  {isOnline && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      online
                    </span>
                  )}
                  {unreadCounts[user?._id] > 0 && (
                    <span className="min-w-[19px] h-[19px] px-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm shadow-cyan-500/30">
                      {unreadCounts[user._id]}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-[var(--text-subtle)] truncate mt-0.5">
                @{user?.username || "contact"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OtherUser;
