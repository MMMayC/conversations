const AWS = require("aws-sdk");
const config = require("../../config/dynamodb.config");
const isDev = process.env.NODE_ENV !== "production";

exports.getNumOfFilms = () => {
  if (isDev) {
    AWS.config.update(config.aws_dynamodb_local);
  } else {
    AWS.config.update(config.aws_dynamodb_remote);
  }
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: config.aws_table_dialogs,
    IndexName: config.aws_dialogs_index_films,
    ProjectionExpression: "film, filmId, director"
  };
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        resolve("error: " + err);
      } else {
        resolve(data.Count);
        console.log(data.Count);
      }
    });
  });
};
