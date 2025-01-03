import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/ReportCard.module.css";

function ReportCard({ report }) {
  return (
    <div className={styles.ReportCard}>
      <p>
        <strong>Type:</strong> {report.type}
      </p>
      <p>
        <strong>Reason:</strong> {report.reason}
      </p>
      <p>
        <strong>Details:</strong> {report.details || "N/A"}
      </p>
      <p>
        <strong>Reported On:</strong>{" "}
        {new Date(report.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {report.status || "Pending"}
      </p>
    </div>
  );
}

ReportCard.propTypes = {
  report: PropTypes.shape({
    type: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    details: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    status: PropTypes.string,
  }).isRequired,
};

export default ReportCard;
