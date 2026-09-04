import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Tag,
  AlertTriangle,
  Clock,
  ListTodo,
  CheckCheck,
  Edit2,
  X,
  Loader2,
} from 'lucide-react';

const CATEGORIES = ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Education'];
const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { value: 'high', label: 'High', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
];

export default function TodoPanel() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, completed
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [statusFilter, categoryFilter, searchQuery]);

  async function fetchTodos() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const data = await apiRequest(`/todos?${params.toString()}`);
      setTodos(data.todos || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const data = await apiRequest('/todos/stats');
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }

  async function handleCreateTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      await apiRequest('/todos', {
        method: 'POST',
        body: {
          title,
          description,
          priority,
          category,
          dueDate: dueDate || null,
        },
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('General');
      setDueDate('');
      setIsFormExpanded(false);

      await Promise.all([fetchTodos(), fetchStats()]);
    } catch (err) {
      alert(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleComplete(id) {
    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );
      await apiRequest(`/todos/${id}/toggle`, { method: 'PATCH' });
      fetchStats();
    } catch (err) {
      fetchTodos(); // Revert on failure
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setTodos((prev) => prev.filter((t) => t._id !== id));
      await apiRequest(`/todos/${id}`, { method: 'DELETE' });
      fetchStats();
    } catch (err) {
      fetchTodos();
    }
  }

  async function handleUpdateTodo(e) {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      await apiRequest(`/todos/${editingTodo._id}`, {
        method: 'PUT',
        body: {
          title: editingTodo.title,
          description: editingTodo.description,
          priority: editingTodo.priority,
          category: editingTodo.category,
          dueDate: editingTodo.dueDate,
        },
      });
      setEditingTodo(null);
      await Promise.all([fetchTodos(), fetchStats()]);
    } catch (err) {
      alert(err.message || 'Failed to update task');
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 📊 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gray-800/60 border border-gray-700/60 p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-gray-400 font-medium">Total Tasks</div>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-800/60 border border-gray-700/60 p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.pending}</div>
            <div className="text-xs text-gray-400 font-medium">In Progress</div>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-800/60 border border-gray-700/60 p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <div className="text-xs text-gray-400 font-medium">Completed</div>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-800/60 border border-gray-700/60 p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.highPriority}</div>
            <div className="text-xs text-gray-400 font-medium">High Priority</div>
          </div>
        </div>
      </div>

      {/* ✍️ Task Creation Card */}
      <section className="rounded-2xl bg-gray-800 border border-gray-700 p-5 shadow-xl transition-all">
        <form onSubmit={handleCreateTodo} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onFocus={() => setIsFormExpanded(true)}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?..."
              className="flex-1 rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>

          {/* Expandable fields for priority, category, description, and date */}
          {isFormExpanded && (
            <div className="pt-3 border-t border-gray-700/70 space-y-3 animate-fadeIn">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes or description..."
                rows={2}
                className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Priority */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormExpanded(false)}
                  className="text-xs text-gray-400 hover:text-gray-200"
                >
                  Collapse options
                </button>
              </div>
            </div>
          )}
        </form>
      </section>

      {/* 🔍 Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex rounded-xl bg-gray-800/80 p-1 border border-gray-700">
          {['all', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-1 sm:max-w-md">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-xl bg-gray-800/80 border border-gray-700 pl-9 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-gray-800/80 border border-gray-700 px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 📋 Tasks List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : todos.length === 0 ? (
        <div className="rounded-2xl bg-gray-800/30 border border-dashed border-gray-700 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-800 text-gray-500 flex items-center justify-center mx-auto mb-3">
            <CheckCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-300">No tasks found</h3>
          <p className="text-xs text-gray-500 mt-1">
            {searchQuery || categoryFilter !== 'All' || statusFilter !== 'all'
              ? 'Try adjusting your filters or search term'
              : 'You have no tasks right now. Create one above to get started!'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {todos.map((todo) => {
            const priorityBadge = PRIORITIES.find((p) => p.value === todo.priority) || PRIORITIES[1];

            return (
              <li
                key={todo._id}
                className={`group flex items-start justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                  todo.completed
                    ? 'bg-gray-900/40 border-gray-800/80 opacity-60'
                    : 'bg-gray-800/90 hover:bg-gray-800 border-gray-700/80 shadow-sm hover:border-gray-600'
                }`}
              >
                {/* Left: Checkbox & Content */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(todo._id)}
                    className="mt-0.5 text-gray-400 hover:text-blue-400 transition-colors flex-shrink-0"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-sm sm:text-base font-medium block truncate ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-100'
                      }`}
                    >
                      {todo.title}
                    </span>

                    {todo.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {/* Priority */}
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityBadge.color}`}>
                        {priorityBadge.label}
                      </span>

                      {/* Category */}
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-gray-900/60 px-2 py-0.5 rounded-md border border-gray-700/50">
                        <Tag className="w-3 h-3" />
                        {todo.category}
                      </span>

                      {/* Due Date */}
                      {todo.dueDate && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-gray-900/60 px-2 py-0.5 rounded-md border border-gray-700/50">
                          <Calendar className="w-3 h-3" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingTodo(todo)}
                    title="Edit task"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    title="Delete task"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* ✏️ Edit Task Modal */}
      {editingTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Edit Task</h3>
              <button
                onClick={() => setEditingTodo(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTodo} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingTodo.description || ''}
                  onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                  <select
                    value={editingTodo.priority}
                    onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value })}
                    className="w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                  <select
                    value={editingTodo.category}
                    onChange={(e) => setEditingTodo({ ...editingTodo, category: e.target.value })}
                    className="w-full rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
                  className="px-4 py-2 rounded-xl bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}