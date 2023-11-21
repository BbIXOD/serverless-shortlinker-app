import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import db from '../dbController.js'
import { badRequest, internalError, notFound, success } from '../codes.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(_event.body)

    const user = await db.get({
      TableName: 'pending_users',
      Key: {
        email: body.email
      }
    }).promise()

    if (!user) return notFound
    if (user.Item.verification_code !== body.verification_code) return badRequest

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

    return success
  }
  catch (err) {
    return internalError
  }
}