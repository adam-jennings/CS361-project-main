const { name } = require("ejs");
const { MongoClient, ObjectId} = require("mongodb");

const exercises = async (req, res)=>{
    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const database = mongoClient.db('CS361Database')

    const exercises = database.collection('exercises');
    const exercise = await exercises.find()
    const allExercises = await exercise.toArray();

    exercise.close()
    mongoClient.close()

    res.render('exercises',{exercises:allExercises});
}

const viewExercise = async (req, res)=>{
    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const database = mongoClient.db('CS361Database')

    const exercises = database.collection('exercises');
    const exercise = await exercises.findOne(new ObjectId(req.params.exercisesID))

    mongoClient.close()
    res.render('exercise',{exerciseData:exercise});
}

const createExercise = (req, res)=>{
    res.render('add-exercise',{data:"test"});
}

const createExercisePost = async (req, res)=>{
    const mongoClient = new MongoClient(process.env.MONGODB_URI)
    const database = mongoClient.db('CS361Database')
    const exercises = database.collection('exercises');
    let musclesUsed = []
    if (typeof(req.body['muscles-used'])=="string"){
        musclesUsed.push(req.body['muscles-used'])
    }
    else{
        musclesUsed = req.body['muscles-used']
    }

    const newDoc = {
        'name':req.body['exercise-name'],
        'desc':req.body['exercise-desc'],
        'details':req.body['exercise-details'],
        'musclesUsed': musclesUsed
    }
    const exercise = await exercises.insertOne(newDoc)
    res.redirect('/exercises');
}



module.exports = {
    exercises,viewExercise,createExercise,createExercisePost
}