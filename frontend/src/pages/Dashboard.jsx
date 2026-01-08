import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Folder, CheckCircle, Clock, Plus, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    activeProjects: 0, 
    completedTasks: 0, 
    pendingTasks: 0 
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- SAFE USER PARSING (Prevents White Screen Crash) ---
  let user = { fullName: 'User' };
  try {
    const storedUser = localStorage.getItem('user');
    // Check if data exists and is NOT the string "undefined"
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error(err);
    console.warn("Corrupted user data in Dashboard, using default.");
    // We don't clear storage here to avoid fighting with other components
  }
  // ------------------------------------------------------

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch Projects
        const projectsRes = await api.get('/projects');
        const projects = projectsRes.data.data || [];

        // Simple Stats Calculation
        const activeProjects = projects.filter(p => p.status === 'active').length;
        
        setStats({
          activeProjects,
          completedTasks: 0, 
          pendingTasks: 0    
        });

        setRecentProjects(projects.slice(0, 3)); 
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        // Don't show error if it's just a 401 (auth) issue, let the router handle redirect
        if (err.response && err.response.status !== 401) {
            setError("Failed to load dashboard data.");
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
      Loading Dashboard...
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your workspace today.</p>
        </div>
        <Link 
          to="/projects" 
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
        >
          <Plus className="h-5 w-5" /> New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Folder className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Projects</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeProjects}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Completed Tasks</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.completedTasks}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Tasks</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</h3>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-400" /> Recent Activity
          </h2>
          <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="block group">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-sm group-hover:border-indigo-200 group-hover:text-indigo-600 transition">
                      {project.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">{project.name}</h4>
                      <p className="text-xs text-gray-500">Updated {new Date(project.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                    project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No projects yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}