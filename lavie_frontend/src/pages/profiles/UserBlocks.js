import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/UserBlocksReports.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const UserBlocks = () => {
  const { id } = useParams();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);

  useEffect(() => {
    axios
      .get(`/profiles/${id}/blocked-users/`)
      .then((response) =>
        setBlockedUsers(Array.isArray(response.data) ? response.data : [])
      )
      .catch((error) => console.error("Error fetching blocked users:", error));
  }, [id]);

  const handleUnblock = (userId) => {
    axios
      .post(`/profiles/${id}/unblock/${userId}/`)
      .then(() => {
        setBlockedUsers(blockedUsers.filter((user) => user.id !== userId));
        setShowUnblockModal(false);
      })
      .catch((error) => console.error("Error unblocking user:", error));
  };

  return (
    <div className={styles["blocks_reports-container"]}>
      <h1>Blocked Users</h1>
      {Array.isArray(blockedUsers) && blockedUsers.length > 0 ? (
        <ul className={styles["blocks_reports-list"]}>
          {blockedUsers.map((user) => (
            <li key={user.id} className={styles["blocks_reports-list-item"]}>
              {user.username}
              <Button
                variant="danger"
                onClick={() => {
                  setUserToUnblock(user.id);
                  setShowUnblockModal(true);
                }}
                className={styles["blocks_reports-button"]}
              >
                Unblock
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No blocked users found.</p>
      )}

      <Modal show={showUnblockModal} onHide={() => setShowUnblockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unblock User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to unblock this user?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUnblockModal(false)}
            className={styles["blocks_reports-button"]}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => userToUnblock && handleUnblock(userToUnblock)}
            className={styles["blocks_reports-button"]}
          >
            Unblock
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserBlocks;
