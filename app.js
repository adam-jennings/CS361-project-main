const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000

// Set EJS as templating engine
app.set('view engine', 'ejs')

const cors = require('cors')
const path = require('path')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const { auth, requiresAuth } = require('express-openid-connect')

const session = require('express-session')
app.use(session({
  secret: 'session secret',
  resave: false,
  saveUninitialized: true,
}))

const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENTID,
  issuerBaseURL: process.env.AUTH0_ISSUERBASEURL
}
app.use(auth(auth0Config))

// Redirect home based on auth
app.get('/', (req, res) => {
  res.redirect(req.oidc.isAuthenticated() ? '/exercises' : '/login')
})


// Load routes
const exerciseRouter = require('./src/routes/exercise.routes.js')

// Use routes
app.use('/exercises', exerciseRouter)

// Static file hosting
app.use(express.static('public'));

// 404
app.use('*', (req, res) => { res.send("oops") })

app.listen(port, () => {
  console.log(`Server is up at port ${port}`)
})