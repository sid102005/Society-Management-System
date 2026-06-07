const Task = require('../models/Task');
const Shift = require('../models/Shift');

// Feature #20: Create task (admin assigns)
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, assignedTo, dueDate, priority } = req.body;

    const task = new Task({
      title,
      description,
      category,
      assignedTo,
      assignedBy: req.user.id,
      dueDate,
      priority
    });

    await task.save();
    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #20: Get daily task checklist
exports.getDailyTaskChecklist = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      assignedTo: req.user.id,
      dueDate: { $gte: today, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    })
      .populate('assignedBy', 'name')
      .sort({ priority: 1, dueDate: 1 });

    const byStatus = {
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };

    res.json({
      date: today.toDateString(),
      tasks,
      summary: byStatus
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature #17: Get assigned tasks
exports.getAssignedTasks = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { assignedTo: req.user.id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const tasks = await Task.find(query)
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, completionNotes } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    if (completionNotes) task.completionNotes = completionNotes;

    if (status === 'completed') {
      task.completedAt = new Date();
    }

    await task.save();
    res.json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedBy', 'name')
      .populate('assignedTo', 'name');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks (admin)
exports.getAllTasks = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const tasks = await Task.find(query)
      .populate('assignedBy', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
