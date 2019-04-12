const fs = require('fs'),
      readline = require('readline'),
      instream = fs.createReadStream('./data/bladerunner_partial.txt'),
      outstream = new (require('stream'))(),
      rl = readline.createInterface(instream, outstream);
const uuidv1 = require('uuid/v1');
const axios = require('axios');
const filmId = 'df37cff0-59cf-11e9-b811-8596ee4eafbc';

module.exports = {
  processDialog: function() {
    const characterRegex = new RegExp(/^[A-Z '().]*$/);
    let characters = [];
    let lastCharacter = {};
    let prevDialog;
    let currentDialog = {};
    let dialogs = [];
    let currentDialogLine = "";
    let firstLine = true;
    rl.on('line',  line => {
      if(line) { 
        if(characterRegex.test(line)) {
          // when the line is a character
          if(characters.findIndex(x => x.characterName === line) < 0) {
            characters.push({
              characterId: uuidv1().toString(),
              characterName: line,
              filmId: filmId
            });
          }
          // don't push the first line
          if(!firstLine) {
            currentDialog = {
              dialogId: uuidv1().toString(),
              dialog: currentDialogLine,
              characterId: lastCharacter.characterId
            }
            if(prevDialog) {
              currentDialog.prevId = prevDialog.dialogId;
              prevDialog.nextId = currentDialog.dialogId;
              dialogs.push(prevDialog);
            }
            prevDialog = currentDialog;
          } else {
            firstLine = false;
          }
          lastCharacter = characters.find(c => c.characterName === line);
          currentDialogLine = "";
        } else {
          // when the line is a dialog
          currentDialogLine += `${line} `;
        }
      }
    });
    rl.on('close', () => {
      // push the last line
      console.log("finished");

      currentDialog = {
        dialogId: uuidv1().toString(),
        dialog: currentDialogLine,
        characterId: lastCharacter.characterId
      }
      if(prevDialog) {
        currentDialog.prevId = prevDialog.dialogId;
        prevDialog.nextId = currentDialog.dialogId;
        dialogs.push(prevDialog);
      }
      dialogs.push(currentDialog);
      let charactersJson = JSON.stringify(characters);
      axios.post(`${process.env.BASE_URL}/api/characters`, characters)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        // console.log(error);
      });
      fs.writeFile('./data/processed_bladerunner_characters.json', charactersJson, err => {
        if (err) throw err;
      });
      let dialogsJson = JSON.stringify(dialogs);
      axios.post(`${process.env.BASE_URL}/api/dialogs`, dialogs)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
      // fs.writeFile('./data/processed_bladerunner_dialogs.json', dialogsJson, err => {
      //   if (err) throw err;
      // }); 
    });
  }
}