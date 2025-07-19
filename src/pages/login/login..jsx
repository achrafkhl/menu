import styles from "./login.module.css"
import { useState } from "react";
import { Link } from "react-router-dom";
function Login() {
    const [pass,setPass]=useState("")
    const [email,setEmail]=useState("")
    return(
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
                                    />
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div id="passw"></div>
                                <div className={styles.footer}>
                                    <button id="check-btn" >Login</button>
                                    <Link to="/forget">forget password?</Link>
                                </div>
                                <p>don't have an account? <Link to="/signup"><strong>sign up</strong></Link></p>
                            </div>
                        </div>
                    );
}
export default Login