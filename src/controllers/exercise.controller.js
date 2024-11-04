const exercises = (req, res)=>{
    res.render('exercises',{data:"test"});
}

const viewExercise = (req, res)=>{
    res.render('exercise',{data:"test"});
}

const createExercise = (req, res)=>{
    res.render('add-exercise',{data:"test"});
}

module.exports = {
    exercises,viewExercise,createExercise
}