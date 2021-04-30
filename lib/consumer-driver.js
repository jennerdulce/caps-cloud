'use strict';

// HANDLES OBJECTS WITHIN THE SPECIFIED QUEUE
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sns = new AWS.SNS();

console.log('Software up and running..')
// handles items thaat are within this queue
const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/527745140575/packages',
  handleMessage: async (message) => {
    const parseBody = JSON.parse(message.Body);
    const parsedData = JSON.parse(parseBody.Message)
    // To be published
    const params = {
      Message: message.Body,
      TopicArn: parsedData.vendorId
    }
    sns.publish(params).promise()
      .then(data => {
        console.log('===================================')
        console.log(`FOLLOWING ORDER HAS BEEN MADE AND NEEDS TO BE PICKED UP:`)
        console.log(parsedData)
      })
      .catch(console.error);
  }
})

app.start()
