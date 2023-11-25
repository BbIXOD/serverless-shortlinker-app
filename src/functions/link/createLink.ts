import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import db from '../../dbController.js'
import * as validations from '../../validations.js'
import { getMailFromToken } from '../../tokenVerifier.js'
import { badRequest, internalError, success } from '../../codes.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(_event.body)

    const email = getMailFromToken(_event.headers.Authorization)
    

    if (!email ||!validations.validateLink(body.link)
     || !validations.validateAlias(body.alias)) return badRequest

    await db.put({
      TableName: 'links',
      Item: {
        link: body.link,
        alias: body.alias,
        creator: email,
        uses: 0,
        active : true,
      }
    }).promise()

    return success
  }
  catch (err) {
    return internalError
  }
}