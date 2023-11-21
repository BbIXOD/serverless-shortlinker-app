import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { SES } from 'aws-sdk'
import * as bcrypt from 'bcrypt'
import db from '../dbController.js'
import * as validations from '../validations.js'
import { SALT_ROUNDS, SERVICE_EMAIL } from '../globals.js'
import { badRequest, internalError, success } from '../codes.js'

const CODE_LENGTH = 4

const generateVerificationCode = () => {
  return String(Math.floor(Math.random() * 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0')
}

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(_event.body)

    if (!validations.validateEmail(body.email)
      || !validations.validatePassword(body.password)) {
      return badRequest
    }

    const encryptedPassword = bcrypt.hashSync(body.password, Number(SALT_ROUNDS)) //TODO: maybe add separate error handler

    const verificationCode = generateVerificationCode()

    db.put({
      TableName: 'pending_users',
      Item: {
        email: body.email,
        password: encryptedPassword,
        verification_code: verificationCode,
      }
    })

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

    ses.sendEmail(emailParams)
      .promise()
      .catch((err) => {
        console.log(err)
      })
    
    return success //also we can use code 201
  }
  catch (err) {
    return internalError
  }
}