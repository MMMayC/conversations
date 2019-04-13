const AWS = require("aws-sdk");
const config = require("../../config/dynamodb.config");
const isDev = process.env.NODE_ENV !== "production";
module.exports = {
  connectDB: function() {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    return new AWS.DynamoDB.DocumentClient();
  }
};
