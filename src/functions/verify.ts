import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import db from '../dbController.js'
import { badRequest, internalError, notFound, success } from '../codes.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Start verify handler')
    const body = JSON.parse(_event.body)

    const user = await db.get({
      TableName: 'pendingUsers',
      Key: {
        email: body.email
      }
    }).promise()

    if (!user.Item) return notFound
    if (user.Item.verification_code !== body.verification_code) return badRequest

    console.log('User found, continue verification')

    await db.delete({
      TableName: 'pendingUsers',
      Key: {
        email: body.email
      }
    }).promise()

    console.log('User verified, continue registration')

    await db.put({
      TableName: 'users',
      Item: {
        email: body.email,
        password: user.Item.password
      }
    }).promise()

    console.log('User registered')

    return success
  }
  catch (err) {
    console.error(err.message)
    return internalError
  }
}