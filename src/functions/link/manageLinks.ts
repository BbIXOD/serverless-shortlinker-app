import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { badRequest, internalError } from "../../codes.js";
import db from "../../dbController.js";
import { getMailFromToken } from "../../tokenVerifier.js";

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Start get links handler')

    const email = getMailFromToken(_event.headers.Authorization)

    if (!email) return badRequest

    console.log('User authorized, continue')

    const links = await db.scan({
      TableName: "links",
      FilterExpression: "creator = :email",
      ExpressionAttributeValues: {
        ":email": email
      }
    }).promise()

    console.log('Get items')

    return {
      statusCode: 200,
      body: JSON.stringify({
        links: links.Items
      })
    }
  }
  catch (err) {
    console.error(err.message)
    return internalError
  }
}