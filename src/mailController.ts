import { SES } from 'aws-sdk'
import { SERVICE_EMAIL } from './globals.js'

const ses = new SES()

export const sendCode = async (email: string, code: number | string) => {
  const emailParams = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {  //TODO: add html version
          Data: 'Your verification code is: ' + code
        },
      },
      Subject: {
          Data: 'Verify your account'
      }, 
    },
    Source: SERVICE_EMAIL,
  }

  await ses.sendEmail(emailParams).promise()
}

export const sendDeactivationMessage = async (email: string, alias: string) => {
  const emailParams = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Text: {
          Data: `Your link ${alias} has been deactivated.`
        }
      },
      Subject: {
        Data: 'Link deactivated'
      }
    },
    Source: SERVICE_EMAIL
  }

  ses.sendEmail(emailParams)
}