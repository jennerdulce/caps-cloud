'use strict';

const chalk = require('chalk')
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const faker = require('faker')
const { Consumer } = require('sqs-consumer');
AWS.config.update({ region: 'us-west-2' });
const sns = new AWS.SNS();


console.log('Software up and running..')

// Creates the package
setInterval(async () => {
  try {
    
    const topic = 'arn:aws:sns:us-west-2:527745140575:pickup'
    const message = {
      vendorName: '===== 1-200-FLOWERS =====',
      orderId: uuid(),
      customer: faker.name.findName(),
      vendorId: `arn:aws:sns:us-west-2:527745140575:flowers-in-transit`
    }
    let stringifiedMessage = JSON.stringify(message, undefined, 2)
    // send message as an object through the params
    const params = {
      Message: stringifiedMessage,
      TopicArn: topic
    }

    sns.publish(params).promise()
      .then(data => {
        console.log('===================================')
        console.log(`FOLLOWING ORDER HAS BEEN ADDED TO THE QUEUE:
    ${chalk.green(JSON.stringify(message, undefined, 2))}`)
      })
  } catch (e) {
    console.error(e);
  }
}, Math.floor(Math.random() * 8000))


// Notifies when packages has been delievered
const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/527745140575/1-200-Flowers',
  handleMessage: async (message) => {
    const parseBody = JSON.parse(message.Body);
    const parsedData = JSON.parse(parseBody.Message)
    console.log('===================================')
    console.log(`
    PACKAGE HAS BEEN DELIEVERED:`)
    console.log(chalk.green(parsedData.Message))
  }
})

app.start()


