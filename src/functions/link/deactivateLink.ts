import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { badRequest, internalError, success } from '../../codes.js'
import db from '../../dbController.js'
import { getMailFromToken } from '../../tokenVerifier.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const email = getMailFromToken(_event.headers.Authorization)

    if (!email) return badRequest

    const body = JSON.parse(_event.body)

    const link = await db.get({
      TableName: 'links',
      Key: {
        alias: body.alias
      }
    }).promise()

    if (!link) return badRequest

    link.Item.active = false

    await db.put({
      TableName: 'links',
      Item: link.Item
    }).promise()

    return success
  }
  catch (err) {
    return internalError
  }
}