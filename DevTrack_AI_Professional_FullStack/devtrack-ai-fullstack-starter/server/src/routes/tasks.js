import { Router } from 'express';
import auth from '../middleware/auth.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
const router = Router();
router.use(auth);
router.get('/', async (req, res, next) => {
  try {
    const filter = { owner: req.userId };
    if (req.query.project) filter.project = req.query.project;
    res.json(await Task.find(filter).populate('project', 'name').sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});
router.post('/', async (req, res, next) => {
  try {
    const { project, priority = 'medium', dueDate } = req.body;
    const title = String(req.body.title || '').trim();
    const parent = await Project.findOne({ _id: project, owner: req.userId });
    if (!parent) return res.status(404).json({ message: 'Project not found.' });
    if (!title || title.length > 160) return res.status(400).json({ message: 'Task title is required (maximum 160 characters).' });
    if (!['low', 'medium', 'high'].includes(priority)) return res.status(400).json({ message: 'Invalid task priority.' });
    const task = await Task.create({ owner: req.userId, project, title, description: String(req.body.description || '').slice(0, 1000), priority, dueDate: dueDate || null });
    res.status(201).json(await task.populate('project', 'name'));
  } catch (error) { next(error); }
});
router.patch('/:id', async (req, res, next) => {
  try {
    const updates = {};
    for (const key of ['title', 'description', 'status', 'priority', 'dueDate']) if (key in req.body) updates[key] = req.body[key];
    const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, updates, { new: true, runValidators: true }).populate('project', 'name');
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (error) { next(error); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (error) { next(error); }
});
export default router;
