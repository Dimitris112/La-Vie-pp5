import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBlockedUsers } from "../api/blocks";
import axios from "../api/axiosDefaults";

const useBlocking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const blockUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is already blocked
      const blockedUsers = await fetchBlockedUsers();
      const isBlocked = blockedUsers.some((user) => user.id === userId);

      if (isBlocked) {
        setError("You have already blocked this user.");
        return;
      }

      await axios.post("/blocks/", { blocked: userId });
      navigate(`/profiles/${userId}`);
    } catch (err) {
      setError("Failed to block the user.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unblockUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/blocks/${userId}/`);
      navigate(`/profiles/${userId}`);
    } catch (err) {
      setError("Failed to unblock the user.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    blockUser,
    unblockUser,
    loading,
    error,
  };
};

export default useBlocking;
