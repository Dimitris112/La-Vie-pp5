import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm({
  post,
  setPost,
  setComments,
  profileImage,
  profile_id,
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
    setError(""); // Clear error on new input
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const { data } = await axiosRes.post("/comments/", {
        content: content.trim(),
        post,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results], // Prepend new comment
      }));
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count + 1, // Increment comments count
          },
        ],
      }));
      setContent("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="Write your comment..."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
            aria-label="Comment text area"
          />
        </InputGroup>
        {error && <div className="text-danger mt-1">{error}</div>}
      </Form.Group>
      <button
        className={`${styles.Button} btn d-block ml-auto`}
        disabled={!content.trim() || isSubmitting} // Disable button if content is empty
        type="submit"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </Form>
  );
}

export default CommentCreateForm;
