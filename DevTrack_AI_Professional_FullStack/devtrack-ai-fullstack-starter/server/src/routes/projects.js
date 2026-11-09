import { Router } from 'express';
import auth from '../middleware/auth.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
const router = Router();
router.use(auth);
router.get('/', async (req, res, next) => {
  try { res.json(await Project.find({ owner: req.userId }).sort({ updatedAt: -1 })); }
  catch (error) { next(error); }
});
router.post('/', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name || name.length > 100) return res.status(400).json({ message: 'Project name is required (maximum 100 characters).' });
    const project = await Project.create({ owner: req.userId, name, description: String(req.body.description || '').slice(0, 1000), dueDate: req.body.dueDate || null });
    res.status(201).json(project);
  } catch (error) { next(error); }
});
router.patch('/:id', async (req, res, next) => {
  try {
    const updates = {};
    for (const key of ['name', 'description', 'status', 'dueDate']) if (key in req.body) updates[key] = req.body[key];
    const project = await Project.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, updates, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json(project);
  } catch (error) { next(error); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    await Task.deleteMany({ project: project._id, owner: req.userId });
    res.json({ message: 'Project and its tasks deleted.' });
  } catch (error) { next(error); }
});
export default router;
