import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../../firebase";
import { db } from "../../firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

import User from "../../assets/user.svg";
import Letter from "../../assets/letter.svg";
import Lock from "../../assets/lock.svg";

function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState("Sign Up");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === "Sign Up") {
      handleSignUp(e);
    } else {
      handleLogin(e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (identifier.includes("@")) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          identifier,
          password
        );

        if (userCredential.user.emailVerified) {
          const token = await userCredential.user.getIdToken();
          localStorage.setItem("Token", token);
          clearFields();
          navigate("/Home");
        } else {
          alert("Login failed: email has not been verified.");
        }
      } else {
        const q = query(
          collection(db, "users"),
          where("username", "==", identifier)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("Username not found.");
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const email = userDoc.data().email;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (userCredential.user.emailVerified) {
          const token = await userCredential.user.getIdToken();
          localStorage.setItem("Token", token);
          clearFields();
          navigate("/Home");
        } else {
          alert("Login failed: email has not been verified.");
        }
      }
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("No account found with this email.");
          break;
        case "auth/invalid-credential":
          alert("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format. Please check your input.");
          break;
        case "auth/too-many-requests":
          alert(
            "Too many unsuccessful login attempts. Please try again later."
          );
          break;
        default:
          alert("Error signing in. Please try again.");
          console.error(error);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        role: "user",
        firstName: "",
        lastName: "",
      });

      alert("Signed up successfully!");
      clearFields();
      setAction("Login");
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          console.error("Error: This email is already in use.");
          alert(
            "The email address is already in use. Please use a different email or log in."
          );
          break;

        case "auth/invalid-email":
          console.error("Error: Invalid email format.");
          alert(
            "The email address format is invalid. Please enter a valid email."
          );
          break;

        case "auth/weak-password":
          console.error("Error: Weak password.");
          alert(
            "The password is too weak. Please use a stronger password with at least 6 characters."
          );
          break;

        default:
          console.error("Error signing up: ", error);
          alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Reset password email has been sent.");
      setShowResetPassword(false);
    } catch (error) {
      console.error("Error resetting password: ", error);
      alert("Failed to send password reset email.");
    }
  };

  const clearFields = () => {
    setUsername("");
    setEmail("");
    setIdentifier("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-128 m-auto pb-8 rounded-3xl bg-purple-800"
      >
        <motion.div
          initial={{ height: action === "Sign Up" ? "32rem" : "28rem" }}
          animate={{ height: action === "Sign Up" ? "32rem" : "28rem" }}
          transition={{ duration: 0.1 }}
          className="flex flex-col"
        >
          <div className="flex flex-col items-center gap-2.5 w-full mt-8">
            <motion.h1
              key={action}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="text-5xl font-bold"
            >
              {action}
            </motion.h1>
            <div className="w-16 h-1.5 bg-white rounded-xl"></div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {action === "Sign Up" ? (
                <>
                  <motion.div
                    className="flex flex-row items-center bg-purple-700 w-80 h-16 rounded-md"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    key="signup-username"
                  >
                    <img className="w-8 my-0 mx-3" src={User} alt="User" />
                    <input
                      className="w-64 h-6 bg-transparent border-none outline-none"
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </motion.div>
                  <motion.div
                    className="flex flex-row items-center bg-purple-700 w-80 h-16 rounded-md"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    key="signup-email"
                  >
                    <img className="w-8 my-0 mx-3" src={Letter} alt="Email" />
                    <input
                      className="w-64 h-6 bg-transparent border-none outline-none"
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </motion.div>
                  <motion.div
                    className="flex flex-row items-center bg-purple-700 w-80 h-16 rounded-md"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    key="signup-password"
                  >
                    <img className="w-8 my-0 mx-3" src={Lock} alt="Password" />
                    <input
                      className="w-64 h-6 bg-transparent border-none outline-none"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    className="flex flex-row items-center bg-purple-700 w-80 h-16 rounded-md"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    key="login-username"
                  >
                    <img className="w-8 my-0 mx-3" src={User} alt="User" />
                    <input
                      className="w-64 h-6 bg-transparent border-none outline-none"
                      type="text"
                      placeholder="Enter username or email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </motion.div>
                  <motion.div
                    className="flex flex-row items-center bg-purple-700 w-80 h-16 rounded-md"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    key="login-password"
                  >
                    <img className="w-8 my-0 mx-3" src={Lock} alt="Password" />
                    <input
                      className="w-64 h-6 bg-transparent border-none outline-none"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          {action === "Login" && (
            <div
              className="w-80 mt-1.5 ml-24 text-xl text-right cursor-pointer"
              onClick={() => setShowResetPassword(true)}
            >
              Forgot Password?
            </div>
          )}
          <div className="flex flex-col items-center pt-4">
            <div className="flex gap-8 my-3.5 mx-auto">
              <motion.button
                className={`flex justify-center items-center w-40 h-12 rounded-3xl text-2xl font-bold pb-1 ${
                  action === "Login" ? "bg-purple-800" : "bg-purple-300"
                }`}
                whileHover={{ scale: [null, 1.3, 1.2] }}
                transition={{ duration: 0.2 }}
                type="button"
                onClick={() => {
                  setAction("Sign Up");
                  clearFields();
                }}
              >
                Register
              </motion.button>
              <motion.button
                className={`flex justify-center items-center w-40 h-12 rounded-3xl text-2xl font-bold pb-1 ${
                  action === "Login" ? "bg-purple-300" : "bg-purple-800"
                }`}
                whileHover={{ scale: [null, 1.3, 1.2] }}
                transition={{ duration: 0.2 }}
                type="button"
                onClick={() => {
                  setAction("Login");
                  clearFields();
                }}
              >
                Login
              </motion.button>
            </div>
            <button type="submit"></button>
          </div>
        </motion.div>
      </form>
      <AnimatePresence>
        {showResetPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ opacity: 0.1, scale: 0.95 }}
              animate={{ opacity: 1, scale: [null, 1.02, 1] }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-108 bg-primary-color p-4 rounded-2xl"
            >
              <h2 className="text-2xl mb-4">Change password</h2>
              <form
                className="flex flex-col items-center"
                onSubmit={handleResetPassword}
              >
                <motion.div
                  className="flex flex-row items-center bg-red-300 w-80 h-16 rounded-md"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                  key="reset-password"
                >
                  <div className="flex flex-row items-center bg-red-300 w-80 h-16 rounded-md">
                    <img className="w-8 my-0 mx-3" src={Letter} alt="Email" />
                    <input
                      className="w-64 h-6 bg-transparent border-none outline-none"
                      type="email"
                      placeholder="Enter email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
                <div className="flex justify-between w-9/10 mt-4">
                  <motion.button
                    type="submit"
                    className="flex justify-center items-center w-32 h-12 bg-secondary-color rounded-3xl text-white font-bold text-sm"
                    whileHover={{ scale: [null, 1.2, 1.1] }}
                    transition={{ duration: 0.2 }}
                  >
                    Send reset email
                  </motion.button>
                  <motion.button
                    type="button"
                    className="flex justify-center items-center w-24 h-12 bg-tertiary-color rounded-3xl text-white font-bold text-sm"
                    whileHover={{ scale: [null, 1.2, 1.1] }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setShowResetPassword(false)}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
