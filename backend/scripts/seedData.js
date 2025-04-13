require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Goal = require('../models/Goal');
const Task = require('../models/Task');
const Event = require('../models/Event');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB for seeding');
    seedDatabase();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Sample data
const goals = [
  { name: 'Health', color: '#28a745' },
  { name: 'Work', color: '#dc3545' },
  { name: 'Learn', color: '#007bff' },
  { name: 'Personal', color: '#6f42c1' }
];

const getTasks = (goals) => [
  { name: 'Morning jog', goalId: goals[0]._id },
  { name: 'Gym workout', goalId: goals[0]._id },
  { name: 'Meditation', goalId: goals[0]._id },
  { name: 'Team meeting', goalId: goals[1]._id },
  { name: 'Project deadline', goalId: goals[1]._id },
  { name: 'Client call', goalId: goals[1]._id },
  { name: 'AI based agents', goalId: goals[2]._id },
  { name: 'MLE', goalId: goals[2]._id },
  { name: 'DE related', goalId: goals[2]._id },
  { name: 'Basics', goalId: goals[2]._id },
  { name: 'Family dinner', goalId: goals[3]._id },
  { name: 'Read book', goalId: goals[3]._id }
];

const getEvents = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  return [
    {
      title: 'Monday Wake-up',
      category: 'exercise',
      date: today,
      startTime: new Date(today.setHours(7, 0, 0)),
      endTime: new Date(today.setHours(7, 30, 0)),
      color: '#28a745'
    },
    {
      title: 'All-Team Kickoff',
      category: 'work',
      date: today,
      startTime: new Date(today.setHours(9, 0, 0)),
      endTime: new Date(today.setHours(10, 0, 0)),
      color: '#dc3545'
    },
    {
      title: 'Coffee chat',
      category: 'social',
      date: today,
      startTime: new Date(today.setHours(11, 0, 0)),
      endTime: new Date(today.setHours(11, 30, 0)),
      color: '#6c757d'
    },
    {
      title: 'Lunch break',
      category: 'eating',
      date: today,
      startTime: new Date(today.setHours(12, 0, 0)),
      endTime: new Date(today.setHours(13, 0, 0)),
      color: '#fd7e14'
    },
    {
      title: 'Study session',
      category: 'work',
      date: tomorrow,
      startTime: new Date(tomorrow.setHours(14, 0, 0)),
      endTime: new Date(tomorrow.setHours(16, 0, 0)),
      color: '#dc3545'
    }
  ];
};

async function seedDatabase() {
  try {
    // Clear existing data
    await Goal.deleteMany({});
    await Task.deleteMany({});
    await Event.deleteMany({});
    
    // Insert goals
    const insertedGoals = await Goal.insertMany(goals);
    console.log('Goals seeded successfully');
    
    // Insert tasks with reference to inserted goals
    const tasks = getTasks(insertedGoals);
    await Task.insertMany(tasks);
    console.log('Tasks seeded successfully');
    
    // Insert events
    await Event.insertMany(getEvents());
    console.log('Events seeded successfully');
    
    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}