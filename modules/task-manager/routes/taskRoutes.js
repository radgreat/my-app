const express = require('express');
const router = express.Router()
const taskController  = require('../controllers/taskController');
const { isLoggedIn, ensureLoggedIn } = require('../../../middleware/auth');

// function isLoggedIn(req, res, next) {
//   if (req.session.userId) {
//     return next();
//   }
  
//   req.flash('error', 'You must be logged in');
//   res.redirect('/auth');
// }

// router.use(isLoggedIn);

router.get('/read', isLoggedIn, ensureLoggedIn, taskController.getAllTasks);
router.get('/new', isLoggedIn, ensureLoggedIn, taskController.newTaskForm);
router.post('/created', isLoggedIn, ensureLoggedIn, taskController.createTask);
router.get('/edit/:id', isLoggedIn, ensureLoggedIn, taskController.editTaskForm);
router.post('/edit/:id', isLoggedIn, ensureLoggedIn, taskController.updateTask);
router.post('/delete/:id', isLoggedIn, ensureLoggedIn, taskController.deleteTask);

module.exports = router;
