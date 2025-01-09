import { useState, useEffect, useCallback } from "react";
import { axiosReq } from "../api/axiosDefaults";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosReq.get("/notifications/");
      setNotifications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axiosReq.patch(`/notifications/${notificationId}/`, {
        is_read: true,
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // Only get the notifications that are unread
      const notificationIds = notifications
        .filter((notif) => !notif.is_read)
        .map((notif) => notif.id);

      if (notificationIds.length === 0) return;

      await axiosReq.patch("/notifications/mark-as-read/", {
        notification_ids: notificationIds,
      });

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  }, [notifications]);

  const clearNotifications = useCallback(async () => {
    try {
      await axiosReq.delete("/notifications/clear/");
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
};

export default useNotifications;
