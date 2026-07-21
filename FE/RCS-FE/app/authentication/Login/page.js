'use client';
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", formData);
      console.log("Login successful:", response.data);
      const user = response.data.user || response.data;
      
      setSuccess(true);
      login(user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <div className="header">
        <div className="h-14 bg-emerald-800 display flex flex-row justify-between items-center px-3">
          <Link href="/"><div className="name text-2xl font-bold">KNN Recommendation system</div></Link>
          <div className="options flex flex-row gap-4">
            <Link href="/authentication/Login"><div className="Login">Login</div></Link>
            <Link href="/authentication/SignUp"><div className="SignUp">Sign Up</div></Link>
          </div>
        </div>
      </div>
        <main className="flex items-center justify-center min-h-160 p-4">
        <div className="w-full max-w-md font-gmono border border-gray-300 rounded-lg p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Login successful! Redirecting to dashboard...
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-emerald-800" required/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-emerald-800"required/>
            </div>
            <button type="submit" className="bg-emerald-800 text-white px-6 py-3 rounded-lg w-full font-medium hover:bg-emerald-900 transition-colors">
              Login
            </button>
          </form>
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} KNN Recommendation System. All rights reserved.
      </footer>
    </>
  );
}
