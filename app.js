const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');

const cors = require('cors');
const path = require('path');
app.use(cors());


//Auth0 guide code
const { auth,requiresAuth } = require('express-openid-connect')
const config = {
   authRequired: false,
   auth0Logout: true,
   secret: process.env.AUTH0_SECRET,
   baseURL: 'http://localhost:3000',
   clientID: process.env.AUTH0_CLIENTID,
   issuerBaseURL: process.env.AUTH0_ISSUERBASEURL
 }
 app.use(auth(config));
 app.get('/', (req, res) => {
   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
 });
 app.get('/profile', requiresAuth(), (req, res) => {
   res.send(JSON.stringify(req.oidc.user));
 })
// END Auth0 guide code


app.use(express.static('public'));
app.use(express.json());

//Load routes
const testRoute = require('./src/routes/test.routes.js');

//Use routes
app.use('/test', testRoute); 



//homepage

app.get('/exercises', requiresAuth(), (req, res) => {
   res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});



//404
app.use('*', (req, res) => {res.send("oops")}); 

app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
 });