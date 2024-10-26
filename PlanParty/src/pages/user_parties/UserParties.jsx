import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { db } from "../../firebase";
import {
  getDocs,
  query,
  collection,
  where,
  addDoc,
  getDoc,
} from "firebase/firestore";

import AnimatedRoute from "../../components/animated/Animated";
import { jwtDecode } from "jwt-decode";

function UserPartiesPage() {
  const [editingStates, setEditingStates] = useState({});
  const [isEditingParty, setIsEditingParty] = useState(false);
  const [parties, setParties] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const fetchUserParties = async () => {
    const token = localStorage.getItem("Token");
    const decoded = jwtDecode(token);
    const userId = decoded.user_id;
    try {
      const q = query(collection(db, "events"), where("hostId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedParties = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParties(fetchedParties);
    } catch (error) {
      console.error("Error fetching parties: ", error);
    }
  };

  const handleAddChipIns = (partyId) => {
    setEditingStates((prev) => ({
      ...prev,
      [partyId]: {
        isEditing: !prev[partyId]?.isEditing,
        name: prev[partyId]?.name || "",
        price: prev[partyId]?.price || "",
      },
    }));
  };

  const handleCancel = (partyId) => {
    setEditingStates((prev) => ({
      ...prev,
      [partyId]: {
        isEditing: false,
        name: "",
        price: "",
      },
    }));
  };

  const handleConfirm = async (partyId) => {
    const provisionData = {
      name: editingStates[partyId]?.name,
      price: editingStates[partyId]?.price,
    };
    try {
      const provisionsRef = collection(db, `events/${partyId}/provisions`);
      const provisionsSnapshot = await getDocs(provisionsRef);
      const doc = provisionsSnapshot.docs[0];
      console.log(doc.id);
      const typeRef = collection(
        db,
        `events/${partyId}/provisions/${doc.id}/type`
      );

      await addDoc(typeRef, provisionData);

      handleCancel(partyId);
    } catch (error) {
      console.error("Error adding new chip in: ", error);
    }
  };

  useEffect(() => {
    fetchUserParties();
  }, []);

  return (
    <div className="w-full gap-4 my-4 flex flex-col items-center">
      {parties.map((party, index) => (
        <motion.div
          key={party.id}
          className="w-9/10 bg-blue-500 rounded-3xl shadow-lg transform transition-all hover:scale-105"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: [null, 1.02, 1] }}
          transition={{ duration: 0.2, delay: (index + 1) * 0.1 }}
        >
          <div className="w-full h-20 bg-purple-400 flex flex-col items-center justify-center rounded-t-3xl">
            <h1 className="text-white text-2xl font-bold">
              {party.name || "Party Title"}
            </h1>
            <h1 className="text-white text-2xl font-bold">
              Hosted by:&nbsp;
              {party.host || "No host"}
            </h1>
          </div>
          <div className="w-full h-44 flex flex-row bg-white rounded-b-3xl">
            <div className="w-3/5 p-6 bg-purple-300 rounded-bl-3xl text-gray-700">
              <p className="text-lg font-semibold mb-2">
                {party.description || "Party description and minimum budget."}
              </p>
              <p className="text-gray-500 text-sm">
                Minimum budget: {party.minimumBudget || "N/A"}
              </p>
            </div>
            <div className="w-2/5 flex flex-row bg-purple-300 rounded-br-3xl">
              <div className="w-1/2 h-full flex items-center justify-center">
                {!editingStates[party.id]?.isEditing && (
                  <motion.button
                    className="w-28 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => handleAddChipIns(party.id)} // Pass party ID here
                  >
                    Add chip ins
                  </motion.button>
                )}
                {editingStates[party.id]?.isEditing && (
                  <>
                    <motion.button
                      className="w-28 h-12 bg-green-500 mr-4 hover:bg-green-600 text-white font-bold rounded-xl transition duration-300"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.1 }}
                      onClick={() => handleCancel(party.id)} // Pass party ID here
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      className="w-28 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition duration-300"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.1 }}
                      onClick={() => handleConfirm(party.id)} // Pass party ID here
                    >
                      Confirm
                    </motion.button>
                  </>
                )}
              </div>
              <div className="w-1/2 h-full flex">
                {editingStates[party.id]?.isEditing && (
                  <div className="p-4 bg-purple-700 rounded-lg shadow-md w-full max-w-md mx-auto">
                    <div className="mb-4">
                      <label className="block text-sm font-bold mb-2">
                        Product name
                      </label>
                      <input
                        type="text"
                        value={editingStates[party.id]?.name || ""}
                        onChange={(e) =>
                          setEditingStates((prev) => ({
                            ...prev,
                            [party.id]: {
                              ...prev[party.id],
                              name: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold mb-2">
                        Product price
                      </label>
                      <input
                        type="text"
                        value={editingStates[party.id]?.price || ""}
                        onChange={(e) =>
                          setEditingStates((prev) => ({
                            ...prev,
                            [party.id]: {
                              ...prev[party.id],
                              price: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="w-1/2 h-full flex">
                {isEditingParty && (
                  <div className="p-4 bg-purple-700 rounded-lg shadow-md w-full max-w-md mx-auto">
                    <div className="mb-4">
                      <label className="block text-sm font-bold mb-2">
                        Product name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold mb-2">
                        Product price
                      </label>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product price"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const UserParties = AnimatedRoute(UserPartiesPage);

export default UserParties;
