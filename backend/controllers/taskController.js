const Task = require('../models/Task');
const Goal = require('../models/Goal');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('goalId', 'name color');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get tasks by goal
exports.getTasksByGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    
    // Validate that goalId is provided
    if (!goalId) {
      return res.status(400).json({ message: 'Goal ID is required' });
    }
    
    // Check if goal exists
    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Find tasks for this goal
    const tasks = await Task.find({ goalId }).populate('goalId', 'name color');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by goal:', error);
    res.status(500).json({ message: 'Error fetching tasks by goal', error: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    console.log('Creating task with request body:', req.body);
    
    // Enhanced validation for goalId
    if (!req.body.goalId) {
      console.error('Missing goalId in request body');
      return res.status(400).json({ message: 'Goal ID is required' });
    }
    
    // Check goal ID format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.body.goalId)) {
      console.error('Invalid goalId format:', req.body.goalId);
      return res.status(400).json({ message: 'Invalid Goal ID format' });
    }
    
    // Check if goal exists
    const goal = await Goal.findById(req.body.goalId);
    
    if (!goal) {
      console.error('Goal not found with ID:', req.body.goalId);
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    console.log('Found goal:', goal);
    
    const newTask = new Task({
      name: req.body.name,
      goalId: req.body.goalId,
      completed: req.body.completed || false,
      dueDate: req.body.dueDate || null
    });
    
    const savedTask = await newTask.save();
    console.log('Task saved successfully:', savedTask);

    // Populate goal info
    const populatedTask = await Task.findById(savedTask._id).populate('goalId', 'name color');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ 
      message: 'Error creating task', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Fix the TaskGoalPanel component to properly handle task creation
// In TaskGoalPanel.jsx - Modified handleAddTask function
const handleAddTask = (e) => {
  e.preventDefault();
  setTaskCreationStatus('');
  
  if (!newTaskName.trim()) {
    setTaskCreationStatus('Error: Task name cannot be empty');
    return;
  }
  
  if (!selectedGoal) {
    setTaskCreationStatus('Error: No goal selected. Please select a goal first.');
    return;
  }

  // Add debugging log
  console.log('Selected goal:', selectedGoal);
  
  // Create task data object with explicitly defined goalId
  const taskData = {
    name: newTaskName,
    goalId: selectedGoal._id, // Ensure this is correctly defined
    completed: false
  };

  // Log the task data before dispatch
  console.log('Task data to be sent:', taskData);

  setTaskCreationStatus('Creating task...');
  
  dispatch(createTask(taskData))
    .unwrap()
    .then(result => {
      console.log('Task created successfully:', result);
      setNewTaskName('');
      setIsAddingTask(false);
      setTaskCreationStatus('Task created successfully!');
      
      // Refresh the tasks for this goal
      dispatch(fetchTasksByGoal(selectedGoal._id));
    })
    .catch(error => {
      console.error('Failed to create task:', error);
      setTaskCreationStatus(`Error: ${typeof error === 'string' ? error : JSON.stringify(error)}`);
    });
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    // Validate task ID
    if (!req.params.id) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('goalId', 'name color');
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    // Validate task ID
    if (!req.params.id) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
    
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};