const { Router } = require('express')
const controller = require('../controllers/orm.controller')

const router = Router()

router.get('/', controller.getOrm)

router.post('/', controller.postOrm)

module.exports = router