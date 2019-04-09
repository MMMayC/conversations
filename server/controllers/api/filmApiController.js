const AWS = require('aws-sdk');
const config = require('../../../config/dynamodb.config');
const isDev = process.env.NODE_ENV !== 'production';
const uuidv1 = require('uuid/v1');

module.exports = {
  getFilms: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_film
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
          message: 'Loaded films',
          films: Items
        });
      }
    });
  },
  getFilmById: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const filmId = req.query.id;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_film,
      KeyConditionExpression: 'filmId = :i',
      ExpressionAttributeValues: {
        ':i': filmId
      }
    };
    docClient.query(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else {
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded film',
          film: Items
        });
      }
    });
  },
  
  addFilm: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const { filmTitle, filmYear, DirectorId } = req.body;
    const filmId = uuidv1().toString();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_film,
      Item: {
        filmId: filmId,
        filmTitle: filmTitle,
        filmYear: filmYear,
        DirectorId: DirectorId
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
          message: 'Added film',
          filmId: filmId
        });
      }
    });
  }
}
