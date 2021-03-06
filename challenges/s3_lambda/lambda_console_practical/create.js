'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime().toString();
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'PrometheonServiceRecords',
    Item: {
      clientId: data.clientId,
      timestamp: timestamp,
      clientName: data.clientName,
      serviceType: data.service,
      serviceId: data.service + '_' + data.clientId + '_' + timestamp,
      cost: data.cost,
    },
  };

  // write the item to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};