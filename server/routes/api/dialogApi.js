const { getDialogs, getDialogById, addDialog} = require('../../controllers/api/dialogApiController')

module.exports = (app) => {
  // Gets all dialogs
  app.get('/api/dialogs', getDialogs);
  // Get a single dialog by id
  app.get('/api/dialog', getDialogById);
  // Add a dialog
  app.post('/api/dialog', addDialog);
};