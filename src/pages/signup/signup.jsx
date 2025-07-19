import styles from "./signup.module.css"
import { Link } from "react-router-dom";
import { useState } from "react";
function Signup() {
    const [pass,setPass]=useState("")
    const [email,setEmail]=useState("")
    const [phone,setPhone]=useState("")
    const [conf,setConf]=useState("")
    return (
    <div className={styles.body}>
      <div className={styles.c1}></div>
      <div className={styles.c2}></div>
      <div className={styles.c3}></div>
      <div className={styles.c4}></div>
      <div className={styles.c5}></div>
  
        <div className={styles.login}>
          <div className={styles.ii} style={{ textAlign: "left", marginLeft: "20px" }}>
            <Link to="/code" style={{ cursor: "pointer" }}>
              <i className="fas fa-home" style={{ color: "black" }}></i>
            </Link>
          </div>
          <h1>Sign Up</h1>
  
          <div className={styles.email}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" id="sign-mail" required />
            <i className="fa fa-envelope"></i>
          </div>
          <div id="imail"></div>
  
          <div className={styles.phone}>
            <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" id="sign-tele" required />
            <i className="fas fa-phone"></i>
          </div>
          <div id="passw"></div>
  
          <div className={styles.pass}>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Enter your password" id="sign-pass" required />
            <i className="fas fa-lock"></i>
          </div>
          <div id="tell"></div>
  
          <div className={styles.conf}>
            <input type="password" value={conf} onChange={(e) => setConf(e.target.value)} placeholder="Confirm password" id="sign-conf" required />
            <i className="fas fa-lock"></i>
          </div>
  
          <div className={styles.footer}>
            <button >Continue</button>
          </div>
  
          <p>Already have an account? <Link to="/login"><strong>Login</strong></Link></p>
        </div>

    </div>
  );
  
}

export default Signup;
