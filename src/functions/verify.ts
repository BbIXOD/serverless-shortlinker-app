import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import db from '../dbController.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(_event.body)

    const user = await db.get({
      TableName: 'pending_users',
      Key: {
        email: body.email
      }
    }).promise()

    if (!user || user.Item.verification_code !== body.verification_code) throw new Error()

    db.delete({
      TableName: 'pending_users',
      Key: {
        email: body.email
      }
    })

    db.put({
      TableName: 'users',
      Item: {
        email: body.email,
        password: user.Item.password
      }
    })

  }
  catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bad request',
      })
    }
  }
}