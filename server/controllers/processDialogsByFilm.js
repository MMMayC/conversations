const fs = require("fs");
const readline = require("readline");
const stream = require("stream");
const uuidv4 = require("uuid/v4");
const axios = require("axios");
const { getNumOfFilms } = require("../models/films");
const { addDialogsBatch } = require("../models/dialogs");
const parenthesisRegex = new RegExp(/(?=\().+?(?<=\))/g);
const spacesRegex = new RegExp(/[ ]{2,}/g);
const spaceRegex = new RegExp(/[ ]{1,}/g);
const sanitiseLine = line => {
  // remove all the content in parenthesis
  line = line.replace(parenthesisRegex, "");
  // replace more than 1 space with just 1 space
  line = line.replace(spacesRegex, " ");
  return line;
};
const sanitiseCharacter = character => {
  // remove all the content in parenthesis
  character = character.replace(parenthesisRegex, "");
  character = character.replace(spaceRegex, "");
  return character;
};

exports.processDialogsByFilm = async (filePath, filmInfo) => {
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
            dialogId: `${filmInfo.id}-${uuidv4()}`,
            dialog: currentLine ? currentLine : "null",
            character: currentCharacter ? currentCharacter : "n/a",
            filmId: filmInfo.id,
            film: filmInfo.title,
            director: filmInfo.director,
            year: filmInfo.year
          };
          if (prevDialog) {
            currentDialog.prevId = prevDialog.dialogId;
            prevDialog.nextId = currentDialog.dialogId;
            dialogs.push(prevDialog);
            if (dialogs.length > 20) {
              addDialogsBatch(dialogs);
              dialogs = [];
            }
          }
          prevDialog = currentDialog;
        } else {
          isFirstLine = false;
        }
        currentCharacter = sanitiseCharacter(line);
        currentLine = "";
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
      dialogId: `${filmInfo.id}-${uuidv4()}`,
      dialog: currentLine,
      character: currentCharacter,
      filmId: filmInfo.id,
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
    // console.log("dialogs :", dialogs);
    console.log("finished");
    addDialogsBatch(dialogs);
    // const dialogsJson = JSON.stringify(dialogs);
    // fs.writeFile("./data/processed_file.json", dialogsJson, err => {
    //   if (err) throw err;
    // });
  });
};
