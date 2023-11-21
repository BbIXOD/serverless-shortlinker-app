import { SQSEvent, SQSHandler } from 'aws-lambda'
import { SES } from 'aws-sdk'
import { SERVICE_EMAIL } from '../../globals.js'
import db from '../../dbController.js'

export const handler: SQSHandler = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      const body = JSON.parse(record.body)

      const link = await db.get({
        TableName: 'links',
        Key: {
          alias: body.alias
        }
      }).promise()

      if (!link) return console.log('link not found')

      link.Item.active = false

      db.put({
        TableName: 'links',
        Item: link.Item
      }).promise()

      const ses = new SES()

      const emailParams = {
        Destination: {
          ToAddresses: [link.Item.creator]
        },
        Message: {
          Body: {
            Text: {
              Data: `Your link ${link.Item.alias} has been deactivated.`
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
  }
  catch (err) {
    console.log(err)
  }
}