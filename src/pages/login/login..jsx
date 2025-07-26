import styles from "./login.module.css"
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";
function Login() {
    const [pass,setPass]=useState("");
    const [email,setEmail]=useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();




    const checkEmail=async(email)=>{
                const {data,error}= await supabase.from('profiles').select('email').eq("email",email).single()
                    if(error || !data) {
                        return false
                        }
                        return true

                    }
                    const loginn = async () => {
                        setLoading(true);
                        
                        const emailError = document.getElementById("err-mail");
                        const passError = document.getElementById("err-pass");
                        document.getElementById('login-mail').style.border="solid 2px grey";
                        document.getElementById('login-pass').style.border="solid 2px grey";
                        if (emailError) emailError.remove();
                        if (passError) passError.remove();
                      
                        
                        if (!email || !pass) {
                          alert("Please enter both email/phone and password.");
                          setLoading(false);
                          return;
                        }
                      
                        let id = email;
                      
                        
                        if (!isNaN(email)) {  
                          const { data, error } = await supabase
                            .from("profiles")
                            .select("email")
                            .eq("phone", id)
                            .single();
                      
                          if (error || !data) {
                            let par = document.getElementById("imail");
                        let err = document.createElement("p");
                        par.appendChild(err);
                        err.innerHTML="incorrect email or phone number"
                        err.style.color="red";
                        err.id="err-mail";
                        document.getElementById('login-mail').style.border="solid 2px red";
                            setLoading(false);
                            return;
                          }
                          id = data.email; 
                        }

                        const emailExists = await checkEmail(id);
                        if (!emailExists) {
                            let par = document.getElementById("imail");
                            let err = document.createElement("p");
                            par.appendChild(err);
                            err.innerHTML="incorrect email or phone number"
                            err.style.color="red";
                            err.id="err-mail";
                            document.getElementById('login-mail').style.border="solid 2px red";
                                setLoading(false);
                                return;
                        }
                      
                        const { error } = await supabase.auth.signInWithPassword({
                          email: id,
                          password: pass,
                        });
                        
                        if (error) {
                            let par = document.getElementById("passw");
                            let err = document.createElement("p");
                            par.appendChild(err);
                            err.innerHTML = "incorrect password"
                            err.style.color = "red";
                            err.id = "err-pass";
                            document.getElementById('login-pass').style.border = "solid 2px red";
                            setLoading(false);
                        } else {
                            const { data: { session }, error } = await supabase.auth.getSession();
                            if (!error && session?.user?.id) {
                                sessionStorage.setItem("userId", session.user.id);
                            }
                            navigate("/main");
                        }
                        setLoading(false);
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