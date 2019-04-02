const { getDirectors, getDirectorById, addDirector} = require('../../controllers/api/directorApiController')

module.exports = (app) => {
  // Gets all directors
  app.get('/api/directors', getDirectors);
  // Get a single director by id
  app.get('/api/director', getDirectorById);
  // Add a director
  app.post('/api/director', addDirector);
};