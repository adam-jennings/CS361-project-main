const { MongoClient, ObjectId } = require("mongodb")
const axios = require('axios')
const exercises = async (req, res) => {
    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const database = mongoClient.db('CS361Database')

    const exercises = database.collection('exercises')
    const exercise = await exercises.find()
    const allExercises = await exercise.toArray()

    exercise.close()
    mongoClient.close()

    //This is janky, I should do this a better way
    const recentRemove = req.session.recentRemove
    req.session.recentRemove = false

    //https://quote-generator-api-7gw0.onrender.com/

    const response = await axios.get(process.env.QUOTE_ENDPOINT);
    const qouteData = response.data;
    res.render('exercises', {
        'exercises': allExercises,
        'removedData': req.session.removedData,
        'recentRemove': recentRemove,
        'quote': qouteData
    })
}

const viewExercise = async (req, res) => {

    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const database = mongoClient.db('CS361Database')


    let exerciseImageURLs = []
    const exercises = database.collection('exercises')
    const exercise = await exercises.findOne(new ObjectId(req.params.exerciseID))
    try {
        const response = await axios.post(process.env.IMAGESERVICE_ENDPOINT + 'getImage', { 'targeted': exercise.musclesUsed });
        console.log(`Response : ${response.data.imageURLs}`)
        exerciseImageURLs = response.data.imageURLs.map(x=>`${process.env.IMAGESERVICE_ENDPOINT}${x}`)
        
        //console.log(exerciseImageURLs)
    }
    catch {
        console.error('Could Not Reach Image Service')
    }
    console.log(exercise)
    mongoClient.close()

    res.render('exercise', { exerciseData: exercise, exerciseImageURLs: exerciseImageURLs })
}

const createExercise = (req, res) => {
    res.render('add-exercise', { data: "test" })
}

const createExercisePost = async (req, res) => {
    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const database = mongoClient.db('CS361Database')
    const exercises = database.collection('exercises')
    let musclesUsed = []
    if (typeof (req.body['muscles-used']) == "string") {
        musclesUsed.push(req.body['muscles-used'])
    }
    else {
        musclesUsed = req.body['muscles-used']
    }

    const newDoc = {
        'name': req.body['exercise-name'],
        'desc': req.body['exercise-desc'],
        'details': req.body['exercise-details'],
        'musclesUsed': musclesUsed
    }
    const exercise = await exercises.insertOne(newDoc)
    res.redirect('/exercises')
}

const deleteExercise = async (req, res) => {
    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const database = mongoClient.db('CS361Database')
    const exercises = database.collection('exercises')

    req.session.removedData = await exercises.findOne(new ObjectId(req.params.exerciseID))
    delete req.session.removedData._id
    req.session.recentRemove = true
    await exercises.deleteOne({ _id: new ObjectId(req.params.exerciseID) })

    res.redirect('/exercises')
}

const readd = async (req, res) => {
    //console.log(req.session.removedData)
    if (req.session.removedData) {
        const mongoClient = new MongoClient(process.env.MONGODB_URI)
        const database = mongoClient.db('CS361Database')
        const exercises = database.collection('exercises')
        const exercise = await exercises.insertOne(req.session.removedData)
    }
    req.session.recentRemove = false
    req.session.removedData = null
    res.redirect('/exercises')
}


module.exports = {
    exercises, viewExercise, createExercise, createExercisePost, deleteExercise, readd
}