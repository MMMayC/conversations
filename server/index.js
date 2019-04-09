
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

// const inputFile = require("../data/bladerunner_partial.txt");

// process dialog file
const fs = require('fs'),
      readline = require('readline'),
      instream = fs.createReadStream('./data/bladerunner_partial.txt'),
      outstream = new (require('stream'))(),
      rl = readline.createInterface(instream, outstream);


function processDialog() {
  const characterRegex = new RegExp(/^[A-Z]*$/);
  let characters = [];
  rl.on('line', function (line) {
    if(line && characterRegex.test(line)) {
    } else {
      // currentDialog += ` ${line}`;
    }
  });
  rl.on('close', line => {
    console.log("close");
    fs.readFile('./data/processed_bladerunner_characters.json', function (err, data) {
      if (err){
          console.log(err);
      } else {
        console.log('characters :', characters);
        characters.push({
          characterName: line
        });
        console.log('characters :', characters);
        let charactersJson = JSON.stringify(characters);
        console.log('charactersJson :', charactersJson);
        fs.writeFile('./data/processed_bladerunner_characters.json', charactersJson, function (err) {
          if (err) throw err;
        }); 
      }
    });
  });
}
processDialog();