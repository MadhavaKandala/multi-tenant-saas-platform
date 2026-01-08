import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Plus, Folder, Calendar, User, Trash2 } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load projects');
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      toast.success('Project Created!');
      setNewProject({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error('Error creating project');
    }
  };

  const handleDelete = async (e, projectId) => {
    e.preventDefault(); // Stop clicking the card link
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    
    try {
      await api.delete(`/projects/${projectId}`);
      toast.success('Project Deleted');
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage and track your ongoing work</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
        >
          {showForm ? 'Cancel' : <><Plus className="h-5 w-5" /> New Project</>}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-fade-in-down">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Create New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input 
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="e.g. Website Redesign"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Briefly describe the project goals..."
                rows="3"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
              Create Project
            </button>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="group block">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all duration-200 h-full flex flex-col relative">
              
              {/* Card Header with Delete Button */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Folder className="h-6 w-6" />
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${
                    project.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {project.status}
                  </span>
                  <button 
                    onClick={(e) => handleDelete(e, project.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all z-10"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">{project.description}</p>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {project.creator?.fullName || 'Unknown'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {projects.length === 0 && !showForm && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
            <Folder className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="text-gray-500 mt-1">Get started by creating your first project.</p>
        </div>
      )}
    </div>
  );
}