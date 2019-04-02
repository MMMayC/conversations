const { getCharacters, getCharacterById, addCharacter} = require('../../controllers/api/characterApiController')

module.exports = (app) => {
  // Gets all characters
  app.get('/api/characters', getCharacters);
  // Get a single character by id
  app.get('/api/character', getCharacterById);
  // Add a character
  app.post('/api/character', addCharacter);
};