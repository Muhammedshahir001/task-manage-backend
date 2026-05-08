const Task = require('../models/Task');


const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json(tasks);
};


const createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Please add a title');
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    user: req.user.id,
  });

  res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTask);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
