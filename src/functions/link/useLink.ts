import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { internalError, notFound } from '../../codes.js'
import db from '../../dbController.js'
import { sendDeactivationMessage } from '../../mailController.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {

    console.log('Start get link handler')

    const alias = _event.pathParameters.alias

    console.log('Got alias', alias)

    const link = await db.get({
      TableName: 'links',
      Key: {
        alias
      }
    }).promise()

    if (!link) return notFound
    if (!link.Item.active) return internalError //separate activation error?

    console.log('Got link')

    link.Item.uses++
    if (link.Item.one_time) link.Item.active = false

    await db.put({
      TableName: 'links',
      Item: link.Item,
    }).promise() // maybe we should not await this

    console.log('Updated link')

    sendDeactivationMessage(link.Item.creator, link.Item.alias)

    console.log('Sent deactivation message')

    return {
      statusCode: 200,
      body: JSON.stringify({
        link: link.Item.link
      })
    }
  }
  catch (err) {
    console.error(err.message)
    return internalError
  }
}