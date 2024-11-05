const { MongoClient, ObjectId } = require("mongodb")

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

    res.render('exercises', {
        'exercises': allExercises,
        'removedData': req.session.removedData,
        'recentRemove': recentRemove
    })
}

const viewExercise = async (req, res) => {

    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const database = mongoClient.db('CS361Database')

    const exercises = database.collection('exercises')
    const exercise = await exercises.findOne(new ObjectId(req.params.exerciseID))
    //console.log(exercise)
    mongoClient.close()
    res.render('exercise', { exerciseData: exercise })
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