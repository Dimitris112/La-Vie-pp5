import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import styles from "../../styles/ReportForm.module.css";

function ReportForm({ type, objectId, show, handleClose }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [reportId, setReportId] = useState(null);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed) {
      setError("Please confirm that you want to report this content.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const data = {
        type, // post - comment - profile
        object_id: objectId,
        reason,
        details,
        report_type: reportType,
      };

      const response = await axios.post(`/profiles/${objectId}/reports/`, data);
      setReportId(response.data.id);

      alert("Report submitted successfully.");

      history.push(`/profiles/${objectId}/reports/${response.data.id}`);

      handleClose();
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
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Report this {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.ReportForm}>
          <div className={styles.FormGroup}>
            <label htmlFor="reason">Reason *</label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Enter a reason"
            />
          </div>

          <div className={styles.FormGroup}>
            <label htmlFor="reportType">Report Type *</label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="">Select a report type</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="other">Other</option>
            </select>
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

          <div className={styles.FormGroup}>
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <label htmlFor="confirm" style={{ marginLeft: "5px" }}>
              I confirm that I want to report this content.
            </label>
          </div>

          {error && <p className={styles.Error}>{error}</p>}

          {reportId && (
            <p>
              Your report has been submitted successfully. Report ID: {reportId}
            </p>
          )}

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-3"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit Report"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ReportForm;
