import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tenantSubdomain: '' // Required for regular users
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);

      // Save token and user info
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Workspace Field - Critical for Multi-Tenancy */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Workspace
            </label>
            <input
              type="text"
              name="tenantSubdomain"
              placeholder="Enter Subdomain"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.tenantSubdomain}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        {/* --- HERE IS THE LINK YOU WANTED --- */}
        <div className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Register User
          </Link>
          <span className="mx-2">|</span>
          <Link to="/register-tenant" className="font-medium text-blue-600 hover:underline">
            Register Organization
          </Link>
        </div>

      </div>
    </div>
  );
}