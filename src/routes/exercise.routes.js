const { Router } = require('express');
const controller = require('../controllers/exercise.controller');
const { auth,requiresAuth } = require('express-openid-connect')

const router = Router();

router.get('/',requiresAuth(), controller.exercises);

router.get('/view/',requiresAuth(), (req,res)=>{res.redirect('/')});

router.get('/view/:exercisesID',requiresAuth(), controller.viewExercise);

router.get('/create',requiresAuth(), controller.createExercise);

module.exports = router;