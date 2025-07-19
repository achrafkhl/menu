import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./forget.module.css";

function Forget() {
    const [email, setEmail] = useState("");

    return (
        <div className={styles.body}>
            <div className={styles.c1}></div>
            <div className={styles.c2}></div>
            <div className={styles.c3}></div>
            <div className={styles.c4}></div>
            <div className={styles.c5}></div>
            <div className={styles.container} id="container">
                <h1>Update password</h1>
                <div className={styles.up}>

                </div>
                <div className={styles.all}>

                        <div className={styles.email}>
                            <p>We will send you an email with instructions on how to reset your password.</p>
                            <input
                                type="email"
                                id="mail"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div id="imail"></div>
                        </div>
                    <button className={styles.but} >Enter</button>
                    <Link to="/login" className={styles.back}>Back to login</Link>
                </div>
            </div>
        </div>
    );
}

export default Forget;
