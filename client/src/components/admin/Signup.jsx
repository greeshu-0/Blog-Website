import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { axios, setToken } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/signup", {
        name,
        email,
        password,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = data.token;
        toast.success("Signup successful!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="w-full py-6 text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Create</span> Account
          </h1>
          <p className="font-light">Join now to access your admin dashboard</p>
        </div>
        <form onSubmit={handleSignup} className="mt-6 text-gray-600">
          <div className="flex flex-col">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
              className="border-b-2 border-gray-300 p-2 outline-none mb-6"
            />
          </div>
          <div className="flex flex-col">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Your Email"
              className="border-b-2 border-gray-300 p-2 outline-none mb-6"
            />
          </div>
          <div className="flex flex-col">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Create a Password"
              className="border-b-2 border-gray-300 p-2 outline-none mb-6"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-medium bg-primary text-white rounded hover:bg-primary/90 transition-all"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
