import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function RegisterTenant() {
  const [formData, setFormData] = useState({
    tenantName: '',
    subdomain: '',
    adminFullName: '',
    adminEmail: '',
    adminPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calls POST /api/auth/register-tenant
      await api.post('/auth/register-tenant', formData);
      toast.success('Organization registered! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Register Organization</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Organization Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input 
              name="tenantName" 
              required 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
              placeholder="e.g. Acme Inc" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subdomain</label>
            <input 
              name="subdomain" 
              required 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
              placeholder="e.g. acme" 
            />
            <p className="text-xs text-gray-500 mt-1">Your URL will be: acme.saas-platform.com (or similar)</p>
          </div>

          <hr className="my-4" />

          {/* Admin Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Name</label>
            <input 
              name="adminFullName" 
              required 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Email</label>
            <input 
              type="email" 
              name="adminEmail" 
              required 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="adminPassword" 
              required 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          <button type="submit" className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700">
            Register Organization
          </button>
        </form>

        <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
                Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
}