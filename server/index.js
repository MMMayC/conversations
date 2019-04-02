
const express = require('express');
const app = express();
const template = require('./views/template');
const path = require('path');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./routes')(app);

// Serving static files
app.use('/public', express.static(path.resolve(__dirname, '../public')));

// hide powered by express
app.disable('x-powered-by');
// start the server
app.listen(process.env.PORT || 3000);

// our apps data model
const data = "";

let initialState = {
isFetching: false,
apps: data
}

//SSR function import
const ssr = require('./views/server');

// server rendered home page
app.get('/', (req, res) => {
const { preloadedState, content}  = ssr(initialState)
const response = template(preloadedState, content)
res.setHeader('Cache-Control', 'assets, max-age=604800')
res.send(response);
});