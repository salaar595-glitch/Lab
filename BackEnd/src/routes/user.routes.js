const express      = require('express');
const router       = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminOnly      = require('../middleware/adminOnly.middleware');

router.get('/',    userController.getUsers);
router.get('/:id', userController.getUserById);

router.post('/',    authMiddleware, adminOnly, userController.createUser);
router.put('/:id',  authMiddleware, adminOnly, userController.updateUser);
router.delete('/:id', authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;