import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";
import { FaBell } from "react-icons/fa";
import styles from "../styles/NotificationBell.module.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const currentUser = useCurrentUser();
  const history = useHistory();
  useEffect(() => {
    if (currentUser) {
      const fetchNotifications = async () => {
        try {
          const { data } = await axiosReq.get(
            `/notifications/?user=${currentUser.id}`
          );
          setNotifications(data.results);
          setUnreadCount(
            data.results.filter((notification) => !notification.read).length
          );
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        }
      };

      fetchNotifications();
    }
  }, [currentUser]);

  const handleBellClick = () => {
    setShowDropdown((prev) => !prev);
    if (unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await axiosReq.patch(`/notifications/mark-read/`);
      setUnreadCount(0);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const navigateToNotification = (notificationId) => {
    history.push(`/notifications/${notificationId}`);
    setShowDropdown(false);
  };

  return (
    <div className={styles.NotificationBell}>
      <FaBell
        size={30}
        className={styles.BellIcon}
        onClick={handleBellClick}
        style={{ cursor: "pointer" }}
      />
      {unreadCount > 0 && (
        <span className={styles.UnreadCount}>{unreadCount}</span>
      )}

      {showDropdown && (
        <div className={styles.Dropdown}>
          {notifications.length === 0 ? (
            <p>No new notifications.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={styles.NotificationItem}
                onClick={() => navigateToNotification(notification.id)}
              >
                <p>{notification.message}</p>
                {notification.read && (
                  <span className={styles.ReadLabel}>Read</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
