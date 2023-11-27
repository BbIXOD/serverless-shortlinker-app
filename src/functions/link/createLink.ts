import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import  { SQS } from 'aws-sdk'
import db from '../../dbController.js'
import * as validations from '../../validations.js'
import { getMailFromToken } from '../../tokenVerifier.js'
import { badRequest, internalError, success } from '../../codes.js'
import LinkExpireType from '../../linkExpireType.js'

const ExpireTypeToSeconds = {
  [LinkExpireType.NEVER]: 0,
  [LinkExpireType.ONE_TIME]: 0,
  [LinkExpireType.ONE_DAY]: 86400,
  [LinkExpireType.THREE_DAYS]: 259200,
  [LinkExpireType.ONE_WEEK]: 604800
}

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
        one_time: body.expire === LinkExpireType.ONE_TIME,
      }
    }).promise()

    console.log('Link created')

    if (body.expire !== LinkExpireType.NEVER || body.expire !== LinkExpireType.ONE_TIME) {
      const delaySeconds = ExpireTypeToSeconds[body.expire]
      await linkQuerry(delaySeconds, JSON.stringify({ alias: body.alias }))
      console.log('Link expiration delayed')
    }
    else {
      console.log('No need to delay link expiration')
    }

    return success
  }
  catch (err) {
    console.error(err.message)
    return internalError
  }
}

const linkQuerry = async (delaySeconds: number, body: string) => {
  const sqs = new SQS();

  const params: SQS.Types.SendMessageRequest = {
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: body,
    DelaySeconds: delaySeconds,
  }

  await sqs.sendMessage(params).promise();
}