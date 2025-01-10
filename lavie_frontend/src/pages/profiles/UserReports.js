import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/UserBlocksReports.module.css";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";

const UserReports = () => {
  const { id } = useParams();
  const [reportedUsers, setReportedUsers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`/profiles/${id}/reported-users`)
      .then((response) =>
        setReportedUsers(Array.isArray(response.data) ? response.data : [])
      )
      .catch((error) => console.error("Error fetching reported users:", error));

    axios
      .get(`/profiles/${id}/posts`)
      .then((response) =>
        setUserPosts(Array.isArray(response.data) ? response.data : [])
      )
      .catch((error) => console.error("Error fetching user posts:", error));
  }, [id]);

  return (
    <div className={styles["blocks_reports-container"]}>
      <h1>Reported Users</h1>
      {Array.isArray(reportedUsers) && reportedUsers.length > 0 ? (
        <ul className={styles["blocks_reports-list"]}>
          {reportedUsers.map((user) => (
            <li key={user.id} className={styles["blocks_reports-list-item"]}>
              {user.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reported users found.</p>
      )}

      <h2>Posts by Reported Users</h2>
      {Array.isArray(userPosts) && userPosts.length > 0 ? (
        <ul className={styles["blocks_reports-list"]}>
          {userPosts.map((post) => (
            <li key={post.id} className={styles["blocks_reports-list-item"]}>
              {post.title}
              <Button
                variant="primary"
                href={`/posts/${post.id}`}
                className={`${styles["blocks_reports-button"]} ml-2`}
              >
                View Post
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found for reported users.</p>
      )}
    </div>
  );
};

export default UserReports;
