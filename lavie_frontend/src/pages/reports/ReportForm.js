import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../api/axiosDefaults";
import styles from "../../styles/ReportForm.module.css";

function ReportForm({ type, objectId }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        type, // post - comment - profile
        object_id: objectId,
        reason,
        details,
      };
      await axios.post("/reports/", data);
      alert("Report submitted successfully.");
      history.push("/");
    } catch (err) {
      setError(
        "An error occurred while submitting the report. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.ReportForm}>
      <h2>Report {type}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.FormGroup}>
          <label htmlFor="reason">Reason *</label>
          <input
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder="Enter a brief reason for reporting"
          />
        </div>
        <div className={styles.FormGroup}>
          <label htmlFor="details">Details (Optional)</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide additional details (optional)"
          />
        </div>
        {error && <p className={styles.Error}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
