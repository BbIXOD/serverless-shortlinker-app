import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { badRequest, internalError, success } from '../../codes.js'
import db from '../../dbController.js'
import { getMailFromToken } from '../../tokenVerifier.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Start deactivate link handler')

    const email = getMailFromToken(_event.headers.Authorization)

    if (!email) return badRequest

    console.log('User authorized, continue')

    const body = JSON.parse(_event.body)

    const link = await db.get({
      TableName: 'links',
      Key: {
        alias: body.alias
      }
    }).promise()

    if (!link) return badRequest

    console.log('Got link')

    link.Item.active = false

    await db.put({
      TableName: 'links',
      Item: link.Item
    }).promise()

    console.log('Deactivated link')

    return success
  }
  catch (err) {
    console.log(err.message)
    return internalError
  }
}