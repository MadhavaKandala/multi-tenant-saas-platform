import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, CheckCircle, Clock, Trash2, Plus } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', status: 'todo' });

  const fetchProjectData = async () => {
    try {
      const projectRes = await api.get(`/projects/${id}`);
      setProject(projectRes.data.data);
      
      // Assuming the backend returns tasks inside the project object or we fetch them separately
      // Adjust this based on your actual API response structure. 
      // If tasks are nested: setTasks(projectRes.data.data.Tasks || []);
      // If separate endpoint:
      const tasksRes = await api.get(`/tasks?projectId=${id}`); 
      setTasks(tasksRes.data.data);
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to load project details');
    }
  };

  useEffect(() => {
  const fetchProjectData = async () => {
    try {
      const projectRes = await api.get(`/projects/${id}`);
      setProject(projectRes.data.data);

      const tasksRes = await api.get(`/projects/${id}/tasks`);
      setTasks(tasksRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load project details');
    }
  };

  fetchProjectData();
}, [id]);


  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      toast.success('Task added');
      setNewTask({ title: '', status: 'todo' });
      setShowTaskForm(false);
      fetchProjectData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task updated');
      fetchProjectData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchProjectData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete task');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="flex items-center text-gray-500 hover:text-indigo-600 transition">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
      </Link>

      {/* Project Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-500">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
            project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {project.status}
          </span>
        </div>
        <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {tasks.filter(t => t.status === 'done').length} / {tasks.length} Tasks Completed
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
          <button 
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm text-sm font-medium"
          >
            {showTaskForm ? 'Cancel' : <><Plus className="h-4 w-4" /> Add Task</>}
          </button>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 animate-fade-in-down">
            <form onSubmit={handleCreateTask} className="flex gap-4">
              <input 
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
              <select 
                className="border border-gray-300 px-4 py-2 rounded-lg outline-none bg-white"
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                Save
              </button>
            </form>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="group bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  task.status === 'done' ? 'bg-green-100 text-green-600' : 
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {task.status === 'done' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <p className={`font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <select 
                  className="text-sm border-none bg-transparent font-medium text-gray-500 focus:ring-0 cursor-pointer hover:text-indigo-600"
                  value={task.status}
                  onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {/* DELETE BUTTON */}
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && !showTaskForm && (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No tasks found for this project.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}