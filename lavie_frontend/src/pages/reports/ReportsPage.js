import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportCard from "./ReportCard";
import styles from "../../styles/ReportsPage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNextPage, setHasNextPage] = useState(true);
  const [newReportContent, setNewReportContent] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const fetchReports = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`/reports/?page=${page}`);
      setReports((prevReports) => [...prevReports, ...data.results]);
      setHasNextPage(!!data.next); // If there's more data to fetch
    } catch (err) {
      setError("Failed to fetch reports. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const loadMoreReports = () => {
    if (!loading && hasNextPage) {
      const nextPage = Math.ceil(reports.length / 10) + 1; // Calculate next page based on current reports
      fetchReports(nextPage);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!newReportContent.trim()) {
      setError("Report content cannot be empty.");
      return;
    }

    setReportSubmitting(true);
    try {
      const response = await axios.post("/reports/", {
        content: newReportContent,
      });
      setReports([response.data, ...reports]);
      setNewReportContent("");
      setError("");
    } catch (err) {
      setError("Failed to create report. Please try again.");
      console.error(err);
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className={styles.ReportsPage}>
      <h1>Your Reports</h1>

      <form onSubmit={handleReportSubmit} className={styles.ReportForm}>
        <textarea
          value={newReportContent}
          onChange={(e) => setNewReportContent(e.target.value)}
          placeholder="Enter your report content..."
          rows="4"
          className={styles.ReportTextArea}
        />
        {error && <p className={styles.Error}>{error}</p>}
        <button
          type="submit"
          className={styles.SubmitReportButton}
          disabled={reportSubmitting}
        >
          {reportSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>

      {loading && <p>Loading reports...</p>}
      {error && !newReportContent && <p className={styles.Error}>{error}</p>}
      {!loading && !error && reports.length === 0 && (
        <p>No reports available.</p>
      )}

      <InfiniteScroll
        dataLength={reports.length}
        next={loadMoreReports}
        hasMore={hasNextPage}
        loader={<p>Loading more reports...</p>}
        endMessage={<p>No more reports to load.</p>}
      >
        <div className={styles.ReportsList}>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default ReportsPage;
