const serverless = require("serverless-http");
const express = require("express");
const app = express();
const template = require("./views/template");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// require("./routes")(app);

// Serving static files
app.use("/public", express.static(path.resolve(__dirname, "../public")));

// hide powered by express
app.disable("x-powered-by");
// start the server
app.listen(process.env.PORT || 3000);

// our apps data model
const data = "";

let initialState = {
  isFetching: false,
  apps: data
};

//SSR function import
const ssr = require("./views/server");

// server rendered home page
app.get("/", (req, res) => {
  const { preloadedState, content } = ssr(initialState);
  const response = template(preloadedState, content);
  res.setHeader("Cache-Control", "assets, max-age=604800");
  res.send(response);
});

const { processDialogsByFilm } = require("./controllers/processDialogsByFilm");

// processDialogsByFilm("data/raw/10thingsihateaboutyou_dialog.txt", {
//   title: "10 Things I Hate About You",
//   director: "Gil Junger",
//   year: "1999"
// });
// processDialogsByFilm("data/raw/bladerunner_dialog.txt", {
//   title: "Blade Runner",
//   director: "Ridley Scott",
//   year: "1982"
// });

// const { processDialog } = require("./controllers/processDialog");

// processDialog("data/raw/10thingsihateaboutyou_dialog.txt", "dfsd");

const {
  getDialogs,
  getRandomDialog,
  addDialogsBatch
} = require("./models/dialogs");

// getDialogs();

// getRandomDialog();

// addDialogsBatch([
//   {
//     dialogId: "74af49f8-b0c5-475e-8d91-830c784e33e3",
//     dialog: "Leave it",
//     character: "KAT",
//     filmId: "100000",
//     film: "10 Things I Hate About You",
//     director: "Gil Junger",
//     year: "1999",
//     prevId: "812cc425-e9d7-4ac6-aaa9-e1a84cf44c4d",
//     nextId: "428c0168-6e49-41ca-acdc-37217c7b9df9"
//   }
// ]);

const { getNumOfFilms } = require("./models/films");

// getNumOfFilms().then(console.log);

const { createDialogsTable, deleteDialogsTable } = require("./models/db");

// createDialogsTable();

// deleteDialogsTable();

module.exports.handler = serverless(app);
