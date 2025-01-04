import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { FaBell } from "react-icons/fa";
import useNotifications from "../hooks/useNotifications";
import styles from "../styles/NotificationBell.module.css";

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const currentUser = useCurrentUser();
  const history = useHistory();

  const { notifications, unreadCount, markAllAsRead, loading, error } =
    useNotifications();

  const handleBellClick = () => {
    setShowDropdown((prev) => !prev);
    if (unreadCount > 0) markAllAsRead();
  };

  const navigateToNotification = (notificationId) => {
    history.push(`/notifications/${notificationId}`);
    setShowDropdown(false);
  };

  if (!currentUser) return null;

  return (
    <div className={styles.NotificationBell}>
      <button
        className={styles.BellButton}
        onClick={handleBellClick}
        aria-label="Notifications"
      >
        <FaBell size={30} className={styles.BellIcon} />
        {unreadCount > 0 && (
          <span
            className={styles.UnreadCount}
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className={styles.Dropdown} role="menu">
          {loading && (
            <p className={styles.Loading}>Loading notifications...</p>
          )}
          {error && <p className={styles.Error}>Error: {error}</p>}
          {!loading && !error && notifications.length === 0 && (
            <p>No new notifications.</p>
          )}

          {!loading &&
            !error &&
            notifications.length > 0 &&
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.NotificationItem} ${
                  !notification.read ? styles.UnreadNotification : ""
                }`}
                onClick={() => navigateToNotification(notification.id)}
                role="menuitem"
              >
                <p>{notification.message}</p>
                {notification.read && (
                  <span className={styles.ReadLabel}>Read</span>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
