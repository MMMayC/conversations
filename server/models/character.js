const AWS = require("aws-sdk");
const config = require("../../config/dynamodb.config");
const isDev = process.env.NODE_ENV !== "production";
const uuidv1 = require("uuid/v1");

module.exports = {
  getCharacters: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_character
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
          message: "Loaded characters",
          characters: Items
        });
      }
    });
  },
  getCharacterById: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const characterId = req.query.id;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_character,
      KeyConditionExpression: "characterId = :i",
      ExpressionAttributeValues: {
        ":i": characterId
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
          message: "Loaded character",
          character: Items
        });
      }
    });
  },

  addCharacter: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const { characterName } = req.body;
    const characterId = uuidv1().toString();
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_character,
      Item: {
        characterId: characterId,
        characterName: characterName
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
          message: "Added character",
          characterId: characterId
        });
      }
    });
  },
  addCharacterBatch: function(req, res, next) {
    if (isDev) {
      AWS.config.update(config.aws_dynamodb_local);
    } else {
      AWS.config.update(config.aws_dynamodb_remote);
    }
    const characters = req.body;
    const docClient = new AWS.DynamoDB.DocumentClient();
    let characterItems = [];
    characters.forEach(character => {
      characterItems.push({
        PutRequest: {
          Item: character
        }
      });
    });
    const params = {
      RequestItems: {
        [config.aws_table_character]: characterItems
      }
    };
    docClient.batchWrite(params, function(err, data) {
      if (err) {
        res.send({
          success: false,
          message: "Error: Server error"
        });
      } else {
        console.log("Added character batch");
        res.send({
          success: true,
          message: "Added character batch"
        });
      }
    });
  }
};
