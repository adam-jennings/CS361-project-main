
const axios = require('axios')

const getOrm = async (req, res) => {
    res.render('onerep', { 'oneRepMax': null })
}

const postOrm = async (req, res) => {
    const { weight, reps } = req.body
    //TODO: VERIFY WEIGHT / REP VALUES


    process.env.ORM_ENDPOINT
    const ormEndpoint = process.env.ORM_ENDPOINT

    const response = await axios.post(ormEndpoint, { 'weight': weight, 'reps': reps });
    const oneRepData = response.data;
    console.log(oneRepData)
    res.render('onerep', { 'oneRepMax': oneRepData.oneRepMax })
}

module.exports = {
    getOrm, postOrm
}