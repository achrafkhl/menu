import styles from "./signup.module.css"
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";


/*async function generateUniqueSlug(name) {
  const baseSlug = name.toLowerCase().replace(/\s+/g, '-');
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from("profiles")
      .select("slug")
      .eq("slug", slug);
    if (error) {
      console.error("Error checking slug uniqueness:", error.message); }
    if (!data || data.length === 0) break; // Unique slug found
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}*/




function Signup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const removeError = (id) => {
    const errorElement = document.getElementById(id);
    if (errorElement) errorElement.remove();
  };

  const showError = (parentId, errorId, message, inputId) => {
    removeError(errorId);
    const parent = document.getElementById(parentId);
    const error = document.createElement("p");
    error.innerText = message;
    error.style.color = "red";
    error.id = errorId;
    parent.appendChild(error);
    document.getElementById(inputId).style.border = "solid 2px red";
  };
  const resetBorders = () => {
    document.getElementById("sign-mail").style.border = "solid 2px grey";
    document.getElementById("sign-tele").style.border = "solid 2px grey";
    document.getElementById("sign-pass").style.border = "solid 2px grey";
  };

  const handleSignUp = async () => {
    setLoading(true);
    resetBorders();
    removeError("err-mail");
    removeError("err-phone");
    removeError("err-pass");

    


    try {
      if (!email || !phone || !pass || !conf || !name || !file) {
        alert("You need to fill all the fields");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("imail", "err-mail", "Enter a valid email address", "sign-mail");
        return;
      }

      if (phone.length !== 10) {
        showError("passw", "err-phone", "Enter a valid phone number", "sign-tele");
        return;
      }

      if (pass.length <= 8 || !/[a-zA-Z]/.test(pass) || !/\d/.test(pass)) {
        showError("tell", "err-pass", "password should contain at least 8 characters , letters(a-b-..) and numbers(1-2-..)", "sign-pass");
        return;
      }
      if (pass !== conf) {
        showError("tell", "err-pass", "Passwords do not match", "sign-pass");
        return;
      }
      
      const users = await fetch("http://192.168.1.5:5000/api/users")
      .then((res) => res.json());

const existingUser = users.find(user => user.email === email || user.phone === phone);
      if (existingUser) {
        if (existingUser.email === email) showError("imail", "err-mail", "Email already registered", "sign-mail");
        if (existingUser.phone === phone) showError("passw", "err-phone", "Phone number already registered", "sign-tele");
        return;
      }
      
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("username", name);
    formData.append("password", pass);  
    formData.append("email", email);
    formData.append("slug", name.toLowerCase().replace(/\s+/g, '-'));
    formData.append("phone", phone);
      fetch("http://192.168.1.5:5000/api/signup", {
        method: "POST",
        body: formData,
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      console.log("user created succesfuly");
      /*
      const { data, error } = await supabase
        .from("profiles")
        .select("email, phone")
        .or(`email.eq.${email},phone.eq.${phone}`);
      if (error) {
        console.log(error.message);
      }
      if (data && data.length > 0) {
        data.forEach(user => {
          if (user.email === email) showError("imail", "err-mail", "Email already registered", "sign-mail");
          if (user.phone === phone) showError("passw", "err-phone", "Phone number already registered", "sign-tele");
        });
        return;
      }

      // Now safe to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: pass,
      });
      if (signUpError) {
        console.log("Signup error:", signUpError.message);
        return;
      }

      // Upload image
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(`public/${fileName}`, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        return;
      }
      const { data: photoData } = supabase.storage.from("avatar").getPublicUrl(`public/${fileName}`);
      const publicUrl = photoData.publicUrl;

      // Insert into profiles
      const userId = signUpData.user?.id;
      const { error: insertError } = await supabase.from("profiles").insert([
        { id: userId, email, phone, name, logo_url: publicUrl, slug },
      ]);

      if (insertError) {
        alert("Error creating account!");
        return;
      }

      alert("Sign-up successful! Check your email for verification.");
      window.location.href = "/login";
*/
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
      <div className={styles.login}>
        <div className={styles.ii} style={{ textAlign: "left", marginLeft: "20px" }}>
          <Link to="/" style={{ cursor: "pointer" }}>
            <i className="fas fa-home" style={{ color: "black" }}></i>
          </Link>
        </div>
        <h1>Sign Up</h1>
        <div className={styles.email}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" id="sign-mail" required disabled={loading} />
          <i className="fa fa-envelope"></i>
        </div>
        <div id="imail"></div>
        <div className={styles.phone}>
          <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" id="sign-tele" required disabled={loading} />
          <i className="fas fa-phone"></i>
        </div>
        <div id="passw"></div>
        <div className={styles.user_name}>
          <input type="text" placeholder="restaurant name" id="sign-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
          <i className="fas fa-user"></i>
        </div>
        <div className={styles.pass}>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Enter your password" id="sign-pass" required disabled={loading} />
          <i className="fas fa-lock"></i>
        </div>
        <div id="tell"></div>
        <div className={styles.conf}>
          <input type="password" value={conf} onChange={(e) => setConf(e.target.value)} placeholder="Confirm password" id="sign-conf" required disabled={loading} />
          <i className="fas fa-lock"></i>
        </div>
        <div className={styles.user_photo}>
          <label className={styles.fileLabel} htmlFor="catphoto">Enter your logo</label>
          <input className={styles.catphoto} id="catphoto" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} disabled={loading} />
          {file && <span className={styles.fileName}>{file.name}</span>}
          <i className="fas fa-utensils fa-3x"></i>
        </div>
        <p>Already have an account? <Link to="/login"><strong className={styles.strong}><span style={loading ? { pointerEvents: 'none', opacity: 0.7 } : {}}>Login</span></strong></Link></p>
        <button onClick={handleSignUp} disabled={loading} style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
          {loading ? (
            <FaSpinner className={styles.spinner} style={{ marginRight: 8, fontSize: '1.2em', verticalAlign: 'middle' }} />
          ) : null}
          Sign Up
        </button>
      </div>
    </div>
  );


  };

export default Signup;
