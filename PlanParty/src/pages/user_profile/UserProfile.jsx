import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { db } from "../../firebase";
import { doc, getDoc, addDoc, collection, setDoc } from "firebase/firestore";

import AnimatedRoute from "../../components/animated/Animated";

function UserProfilePage() {
  const [isAddingParty, setIsAddingParty] = useState(false);
  const [userId, setUserId] = useState(null);
  const [partyName, setPartyName] = useState("");
  const [partyDescription, setPartyDescription] = useState("");
  const [partyEntryFee, setPartyEntryFee] = useState("");

  const [isNameInputVisible, setIsNameInputVisible] = useState(false);
  const [isDescriptionInputVisible, setIsDescriptionInputVisible] =
    useState(false);
  const [isEntryFeeInputVisible, setIsEntryFeeInputVisible] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "",
  });

  const getUserInfo = async () => {
    const token = localStorage.getItem("Token");
    const decoded = jwtDecode(token);
    setUserId(decoded.user_id);
    console.log(decoded.user_id);
    try {
      const docRef = doc(db, "users", decoded.user_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("No user has been found.");
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
    }
  };

  const handleHostClick = () => {
    setIsAddingParty((prevIsAddingParty) => !prevIsAddingParty);
  };

  const handleCancelClick = () => {
    setIsAddingParty(false);
    setIsNameInputVisible(false);
    setIsDescriptionInputVisible(false);
    setIsEntryFeeInputVisible(false);
    setPartyName("");
    setPartyDescription("");
    setPartyEntryFee("");
  };

  const handleCreateParty = async () => {
    console.log(userId);
    if (partyName && partyDescription && partyEntryFee && userId) {
      try {
        const eventRef = await addDoc(collection(db, "events"), {
          name: partyName,
          description: partyDescription,
          host: user.username,
          hostId: userId,
          minimumBudget: partyEntryFee,
          joined: [],
        });

        const provisionsRef = await addDoc(
          collection(db, `events/${eventRef.id}/provisions`),
          {}
        );

        await addDoc(
          collection(
            db,
            `events/${eventRef.id}/provisions/${provisionsRef.id}/type`
          ),
          {}
        );

        handleCancelClick();
      } catch (error) {
        console.error("Error creating new party: ", error);
      }
    } else {
      console.log("Please complete all fields before creating a party.");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full h-full flex flex-row justify-center items-center gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: [null, 1.02, 1] }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="w-1/3 ml-4 h-9/10 bg-tertiary-color rounded-[30px] flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
            transition={{ duration: 0.2, delay: 0.5 }}
            className="w-56 h-56 mt-6 bg-purple-400 rounded-full flex justify-center items-center"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
            transition={{ duration: 0.2, delay: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mt-4">{user.username}</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
            transition={{ duration: 0.2, delay: 0.7 }}
            className="text-center"
          >
            <motion.button
              className="w-28 h-12 bg-purple-800 hover:bg-green-600 text-white font-bold rounded-xl transition duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              onClick={handleHostClick}
            >
              Host a party!
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: [null, 1.02, 1] }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="w-2/3 h-9/10 mr-4 pt-2 bg-tertiary-color rounded-[30px] flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
            transition={{ duration: 0.2, delay: 0.5 }}
            className="w-9/10 h-1/10 my-4 bg-purple-400 rounded-2xl flex items-center justify-between"
          >
            <h1 className="text-2xl font-bold ml-4">
              First name: {user.firstName}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
            transition={{ duration: 0.2, delay: 0.6 }}
            className="w-9/10 h-1/10 my-2 bg-purple-400 rounded-2xl flex items-center justify-between"
          >
            <h1 className="text-2xl font-bold ml-4">
              Last name: {user.lastName}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
            transition={{ duration: 0.2, delay: 0.7 }}
            className="w-9/10 h-1/10 my-4 bg-purple-400 rounded-2xl flex items-center justify-between"
          >
            <h1 className="text-2xl font-bold ml-4">
              Username: {user.username}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
            transition={{ duration: 0.2, delay: 0.8 }}
            className="w-9/10 h-1/10 my-2 bg-purple-400 rounded-2xl flex items-center justify-between"
          >
            <h1 className="text-2xl font-bold ml-4">Email: {user.email}</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
            transition={{ duration: 0.2, delay: 0.9 }}
            className="w-9/10 h-1/10 my-4 bg-purple-400 rounded-2xl flex items-center justify-between"
          >
            <h1 className="text-2xl font-bold ml-4">Role: {user.role}</h1>
          </motion.div>
        </motion.div>
      </div>
      {isAddingParty && (
        <div className="w-full px-4">
          <div className="w-full h-32 rounded-2xl mb-8 p-4 flex flex-row items-center justify-between gap-4 bg-green-300">
            <motion.button
              className="w-64 h-12 bg-purple-800 hover:bg-purple-600 text-white font-bold rounded-xl transition duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              onClick={() => setIsNameInputVisible((prev) => !prev)}
            >
              Add a name!
            </motion.button>
            {isNameInputVisible && (
              <div className="w-64 mt-2">
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Enter party name"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
            )}
            <motion.button
              className="w-64 h-12 bg-purple-800 hover:bg-purple-600 text-white font-bold rounded-xl transition duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              onClick={() => setIsDescriptionInputVisible((prev) => !prev)}
            >
              Add a description!
            </motion.button>
            {isDescriptionInputVisible && (
              <div className="w-64 mt-2">
                <input
                  type="text"
                  value={partyDescription}
                  onChange={(e) => setPartyDescription(e.target.value)}
                  placeholder="Enter party description"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
            )}
            <motion.button
              className="w-64 h-12 bg-purple-800 hover:bg-purple-600 text-white font-bold rounded-xl transition duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              onClick={() => setIsEntryFeeInputVisible((prev) => !prev)}
            >
              Add entry price!
            </motion.button>
            {isEntryFeeInputVisible && (
              <div className="w-64 mt-2">
                <input
                  type="text"
                  value={partyEntryFee}
                  onChange={(e) => setPartyEntryFee(e.target.value)}
                  placeholder="Enter entry fee"
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>
            )}
            <motion.button
              className="w-32 h-12 bg-purple-800 hover:bg-red-600 text-white font-bold rounded-xl transition duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              onClick={handleCancelClick}
            >
              Cancel!
            </motion.button>
            <motion.button
              className="w-32 h-12 bg-purple-800 hover:bg-green-600 text-white font-bold rounded-xl transition duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.1 }}
              onClick={handleCreateParty}
            >
              Host a party!
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

const UserProfile = AnimatedRoute(UserProfilePage);

export default UserProfile;
