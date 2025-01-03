import React, { useState } from "react";
import styles from "../styles/BlockButton.module.css";

function BlockButton({ userId, onBlock, onUnblock, isBlocked }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isBlocked) {
        await onUnblock(userId);
      } else {
        await onBlock(userId);
      }
    } catch (error) {
      console.error("Error while toggling block status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={styles.BlockButton}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Processing..." : isBlocked ? "Unblock" : "Block"}
    </button>
  );
}

export default BlockButton;
