import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',       // Changed from 'name' to match backend
    email: '',
    password: '',
    tenantSubdomain: '', // Required to know which company to join
    role: 'User'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calls POST /api/auth/register
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Join Workspace</h2>
        <p className="text-sm text-center text-gray-500">Create an account in an existing organization</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Workspace Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Workspace ID (Subdomain)</label>
            <input
              type="text"
              name="tenantSubdomain"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.tenantSubdomain}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">Ask your admin for the workspace subdomain</p>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Tenant Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <div className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}