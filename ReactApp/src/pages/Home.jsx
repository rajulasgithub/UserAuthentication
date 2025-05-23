import React, { useState, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'


function Home() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const predefinedEmail = "rajulas@gmail.com";
  const predefinedPassword = "rajulaspass";

  // const linkedInLoginUrl = "http://localhost:4000/auth/linkedin";

  const handleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
     toast.success("successsfully logout");
    localStorage.setItem("user", JSON.stringify(decoded));
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    toast.success("successsfully logout");
    localStorage.removeItem("user");
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
axios.post('https://reactecomapi.onrender.com/auth/login',{email,password}).then((response)=>{
        console.log(response)
    }).catch((erorr)=>{
        console.log(response)
    })
    toast.success("successfully registered")

//  if (email === predefinedEmail && password === predefinedPassword) {
//      toast.success("Successfully logged in");
//       const loggedInUser = { name: "Predefined User", email };
//       setUser(loggedInUser);
//       localStorage.setItem("user", JSON.stringify(loggedInUser));
//       setEmail("");
//       setPassword("");
//     } else {
//       toast.error("Invalid email or password");
//       setLoginError("Invalid email or password");
//     }
    
  };

  return (
    <div>
        <ToastContainer/>
      <div style={styles.container}>
        <h1 style={{ textAlign: "center", marginTop: "5rem", color: "white" }}>
          User Authentication
        </h1>

        {!user ? (
          <>
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => console.log("Login Failed")}
            />

            <a href={linkedInLoginUrl} style={styles.linkedinButton}  >
              Login with LinkedIn
            </a>

            <hr style={{ margin: "2rem 0", borderColor: "white" }} />

            <form onSubmit={handleEmailLogin} style={styles.form}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Login with Email
              </button>
              {loginError && (
                <p style={{ color: "red", marginTop: "0.5rem" }}>{loginError}</p>
              )}
            </form>
          </>
        ) : (
          <div style={styles.profileBox}>
            <img src={user.picture|| "../public/download.jpg"} alt="profile" style={styles.avatar} />
            <h2 >{user.name || user.email}</h2>
            <p>{user.email}</p>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "600px",
    margin: "0 auto",
  },
  profileBox: {
  width: "400px",
  margin: "2rem auto", 
  padding: "1.5rem",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  backgroundColor: "#f9f9f9",
},
  avatar: {
    width: "80px",
    borderRadius: "50%",
    marginBottom: "1rem",
  },
  button: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: "2rem",
  },
  input: {
    padding: "0.5rem",
    marginBottom: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  linkedinButton: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    backgroundColor: "#0077B5", 
    color: "#fff",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "bold",
    marginTop: "1rem",
    cursor: "pointer",
    width:"570px",
    textAlign:"center"
  },
};

export default Home;
