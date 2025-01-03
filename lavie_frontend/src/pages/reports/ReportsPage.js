import React, { useEffect, useState } from "react";
import axios from "../../api/axiosDefaults";
import ReportCard from "./ReportCard";
import styles from "../../styles/ReportsPage.module.css";
import { useHistory } from "react-router-dom";

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const history = useHistory();

  const fetchReports = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`/reports/?page=${page}`);
      setReports(data.results);
      setHasNextPage(!!data.next);
    } catch (err) {
      setError("Failed to fetch reports. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className={styles.ReportsPage}>
      <h1>Reports</h1>

      <button
        className={styles.CreateReportButton}
        onClick={() => history.push("/reports/create")}
      >
        Create a Report
      </button>

      {loading && <p>Loading reports...</p>}
      {error && <p className={styles.Error}>{error}</p>}
      {!loading && !error && reports.length === 0 && (
        <p>No reports available.</p>
      )}

      {!loading && reports.length > 0 && (
        <div className={styles.ReportsList}>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {!loading && (
        <div className={styles.Pagination}>
          <button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={!hasNextPage}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
