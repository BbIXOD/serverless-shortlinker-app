import * as aws from 'aws-sdk'
import * as globals from './globals.js'

const credentials = ({
  accessKeyId: globals.ACCESS_KEY_ID,
  secretAccessKey: globals.SECRET_ACCES_KEY,
  region: globals.REGION,
})

const db = new aws.DynamoDB.DocumentClient(credentials);

export default db