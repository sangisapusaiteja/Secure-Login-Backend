import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import bcrypt from "bcryptjs"; // Import bcryptjs

function Registration() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "User",
  });

  const [message, setMessage] = useState(""); // To store success or error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      // Hash the password before inserting
      const hashedPassword = await bcrypt.hash(formData.password, 10); // Hash password with salt rounds

      // Insert form data into the 'users' table in Supabase
      const { data, error } = await supabase
        .from("users") // Replace with your table name
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            password: hashedPassword, // Store hashed password
            role: formData.role,
          },
        ]);

      if (error) {
        throw error;
      }

      console.log("Registration successful:", data);
      setMessage("Registration Successful! Please login.");
      setFormData({ fullName: "", email: "", password: "", role: "User" }); // Clear the form
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Error during registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">Register</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-purple-900 p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-lg font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-purple-800 text-white border border-purple-700"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-purple-800 text-white border border-purple-700"
              required
              autoComplete="off" // Prevents autofill
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
              autoComplete="new-password" // Ensures new password input is not auto-filled
            />
          </div>

          <div className="mb-6">
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
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Register
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center">
            <p className="text-lg">{message}</p>
          </div>
        )}

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-purple-400">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration;
