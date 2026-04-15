const router = require('express').Router();
const controller = require('../controllers/user.controller');

router.get('/', controller.getAll);
router.post('/', controller.create);

module.exports = router;