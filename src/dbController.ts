import * as aws from 'aws-sdk'
//made this module while tables were in cloud so i needed to pass credentials. posible moving this to each file.

const db = new aws.DynamoDB.DocumentClient();

export default db