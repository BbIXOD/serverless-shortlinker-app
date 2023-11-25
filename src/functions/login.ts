import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import db from '../dbController.js'
import * as globals from '../globals.js'
import { badRequest, internalError, notFound } from '../codes.js'

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Start login handler')

    const body = JSON.parse(_event.body)

    const user = await db.get({
      TableName: 'users',
      Key: {
        email: body.email
      }
    }).promise()

    if (!user) return notFound
    if (!bcrypt.compareSync(body.password, user.Item.password)) return badRequest

    console.log('User found, continue login')

    const token = jwt.sign({
      email: body.email,
      password: body.password
    }, globals.SECRET, {
      expiresIn: globals.TOKEN_TTL
    })

    console.log('Created token, sending')

    return {
      statusCode: 200,
      body: JSON.stringify({
        token
      })
    }
  }
  catch (err) {
    console.log(err.message)
    return internalError
  }
}