import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup', { username, email, password });
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Your CyberLynX Account</h2>
        <form id="signup-form" className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new-username" className="block text-gray-300 text-sm font-semibold mb-2">Username:</label>
            <input type="text" id="new-username" name="username" placeholder="Choose a username" required
                   className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                   value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="new-email" className="block text-gray-300 text-sm font-semibold mb-2">Email:</label>
            <input type="email" id="new-email" name="email" placeholder="Enter your email address" required
                   className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                   value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-gray-300 text-sm font-semibold mb-2">Password:</label>
            <input type="password" id="new-password" name="password" placeholder="Create a strong password" required
                   className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                   value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-200">
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
