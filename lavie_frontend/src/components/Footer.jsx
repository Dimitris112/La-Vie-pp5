import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          &copy; 2025 La Vie | Educational project by Dimitris
        </p>
        <div className={styles.socialIcons}>
          <a
            href="https://www.linkedin.com/in/dimitrios-thlivitis/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label="Dimitris Thlivitis LinkedIn Profile"
          >
            <FaLinkedin className={styles.socialIcon} />
          </a>
          <a
            href="https://github.com/Dimitris112/La-Vie-pp5"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label="Dimitris GitHub Profile Repository"
          >
            <FaGithub className={styles.socialIcon} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
