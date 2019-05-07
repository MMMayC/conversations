const AWS = require("aws-sdk");
const config = require("../../config/dynamodb.config");
const { connectDB } = require("./connect");

const dialogsScheme = {
  TableName: "dialogs",
  KeySchema: [
    {
      AttributeName: "filmId",
      KeyType: "HASH"
    },
    {
      AttributeName: "dialogId",
      KeyType: "RANGE"
    }
  ],
  AttributeDefinitions: [
    {
      AttributeName: "dialogId",
      AttributeType: "S"
    },
    {
      AttributeName: "filmId",
      AttributeType: "S"
    },
    {
      AttributeName: "film",
      AttributeType: "S"
    }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "films",
      KeySchema: [
        {
          AttributeName: "film",
          KeyType: "HASH"
        },
        {
          AttributeName: "filmId",
          KeyType: "RANGE"
        }
      ],
      Projection: {
        NonKeyAttributes: ["director", "year"],
        ProjectionType: "INCLUDE"
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

exports.createDialogsTable = () => {
  const params = dialogsScheme;
  const docClient = connectDB();
  docClient.createTable(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Created", data);
    }
  });
};
exports.deleteDialogsTable = () => {
  const params = {
    TableName: dialogsScheme.TableName
  };
  const docClient = connectDB();
  docClient.deleteTable(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Deleted", data);
    }
  });
};
