const fs = require("fs");
const readline = require("readline");
const stream = require("stream");
const uuidv1 = require("uuid/v1");
const axios = require("axios");
const { getNumOfFilms } = require("../models/films");

exports.processDialogsByFilm = async filePath => {
  const instream = fs.createReadStream(filePath);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  const characterRegex = new RegExp(/^[A-Z '().]*$/);
  const filmId = await getNumOfFilms();

  console.log("filmId :", filmId);
  rl.on("line", line => {
    if (line) {
      if (characterRegex.test(line)) {
        // when the line is a character
      } else {
        // when the line is a dialog
      }
    }
  });
  rl.on("close", () => {
    // push the last line
  });
};
