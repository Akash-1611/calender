const Goal = require('../models/Goal');
const Task = require('../models/Task');

// Get all goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const newGoal = new Goal(req.body);
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(400).json({ message: 'Error creating goal', error: error.message });
  }
};

// Get tasks by goal ID
exports.getTasksByGoal = async (req, res) => {
  try {
    const tasks = await Task.find({ goalId: req.params.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};