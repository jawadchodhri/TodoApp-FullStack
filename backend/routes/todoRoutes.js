import express from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleComplete,
  deleteTodo,
  getStats,
} from '../controllers/todoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All todo routes require authentication
router.use(protect);

router.route('/').get(getTodos).post(createTodo);

router.get('/stats', getStats);

router.route('/:id').put(updateTodo).delete(deleteTodo);

router.patch('/:id/toggle', toggleComplete);

export default router;