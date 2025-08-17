import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import styles from "./reset.module.css";

function Reset() {
  const [password, setPassword] = useState("");
  const [conf, setConf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const passRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  // Redirect immediately if token is missing
  useEffect(() => {
    if (!token) {
      navigate("/reset-failed");
    }
  }, [token, navigate]);

  // auto-focus first input
  useEffect(() => {
    passRef.current?.focus();
  }, []);

  const handleReset = async () => {
    setError("");

    if (!password || !conf) {
      return setError("Please fill all fields");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    if (password !== conf) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await fetch("http://192.168.1.5:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        setError(data.error || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.c1}></div>
      <div className={styles.c2}></div>
      <div className={styles.c3}></div>
      <div className={styles.c4}></div>
      <div className={styles.c5}></div>

      <div className={styles.conf} id="confirmation">
        <h1>Reset Password</h1>
        <input
          type="password"
          placeholder="New password"
          id="forget-pass"
          ref={passRef}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Confirm password"
          id="forget-conf"
          value={conf}
          onChange={(e) => setConf(e.target.value)}
          disabled={loading}
        />
        {error && <p style={{ color: "red", marginTop: 5 }}>{error}</p>}
        <button
          className={styles.but}
          onClick={handleReset}
          disabled={loading || !password || !conf}
          style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
        >
          {loading ? <FaSpinner className={styles.spinner} /> : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default Reset;
