import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router";
import { db } from "../../firebase";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import AnimatedRoute from "../../components/animated/Animated";
import { jwtDecode } from "jwt-decode";

function PartyPage() {
  const location = useLocation();
  const partyId = location.state?.selectedParty;

  const [partyDetails, setPartyDetails] = useState({});
  const [provisions, setProvisions] = useState([]);
  const [chipBudget, setChipBudget] = useState(0);

  const fetchPartyDetails = async () => {
    try {
      const docRef = doc(db, "events", partyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPartyDetails({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("No party has been found.");
      }
    } catch (error) {
      console.error("Error fetching party details: ", error);
    }
  };

  const fetchProvisions = async () => {
    try {
      const provisionsRef = collection(db, "events", partyId, "provisions");
      const provisionsSnapshot = await getDocs(provisionsRef);

      const allTypes = [];
      for (const provisionDoc of provisionsSnapshot.docs) {
        const typeRef = collection(provisionDoc.ref, "type");
        const typeSnapshot = await getDocs(typeRef);

        typeSnapshot.docs.forEach((typeDoc) => {
          allTypes.push(typeDoc.data());
        });
      }

      setProvisions(allTypes);
    } catch (error) {
      console.error("Error fetching provisions: ", error);
    }
  };

  const handleChipIn = (price) => {
    setChipBudget((prevBudget) => prevBudget + Number(price));
  };

  const handleJoinIn = async () => {
    const token = localStorage.getItem("Token");
    const decoded = jwtDecode(token);
    const userId = decoded.user_id;
    if (chipBudget >= partyDetails.minimumBudget) {
      try {
        const docRef = doc(db, "events", partyId);
        await updateDoc(docRef, {
          joined: arrayUnion(userId),
        });
        alert("Successfully joined the party!");
        setChipBudget(0);
      } catch (error) {
        console.error("Error joining the party: ", error);
      }
    } else {
      alert("Please add more funds");
    }
  };

  useState(() => {
    fetchPartyDetails();
    fetchProvisions();
  }, [partyId]);

  return (
    <>
      <div className="w-full h-4/10">
        <div className="w-full bg-blue-500 rounded-3xl shadow-lg">
          <div className="w-full h-20 bg-gradient-to-r from-purple-400 to-blue-400 flex flex-col items-center justify-center rounded-t-3xl">
            <h1 className="text-white text-2xl font-bold">
              {partyDetails.name || "Party Title"}
            </h1>
            <h1 className="text-white text-2xl font-bold">
              Hosted by:&nbsp;
              {partyDetails.host || "No host"}
            </h1>
          </div>
          <div className="w-full h-44 flex flex-row bg-white rounded-b-3xl">
            <div className="w-4/5 h-full flex flex-row">
              <div className="w-full p-6 bg-purple-300 text-gray-700">
                <p className="text-lg font-semibold mb-2">
                  {partyDetails.description ||
                    "Party description and minimum budget."}
                </p>
                <p className="text-gray-500 text-sm">
                  Minimum budget: ${partyDetails.minimumBudget || "N/A"}
                </p>
                <p className="text-gray-500 text-sm">
                  Chipped in: ${chipBudget || "N/A"}
                </p>
              </div>
            </div>
            <div className="w-1/5 h-full flex bg-purple-300 justify-center items-center">
              <motion.button
                className="w-28 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.1 }}
                onClick={handleJoinIn}
              >
                Join in!
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-full h-6/10 my-4 flex flex-col items-center">
        <div className="w-9/10 h-9/10 bg-blue-300 rounded-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">Provisions</h2>
          {provisions.length > 0 ? (
            provisions.map((provision, index) => (
              <div
                key={index}
                className="w-full bg-white p-4 mb-3 rounded-lg shadow-md"
              >
                <p className="text-lg font-semibold">{provision.name}</p>
                <p className="text-gray-700">Value: {provision.value}</p>
              </div>
            ))
          ) : (
            <p className="text-white">No provisions available.</p>
          )}
        </div>
      </div> */}
      {provisions.length > 0 ? (
        <div className="w-full flex flex-col h-full mt-8 gap-4">
          {provisions.map((provision, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-full h-24 bg-purple-200 rounded-lg shadow-md"
            >
              <div className="p-4 flex flex-row justify-between">
                <div className="w-4/5 h-full flex flex-col justify-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {provision.name}
                  </p>
                  <p className="text-md text-gray-600">${provision.price}</p>
                </div>
                <div className="w-1/5 h-full">
                  <motion.button
                    className="w-28 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => handleChipIn(provision.price)}
                  >
                    Chip in!
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white text-center mt-4">No provisions available.</p>
      )}
    </>
  );
}

const Party = AnimatedRoute(PartyPage);

export default Party;
