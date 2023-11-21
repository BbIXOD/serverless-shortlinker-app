import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { internalError, notFound } from '../../codes.js'
import db from '../../dbController.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const alias = _event.pathParameters.alias

    const link = await db.get({
      TableName: 'links',
      Key: {
        alias
      }
    }).promise()

    if (!link) return notFound
    if (!link.Item.active) return internalError //separate activation error?

    link.Item.uses++

    await db.put({
      TableName: 'links',
      Item: link.Item,
    }).promise() // maybe we should not await this

    return {
      statusCode: 200,
      body: JSON.stringify({
        link: link.Item.link
      })
    }
  }
  catch (err) {
    return internalError
  }
}