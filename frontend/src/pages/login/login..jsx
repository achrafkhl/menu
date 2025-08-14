import styles from "./login.module.css"
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";

function Login() {
    const [pass,setPass]=useState("");
    const [email,setEmail]=useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const loginn = async () => {
        setLoading(true);

      // Clear previous errors
        const emailError = document.getElementById("err-mail");
        const passError = document.getElementById("err-pass");
        if (emailError) emailError.remove();
        if (passError) passError.remove();
        document.getElementById('login-mail').style.border = "solid 2px grey";
        document.getElementById('login-pass').style.border = "solid 2px grey";

        if (!email || !pass) {
            alert("Please enter both email/phone and password.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: email, password: pass }),
            credentials: 'include' // Send username here
    });

    const data = await res.json();

    if (res.ok) {
      // Login successful - do what you need here (e.g. save token, redirect)
      setLoading(false);
       navigate("/main");
    } else {
      if (data.error === "Invalid username") {
        const par = document.getElementById("imail");
        const err = document.createElement("p");
        err.id = "err-mail";
        err.style.color = "red";
        err.innerText = "Incorrect email or phone number";
        par.appendChild(err);
        document.getElementById('login-mail').style.border = "solid 2px red";
      } else if (data.error === "Invalid password") {
        const par = document.getElementById("passw");
        const err = document.createElement("p");
        err.id = "err-pass";
        err.style.color = "red";
        err.innerText = "Incorrect password";
        par.appendChild(err);
        document.getElementById('login-pass').style.border = "solid 2px red";
      } else {
        alert(data.error || "Login failed");
      }
      setLoading(false);
    }
  } catch (err) {
    alert("Error connecting to server");
    console.log(err)
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
            <div className={styles.login}>
                <div className={styles.ii} style={{ textAlign: "left", color: "black" }}>
                    <Link to="/" style={{ cursor: "pointer" }}>
                        <i className="fas fa-home" style={{ color: "rgb(0, 0, 0)" }}></i>
                    </Link>
                </div>
                <h1>Login</h1>
                <div className={styles.email} id="login-email">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="enter your email"
                        id="login-mail"
                        required
                        disabled={loading}
                    />
                    <i className="fas fa-user"></i>
                </div>
                <div id="imail"></div>
                <div className={`${styles.pass} ${styles.color}`} id="login-password">
                    <input
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="enter your password"
                        id="login-pass"
                        required
                        disabled={loading}
                    />
                    <i className="fas fa-lock"></i>
                </div>
                <div id="passw"></div>
                <div className={styles.footer}>
                    <button id="check-btn" onClick={loginn} disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : { }}>
                        {loading ? (
                            <FaSpinner className={styles.spinner} style={{ marginRight: 8, fontSize: '1.2em', verticalAlign: 'middle' }} />
                        ) : null}
                        Login
                    </button>
                    <Link to="/forget"style={loading ? { pointerEvents: 'none', opacity: 0.7 } : {}}><span >forget password?</span></Link>
                </div>
                <p>don't have an account? <Link to="/signup"><strong className={styles.strong}><span style={loading ? { pointerEvents: 'none', opacity: 0.7 } : {}}>sign up</span></strong></Link></p>
            </div>
        </div>
    );
  }
// End of Login function
export default Login