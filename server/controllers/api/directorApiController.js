const AWS = require('aws-sdk');
const config = require('../../../config/dynamodb.config');
const isDev = process.env.NODE_ENV !== 'production';
const uuidv1 = require('uuid/v1');

module.exports = {
  getDirectors: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_director
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
          message: 'Loaded directors',
          directors: Items
        });
      }
    });
  },
  getDirectorById: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const directorId = req.query.id;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_director,
      KeyConditionExpression: 'directorId = :i',
      ExpressionAttributeValues: {
        ':i': directorId
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
          message: 'Loaded director',
          director: Items
        });
      }
    });
  },
  
  addDirector: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const { name } = req.body;
    const directorId = uuidv1().toString();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_director,
      Item: {
        directorId: directorId,
        directorName: name
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
          message: 'Added director',
          directorId: directorId
        });
      }
    });
  }
}
