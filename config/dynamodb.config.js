module.exports = {
  aws_table_character: "characterTable",
  aws_table_dialog: "dialogTable",
  aws_table_dialogs: "dialogs",
  aws_table_director: "directorTable",
  aws_table_film: "filmTable",
  aws_dialogs_index_films: "films",
  aws_dynamodb_local: {
    region: "local",
    endpoint: "http://localhost:8000"
  },
  aws_dynamodb_remote: {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
  }
};
