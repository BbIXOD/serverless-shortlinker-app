import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import db from '../../dbController.js'
import * as validations from '../../validations.js'
import { getMailFromToken } from '../../tokenVerifier.js'
import { badRequest, internalError, success } from '../../codes.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Start create link handler')

    const body = JSON.parse(_event.body)

    const email = getMailFromToken(_event.headers.Authorization)
    

    if (!email ||!validations.validateLink(body.link) //separate email validation
     || !validations.validateAlias(body.alias)) return badRequest

    console.log('User registered && Validations passed')

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

    console.log('Link created')

    return success
  }
  catch (err) {
    console.error(err.message)
    return internalError
  }
}