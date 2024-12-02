
const axios = require('axios')

const getOrm = async (req, res) => {
    res.render('onerep', { 'oneRepMax': null })
}

const postOrm = async (req, res) => {
    const { weight, reps } = req.body
    //TODO: VERIFY WEIGHT / REP VALUES


    process.env.ORM_ENDPOINT
    const ormEndpoint = process.env.ORM_ENDPOINT
    let oneRepMax = null
    try {
        const response = await axios.post(ormEndpoint, { 'weight': weight, 'reps': reps });
        oneRepMax = response.data.oneRepMax;
        console.log(oneRepMax)
    }
    catch {
        console.error('Could Not Reach ORM service')
    }
    res.render('onerep', { 'oneRepMax': oneRepMax })

}

module.exports = {
    getOrm, postOrm
}