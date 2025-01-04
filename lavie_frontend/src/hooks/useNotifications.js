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
      await axiosReq.patch(`/notifications/${notificationId}/mark-as-read/`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

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
    const interval = setInterval(fetchNotifications, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    clearNotifications,
  };
};

export default useNotifications;
