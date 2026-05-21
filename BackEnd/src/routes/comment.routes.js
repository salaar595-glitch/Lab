const router = require('express').Router();
const controller = require('../controllers/comment.controller');

router.get('/', controller.getAll);
router.get('/post/:id', controller.getByPostId);
router.get('/:id', controller.getOne);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;