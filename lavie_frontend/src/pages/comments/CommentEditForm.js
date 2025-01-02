import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/CommentCreateEditForm.module.css";

function CommentEditForm({ id, content, setShowEditForm, setComments }) {
  const [formContent, setFormContent] = useState(content);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormContent(event.target.value);
    setError(""); // Clear error on new input
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formContent.trim() === content.trim()) {
      setShowEditForm(false); // Close form if no changes were made
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id
            ? { ...comment, content: formContent.trim(), updated_at: "now" } // if comment id matches id, return updated comment
            : comment
        ),
      }));
      setShowEditForm(false);
    } catch (err) {
      setError("Failed to update the comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
          aria-label="Edit comment"
        />
        {error && <div className="text-danger mt-1">{error}</div>}
      </Form.Group>
      <div className="text-right">
        <button
          className={`${styles.Button} mr-2`}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          Cancel
        </button>
        <button
          className={styles.Button}
          disabled={
            !formContent.trim() ||
            isSubmitting ||
            formContent.trim() === content.trim()
          }
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;
