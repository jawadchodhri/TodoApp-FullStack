import Todo from '../models/Todo.js';

// @desc    Get all tasks for logged in user (with optional search & filters)
// @route   GET /api/todos
// @access  Private
export const getTodos = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;

    // Base query scoped strictly to current user
    const query = { user: req.user.id };

    // Status filter (all, active, completed)
    if (status === 'active') {
      query.completed = false;
    } else if (status === 'completed') {
      query.completed = true;
    }

    // Priority filter (low, medium, high)
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search keyword in title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Fetch sorted: incomplete first, then by newest
    const todos = await Todo.find(query).sort({ completed: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: todos.length,
      todos,
    });
  } catch (error) {
    console.error('getTodos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
    });
  }
};

// @desc    Create a new task
// @route   POST /api/todos
// @access  Private
export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const todo = await Todo.create({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      category: category || 'General',
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      todo,
    });
  } catch (error) {
    console.error('createTodo error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating task',
    });
  }
};

// @desc    Update task details
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Ensure logged-in user owns the task
    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    const { title, description, priority, category, dueDate } = req.body;

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(priority && { priority }),
        ...(category && { category }),
        ...(dueDate !== undefined && { dueDate }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      todo,
    });
  } catch (error) {
    console.error('updateTodo error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating task',
    });
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Private
export const toggleComplete = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Ownership check
    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${todo.completed ? 'completed' : 'pending'}`,
      todo,
    });
  } catch (error) {
    console.error('toggleComplete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error toggling task status',
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Ownership check
    if (todo.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await todo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('deleteTodo error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting task',
    });
  }
};

// @desc    Get task statistics for summary cards
// @route   GET /api/todos/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const total = await Todo.countDocuments({ user: req.user.id });
    const completed = await Todo.countDocuments({ user: req.user.id, completed: true });
    const pending = total - completed;
    const highPriority = await Todo.countDocuments({
      user: req.user.id,
      completed: false,
      priority: 'high',
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        highPriority,
      },
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
    });
  }
};