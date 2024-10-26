import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

import Home from "../../assets/home.svg";
import User from "../../assets/user.svg";
import Party from "../../assets/party.svg";
import PowerOff from "../../assets/poweroff.svg";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      console.log("User logged out successfully");
      navigate("/Login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="h-screen fixed z-10">
      <motion.div
        className="flex flex-col h-full w-16 rounded-r-3xl bg-purple-800"
        initial={{ width: 64 }}
        animate={{ width: isOpen ? 256 : 72 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-1/10 w-full">
          <motion.button
            className="relative flex flex-col justify-between items-center w-12 h-12 mt-4 ml-2 rounded-xl bg-purple-600 border-none cursor-pointer focus:outline-none"
            onClick={handleClick}
          >
            <motion.span
              className="block w-4/5 h-1.5 bg-black rounded mt-2"
              animate={isOpen ? { rotate: 45, y: 13 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-4/5 h-1.5 bg-black rounded"
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.1 }}
            />
            <motion.span
              className="block w-4/5 h-1.5 bg-black rounded mb-2"
              animate={isOpen ? { rotate: -45, y: -13 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </div>
        <div className="flex flex-col w-full h-8/10 space-y-4">
          <Link onClick={() => setIsOpen(false)} to="/Home">
            <motion.div
              className="w-9/10 h-16 flex flex-row"
              whileHover={{ x: isOpen ? 32 : 0, scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-full flex items-center justify-center">
                <img src={Home} alt="Home" />
              </div>
              <span
                className={`transition-all duration-200 text-2xl font-bold flex items-center overflow-hidden ${
                  isOpen ? "w-32" : "w-0"
                }`}
              >
                Parties
              </span>
            </motion.div>
          </Link>
          <Link onClick={() => setIsOpen(false)} to="/UserProfile">
            <motion.div
              className="w-9/10 h-16 flex flex-row"
              whileHover={{ x: isOpen ? 32 : 0, scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-full flex items-center justify-center">
                <img src={User} alt="User Profile" />
              </div>
              <span
                className={`transition-all duration-200 text-2xl font-bold flex items-center overflow-hidden ${
                  isOpen ? "w-32" : "w-0"
                }`}
              >
                User Profile
              </span>
            </motion.div>
          </Link>
          <Link onClick={() => setIsOpen(false)} to="/UserParties">
            <motion.div
              className="w-9/10 h-16 flex flex-row"
              whileHover={{ x: isOpen ? 32 : 0, scale: [null, 1.2, 1.1] }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-full flex items-center justify-center">
                <img src={Party} alt="Hosted by you" />
              </div>
              <span
                className={`transition-all duration-200 text-2xl font-bold flex items-center overflow-hidden ${
                  isOpen ? "w-32" : "w-0"
                }`}
              >
                Hosted by you
              </span>
            </motion.div>
          </Link>
        </div>
        <motion.div
          className="w-9/10 h-16 flex flex-row"
          onClick={handleLogOut}
          whileHover={{ x: isOpen ? 32 : 0, scale: [null, 1.2, 1.1] }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-16 h-full">
            <img src={PowerOff} alt="Power Off" />
          </div>
          <span
            className={`transition-all duration-200 text-2xl font-bold flex items-center overflow-hidden ${
              isOpen ? "w-32" : "w-0"
            }`}
          >
            Logout
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Sidebar;
