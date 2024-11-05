const { Router } = require('express')
const controller = require('../controllers/exercise.controller')
const { auth, requiresAuth } = require('express-openid-connect')

const router = Router()

router.get('/', requiresAuth(), controller.exercises)

router.get('/view/', requiresAuth(), (req, res) => { res.redirect('/') })

router.get('/view/:exerciseID', requiresAuth(), controller.viewExercise)

router.get('/delete/:exerciseID', requiresAuth(), controller.deleteExercise)

router.get('/create', requiresAuth(), controller.createExercise)

router.get('/readd', requiresAuth(), controller.readd)

router.post('/create', requiresAuth(), controller.createExercisePost)

module.exports = router