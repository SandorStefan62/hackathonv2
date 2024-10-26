import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import AnimatedRoute from "../../components/animated/Animated";

function HomePage() {
  const [selectedParty, setSelectedParty] = useState(null);
  const [parties, setParties] = useState([]);
  const navigate = useNavigate();

  const fetchAllParties = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const fetchedParties = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParties(fetchedParties);
    } catch (error) {
      console.error("Error fetching parties: ", error);
    }
  };

  const handleSelectParty = (partyId) => {
    setSelectedParty(partyId);
    navigate("/Party", { state: { selectedParty: partyId } });
    console.log(partyId);
  };

  useEffect(() => {
    fetchAllParties();
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
            <div className="w-4/5 p-6 bg-purple-300 rounded-bl-3xl text-gray-700">
              <p className="text-lg font-semibold mb-2">
                {party.description || "Party description and minimum budget."}
              </p>
              <p className="text-gray-500 text-sm">
                Minimum budget: {party.minimumBudget || "N/A"}
              </p>
            </div>
            <div className="w-1/5 flex items-center justify-center bg-purple-300 rounded-br-3xl">
              <motion.button
                className="w-28 h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.1 }}
                onClick={() => handleSelectParty(party.id)}
              >
                Join in!
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const Home = AnimatedRoute(HomePage);

export default Home;
