const AWS = require("aws-sdk");
const config = require("../../config/dynamodb.config");
const isDev = process.env.NODE_ENV !== "production";
const uuidv1 = require("uuid/v1");
const { connectDB } = require("./connect");
module.exports = {
  getDialogs: function(req, res, next) {
    const docClient = connectDB();
    const params = {
      TableName: config.aws_table_dialog
    };
    docClient.scan(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: "Error: Server error"
        });
      } else {
        const { Items } = data;
        res.send({
          success: true,
          message: "Loaded dialogs",
          dialogs: Items
        });
      }
    });
  },
  getDialogById: function(req, res, next) {
    const dialogId = req.query.id;
    const docClient = connectDB();
    const params = {
      TableName: config.aws_table_dialog,
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

  addDialog: function(req, res, next) {
    const { line, characterId } = req.body;
    const dialogId = uuidv1().toString();
    const docClient = connectDB();
    const params = {
      TableName: config.aws_table_dialog,
      Item: {
        dialogId: dialogId,
        line: line,
        characterId: characterId
      }
    };
    docClient.put(params, function(err, data) {
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
          message: "Added dialog",
          dialogId: dialogId
        });
      }
    });
  },
  addDialogBatch: function(req, res, next) {
    const dialogs = req.body;
    const docClient = connectDB();
    let dialogItems = [];
    // console.log('dialogs :', dialogs);
    dialogs.forEach(dialog => {
      dialogItems.push({
        PutRequest: {
          Item: dialog
        }
      });
    });
    const params = {
      RequestItems: {
        [config.aws_table_dialog]: dialogItems
      }
    };
    docClient.batchWrite(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: "Error: Server error"
        });
      } else {
        console.log("Added dialog batch");
        res.send({
          success: true,
          message: "Added dialog batch"
        });
      }
    });
  },
  getRandomDialog: function(req, res, next) {
    const docClient = connectDB();
    const randomId = uuidv1().toString();
    const params = {
      TableName: config.aws_table_dialog,
      ProjectionExpression: "#yr, title, info.genres, info.actors[0]",
      KeyConditionExpression:
        "#yr = :yyyy and title between :letter1 and :letter2",
      ExpressionAttributeNames: {
        "#yr": "year"
      },
      ExpressionAttributeValues: {
        ":yyyy": 1992,
        ":letter1": "A",
        ":letter2": "L"
      }
    };
  }
};
