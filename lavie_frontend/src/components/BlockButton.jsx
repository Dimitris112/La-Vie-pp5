import React, { useState } from "react";
import styles from "../styles/BlockButton.module.css";

function BlockButton({ userId, onBlock, onUnblock, isBlocked, error }) {
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
    <div>
      <button
        className={styles.BlockButton}
        onClick={handleClick}
        disabled={loading || error}
      >
        {loading ? "Processing..." : isBlocked ? "Unblock" : "Block"}
      </button>
      {error && <p className={styles.error}>{error}</p>}{" "}
    </div>
  );
}

export default BlockButton;
