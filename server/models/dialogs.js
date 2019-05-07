const AWS = require("aws-sdk");
const config = require("../../config/dynamodb.config");
const isDev = process.env.NODE_ENV !== "production";
const uuidv1 = require("uuid/v1");
const { connectDB } = require("./connect");
const uuidv4 = require("uuid/v4");
const fs = require("fs");

module.exports = {
  getDialogs: function() {
    const docClient = connectDB();
    const params = {
      TableName: config.aws_table_dialogs
    };
    docClient.scan(params, function(err, data) {
      if (err) {
        console.log("err :", err);
      } else {
        const { Items } = data;
        console.log("Items :", Items);
        const jsonString = JSON.stringify(Items);
        // fs.writeFile("./data/database.json", jsonString, err => {
        //   if (err) throw err;
        // });
      }
    });
  },
  getRandomDialog: function() {
    const docClient = connectDB();
    // const params = {
    //   ExpressionAttributeValues: {
    //     ":filmId": { S: "100000" },
    //     ":dialogId": { S: "100000-3789c237-4ba1-48e9-b6cc-61a398175274" }
    //   },
    //   KeyConditionExpression: "filmId = :filmId and dialogId > :dialogId",
    //   ProjectionExpression: "filmId, dialogId, dialog",
    //   TableName: config.aws_table_dialogs
    // };
    const random = uuidv4();
    console.log("random :", random);
    const params = {
      TableName: config.aws_table_dialogs,
      KeyConditions: {
        filmId: {
          AttributeValueList: {
            N: 100002
          },
          ComparisonOperator: "EQ"
        },
        dialogId: {
          AttributeValueList: {
            S: random
          },
          ComparisonOperator: "GT"
        }
      },
      Limit: 1,
      ScanIndexForward: false
    };
    docClient.query(params, function(err, data) {
      if (err) {
        console.log("err :", err);
      } else {
        console.log(data);
      }
    });
  },
  getDialogById: function(req, res, next) {
    const dialogId = req.query.id;
    const docClient = connectDB();
    const params = {
      TableName: config.aws_table_dialogs,
      KeyConditionExpression: "dialogId = :i",
      ExpressionAttributeValues: {
        ":i": dialogId
      }
    };
    docClient.query(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: "Error: Server error"
        });
      } else {
        console.log("data", data);
        const { Items } = data;
        res.send({
          success: true,
          message: "Loaded dialog",
          dialog: Items
        });
      }
    });
  },
  addDialogsBatch: function(dialogs) {
    const docClient = connectDB();
    let dialogItems = [];
    dialogs.forEach(dialog => {
      let dialogItem = {};
      Object.keys(dialog).map(key => {
        dialogItem[key] = { S: dialog[key] };
      });
      dialogItems.push({
        PutRequest: {
          Item: dialogItem
        }
      });
    });
    const params = {
      RequestItems: {
        [config.aws_table_dialogs]: dialogItems
      }
    };
    docClient.batchWriteItem(params, function(err, data) {
      if (err) {
        console.log("err: ", err);
      } else {
        console.log("Added dialog batch");
      }
    });
  }
};
