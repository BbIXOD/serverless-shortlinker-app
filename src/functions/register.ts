import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { SES } from 'aws-sdk'
import * as bcrypt from 'bcryptjs'
import db from '../dbController.js'
import * as validations from '../validations.js'
import { SALT_ROUNDS, SERVICE_EMAIL } from '../globals.js'
import { badRequest, internalError, makeError, success } from '../codes.js'

const CODE_LENGTH = 4

const generateVerificationCode = () => {
  return String(Math.floor(Math.random() * 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0')
}

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Start register handler')

    const body = JSON.parse(_event.body)

    if (!validations.validateEmail(body.email)
      || !validations.validatePassword(body.password)) {
      return badRequest
    }

    console.log('Validations passed')

    const pendingUser = await db.get({
      TableName: 'pending_users',
      Key: {
        email: body.email
      }
    }).promise()

    const registeredUser = await db.get({
      TableName: 'users',
      Key: {
        email: body.email
      }
    }).promise()

    if (pendingUser.Item || registeredUser.Item) {
      return badRequest
    }

    console.log('User not found, continue registration')

    const encryptedPassword = bcrypt.hashSync(body.password, Number(SALT_ROUNDS)) //TODO: maybe add separate error handler

    const verificationCode = generateVerificationCode()

    await db.put({
      TableName: 'pending_users',
      Item: {
        email: body.email,
        password: encryptedPassword,
        verification_code: verificationCode,
      }
    }).promise()

    console.log('Created verification code, sending email')

    const ses = new SES()

    const emailParams = {
      Destination: {
        ToAddresses: [body.email],
      },
      Message: {
        Body: {
          Text: {  //TODO: add html version
            Data: 'Your verification code is: ' + verificationCode
          },
        },
        Subject: {
            Data: 'Verify your account'
        }, 
      },
      Source: SERVICE_EMAIL,
    }

    await ses.sendEmail(emailParams).promise()

    console.log('Email sent')
    
    return success //also we can use code 201
  }
  catch (err) {
    console.log(err.message)
    return internalError
  }
}