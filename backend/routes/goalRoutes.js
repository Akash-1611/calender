const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.get('/', goalController.getGoals);
router.post('/', goalController.createGoal);
router.get('/:id/tasks', goalController.getTasksByGoal);

module.exports = router;