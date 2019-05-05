const fs = require("fs");
const readline = require("readline");
const stream = require("stream");
const uuidv4 = require("uuid/v4");
const axios = require("axios");
const { getNumOfFilms } = require("../models/films");
const { addDialogsBatch } = require("../models/dialogs");
const sanitiseLine = line => {
  return line.replace(new RegExp(/  /gi), " ").substring(0, line.length - 1);
};
const sanitiseCharacter = character => {
  if (character.indexOf("(") > -1) {
    return character.substring(0, character.indexOf("("));
  }
  return character;
};

exports.processDialogsByFilm = async (filePath, filmInfo) => {
  const filmId = (await getNumOfFilms()) + 100000;
  const instream = fs.createReadStream(filePath);
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  const characterRegex = new RegExp(/^[A-Z '().]*$/);
  let currentCharacter;
  let currentLine = "";
  let currentDialog;
  let prevDialog;
  let dialogs = [];
  let isFirstLine = true;
  rl.on("line", line => {
    if (line) {
      if (characterRegex.test(line)) {
        // when the line is a character
        if (!isFirstLine) {
          currentLine = sanitiseLine(currentLine);
          currentDialog = {
            dialogId: `${filmId}-${uuidv4()}`,
            dialog: currentLine,
            character: currentCharacter,
            filmId: filmId,
            film: filmInfo.title,
            director: filmInfo.director,
            year: filmInfo.year
          };
          if (prevDialog) {
            currentDialog.prevId = prevDialog.dialogId;
            prevDialog.nextId = currentDialog.dialogId;
            dialogs.push(prevDialog);
          }
          prevDialog = currentDialog;
        } else {
          isFirstLine = false;
        }
        currentCharacter = sanitiseCharacter(line);
        currentLine = "";
        console.log("currentCharacter :", currentCharacter);
      } else {
        // when the line is a dialog
        currentLine += `${line} `;
      }
    }
  });
  rl.on("close", () => {
    // push the last line
    currentLine = sanitiseLine(currentLine);
    currentDialog = {
      dialogId: `${filmId}-${uuidv4()}`,
      dialog: currentLine,
      character: currentCharacter,
      filmId: filmId,
      film: filmInfo.title,
      director: filmInfo.director,
      year: filmInfo.year
    };
    if (prevDialog) {
      currentDialog.prevId = prevDialog.dialogId;
      prevDialog.nextId = currentDialog.dialogId;
      dialogs.push(prevDialog);
    }
    dialogs.push(currentDialog);
    console.log("dialogs :", dialogs);
    console.log("finished");
    addDialogsBatch(dialogs);
  });
};
