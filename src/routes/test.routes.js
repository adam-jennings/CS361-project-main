const { Router } = require('express');
const controller = require('../controllers/test.controller');

const router = Router();

router.get('/', controller.test);

module.exports = router;