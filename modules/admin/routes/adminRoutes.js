const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin, ensureLoggedIn } = require('../../../middleware/auth');

router.get('/users', isAdmin, ensureLoggedIn,adminController.getAllUsers);
router.post('/users/:id/role', isAdmin, ensureLoggedIn, adminController.updateUser);

module.exports = router;