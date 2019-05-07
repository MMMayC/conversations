const AWS = require("aws-sdk");
const config = require("../../config/dynamodb.config");
const isDev = process.env.NODE_ENV === "dev";
module.exports = {
  connectDB: () => {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
      return new AWS.DynamoDB().DocClient();
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
      return new AWS.DynamoDB();
    }
  }
};
