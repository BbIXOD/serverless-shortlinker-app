import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { verify } from 'jsonwebtoken'
import db from '../../dbController.js'
import * as validations from '../../validations.js'
import * as globals from '../../globals.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(_event.body)
    const token = _event.headers.Authorization.split(' ')[1] //remove bearer prefix

    const verified = {
      success: false,
      decoded: null,
    }

    verify(token, globals.SECRET,  (err: any, decoded: any) => {
      verified.success = !err
      verified.decoded = err ? null : decoded
    })

    if (!verified.success) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Unauthorized',
        })
      }
    }

    if (!validations.validateLink(body.link) || !validations.validateAlias(body.alias)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Bad request',
        })
      }
    }

    db.put({
      TableName: 'links',
      Item: {
        link: body.link,
        alias: body.alias,
        ttl: body.ttl,
        creator: verified.decoded.email,
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Link created',
      })
    }
  }
  catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: err.message
      })
    }
  }
}