const router     = require('express').Router();
const controller = require('../controllers/post.controller');
const checkOwner = require('../middleware/checkOwner.middleware');

router.get('/',     controller.getAll);
router.get('/:id', checkOwner('posts'), controller.getOne);
router.post('/',   controller.create);

router.put('/:id',    checkOwner('posts'), controller.update);
router.delete('/:id', checkOwner('posts'), controller.remove);

module.exports = router;