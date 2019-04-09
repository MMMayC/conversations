const AWS = require('aws-sdk');
const config = require('../../../config/dynamodb.config');
const isDev = process.env.NODE_ENV !== 'production';
const uuidv1 = require('uuid/v1');

module.exports = {
  getDialogs: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_dialog
    };
    docClient.scan(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded dialogs',
          dialogs: Items
        });
      }
    });
  },
  getDialogById: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const dialogId = req.query.id;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_dialog,
      KeyConditionExpression: 'dialogId = :i',
      ExpressionAttributeValues: {
        ':i': dialogId
      }
    };
    docClient.query(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded dialog',
          dialog: Items
        });
      }
    });
  },
  
  addDialog: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const { line, characterId } = req.body;
    const dialogId = uuidv1().toString();
    const docClient = new AWS.DynamoDB.DocumentClient();
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
          message: 'Error: Server error'
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Added dialog',
          dialogId: dialogId
        });
      }
    });
  },
  addDialogBatch: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const { line, characterId } = req.body;
    const dialogId = uuidv1().toString();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_dialog,
      Item: {
        dialogId: dialogId,
        line: line,
        characterId: characterId
      }
    };
    docClient.batchWrite(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Added dialog',
          dialogId: dialogId
        });
      }
    });
  }
}
