import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabase } from "../supabaseClient";
import bcrypt from "bcryptjs"; // Import bcryptjs

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "", // Default empty role value
  });
  const [error, setError] = useState(""); // State for error messages
  const [redirectMessage, setRedirectMessage] = useState(""); // State for redirect message
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      // Check if the email exists in the 'users' table
      const { data, error: queryError } = await supabase
        .from("users")
        .select("*")
        .eq("email", formData.email)
        .eq("role", formData.role) // Add the role validation here
        .single(); // .single() fetches one row, returns null if no match

      if (queryError) {
        throw queryError; // If there's an error with the query, handle it
      }

      if (data) {
        // If user exists, verify the password by comparing hashed password
        const isPasswordCorrect = await bcrypt.compare(
          formData.password,
          data.password
        );
        if (isPasswordCorrect) {
          console.log("Login Successful");
          setRedirectMessage("Redirecting to Home...");
          setTimeout(() => {
            // Pass the user id and role to the Home component via navigate state
            navigate("/Home", {
              state: { userId: data.id, role: formData.role },
            });
          }, 2000); // Redirect after 2 seconds
        } else {
          setError("Incorrect password");
        }
      } else {
        setError("User or role not found. Please register first.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}{" "}
        {/* Display error message */}
        {redirectMessage && (
          <p className="text-green-500 text-center mb-4">{redirectMessage}</p>
        )}{" "}
        {/* Display redirect message */}
        <form
          onSubmit={handleSubmit}
          className="bg-purple-900 p-6 rounded-lg shadow-lg"
          autoComplete="off"
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email" // Corrected name to match state key
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-purple-800 text-white border border-purple-700"
              required
              autoComplete="new-email"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-lg font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-purple-800 text-white border border-purple-700"
              required
              autoComplete="new-password"
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-lg font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-purple-800 text-white border border-purple-700"
            >
              <option value="">Select Role</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
