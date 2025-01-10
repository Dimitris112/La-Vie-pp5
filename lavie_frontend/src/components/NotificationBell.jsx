import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import styles from "../styles/NotificationBell.module.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await fetch("/api/notifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data.results)) {
            setNotifications(data.results);
            setUnreadCount(
              data.results.filter((notification) => !notification.isRead).length
            );
          } else {
            setError("Unexpected data format received.");
          }
        } else {
          setError(data.detail || "Error fetching notifications.");
        }
      } catch (err) {
        setError("Failed to fetch notifications.");
        console.error("Error fetching notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleBellClick = () => {
    setModalOpen(true);
    if (unreadCount > 0) {
      // Mark all notifications as read when the bell is clicked
      markAllAsRead();
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch("/api/notifications/batch-mark-as-read/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notification_ids: notifications
            .filter((notification) => !notification.isRead)
            .map((notification) => notification.id),
        }),
      });

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const navigateToNotification = (notificationId) => {
    history.push(`/notifications/${notificationId}`);
    setModalOpen(false); // Close modal when a notification is clicked
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.notificationBell}>
      <button
        className={styles.notificationButton}
        onClick={handleBellClick}
        aria-label="Notifications"
      >
        <FaBell size={30} className={styles.notificationIcon} />
        {unreadCount > 0 && (
          <span className={styles.notificationBadge}>{unreadCount}</span>
        )}
      </button>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          {isLoading && (
            <p className={styles.loading}>Loading notifications...</p>
          )}
          {error && <p className={styles.error}>Error: {error}</p>}
          {!isLoading && !error && notifications.length === 0 && (
            <p>No new notifications.</p>
          )}

          {!isLoading &&
            !error &&
            notifications.length > 0 &&
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${
                  !notification.isRead ? styles.unreadNotification : ""
                }`}
                onClick={() => navigateToNotification(notification.id)}
              >
                <p>{notification.message}</p>
                {!notification.isRead && (
                  <span className={styles.unreadLabel}>New</span>
                )}
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotificationBell;
