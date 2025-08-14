import styles from "./home.module.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className={styles.body}>
      {/* Decorative shapes */}
      <div className={styles.c1}></div>
      <div className={styles.c2}></div>
      <div className={styles.c3}></div>
      <div className={styles.c4}></div>
      <div className={styles.c5}></div>

      {/* Modern Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span className={styles.logoIcon}><i className="fas fa-qrcode"></i></span>
          <span className={styles.logoText}>QuickMenu</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/signup" className={styles.navLink}>Sign Up</Link>
        </div>
      </nav>

      {/* Main content card */}
      <div className={styles.mainCard}>
        <div className={styles.title}>Welcome to QuickMenu</div>
        <div className={styles.subtitle}>
          Create, share, and view your restaurant menu easily. Generate a QR code for your menu and let your customers access it instantly!
        </div>
        <div className={styles.qrSection}>
          <div className={styles.qrImage}>
            {/* Placeholder for QR code with brown/grey palette */}
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="90" height="90" rx="16" fill="#f5f5f5"/>
              <rect x="18" y="18" width="18" height="18" rx="4" fill="rgba(107, 47, 63, 1)"/>
              <rect x="54" y="18" width="18" height="18" rx="4" fill="rgba(107, 47, 63, 1)"/>
              <rect x="18" y="54" width="18" height="18" rx="4" fill="rgba(107, 47, 63, 1)"/>
              <rect x="54" y="54" width="18" height="18" rx="4" fill="rgba(107, 47, 63, 1)"/>
              <rect x="36" y="36" width="18" height="18" rx="4" fill="#7C4855"/>
            </svg>
          </div>
          <div className={styles.qrLabel}>Scan to view the menu</div>
        </div>
        <div className={styles.menuPreview}>
          <strong>Menu Preview</strong>
          <div style={{marginTop: '0.5rem', color: 'rgba(107, 47, 63, 1)', fontSize: '1rem'}}>Add your dishes and categories after signing up!</div>
        </div>
      </div>
    </div>
  );
}

export default Home;