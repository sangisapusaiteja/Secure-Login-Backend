import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Import supabase client

function Home() {
  const location = useLocation(); // Get the location object
  const userId = location.state?.userId; // Get the userId from the state
  const [userData, setUserData] = useState(null); // State to store fetched user data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(""); // State to track error messages

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("No user data found.");
        setLoading(false);
        return;
      }

      try {
        // Fetch user data by userId from the 'users' table
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single(); // Fetch one row matching the userId

        if (error) {
          throw error;
        }

        setUserData(data); // Set the fetched user data
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError("An error occurred while fetching user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-800 to-black text-white flex justify-center items-center">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-gradient text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Welcome Home
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {/* Display error */}
        {userData ? (
          <>
            <p className="text-purple-400 text-center font-semibold">
              Welcome, {userData.full_name}!
            </p>
            <p className="text-center text-lg mt-2 text-white">
              Role: {userData.role}
            </p>
            <p className="mt-4 text-center text-sm text-gray-300">
              You have {userData.role} access. Manage settings here.
            </p>
            {/* Example of role-based data */}
          </>
        ) : (
          <p className="text-red-500 text-center font-semibold mt-4">
            No user data found. Please log in again.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
