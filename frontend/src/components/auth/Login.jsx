import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Button } from "@primer/react";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("https://usshwcu6fl.execute-api.ap-south-1.amazonaws.com/login", {
        email,
        password,
      });

      console.log("Login response:", res.data);

      const token = res.data.token;

      const userId =
        res.data.userId ||
        res.data.user?._id ||
        res.data.user?.id ||
        res.data._id;

      if (!userId) {
        console.error("User ID missing from login response:", res.data);
        alert("Login succeeded but user ID was not returned by server.");
        return;
      }

      if (token) {
        localStorage.setItem("token", token);
      }

      localStorage.setItem("userId", userId);

      setCurrentUser(userId);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        console.error("Server response:", err.response.data);

        alert(
          err.response.data?.message ||
          "Invalid email or password"
        );
      } else {
        alert("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img
          className="logo-login"
          src={logo}
          alt="Logo"
        />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <h2>Sign In</h2>
        </div>

        <form className="login-box" onSubmit={handleLogin}>
          <div>
            <label className="label" htmlFor="Email">
              Email address
            </label>

            <input
              autoComplete="email"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="div">
            <label className="label" htmlFor="Password">
              Password
            </label>

            <input
              autoComplete="current-password"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>

        <div className="pass-box">
          <p>
            New to GitHub?{" "}
            <Link to="/signup">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;