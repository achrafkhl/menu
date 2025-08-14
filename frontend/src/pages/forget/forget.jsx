import { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import styles from "./forget.module.css";
import supabase from "../../config/supabaseClient";
function Forget() {
    const [email, setEmail] = useState("");


    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetData = async () => {
            const { data, error } = await supabase.from("profiles").select("*");
            if (error) {
                console.log("There is an error:", error);
                setUser([]);
            }
            if (data) {
                setUser(data);
            }
        };
        fetData();
    }, []);

    const forgett = async () => {
            const used = user.find((user) => user.email?.toLowerCase() === email.toLowerCase());
            if (!used) {
                document.getElementById("imail").innerHTML = "<p style='color:red;'>No account found with this email.</p>";
                return;
            }

            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset`,
            });

            if (error) {
                alert("Error sending reset email: " + error.message);
            }
            if (data) {
                localStorage.setItem("userEmail", email);
                alert("Check your email for the password reset link.");
                navigate("/login");
            }
        
    };




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
                                id="forget-email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div id="imail"></div>
                        </div>
                    <div className={styles.actions}>
  <button className={styles.but} onClick={forgett}>Enter</button>
  <Link to="/login" className={styles.back}>Back to login</Link>
</div>
                </div>
            </div>
        </div>
    );
}

export default Forget;
