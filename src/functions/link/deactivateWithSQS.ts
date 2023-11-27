import { SQSEvent, SQSHandler } from 'aws-lambda'
import db from '../../dbController.js'
import { sendDeactivationMessage } from '../../mailController.js'

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

      await db.put({
        TableName: 'links',
        Item: link.Item
      }).promise()

      await sendDeactivationMessage(link.Item.creator, link.Item.link)
    }
  }
  catch (err) {
    console.error(err)
  }
}