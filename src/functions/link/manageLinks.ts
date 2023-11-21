import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { badRequest, internalError } from "../../codes.js";
import db from "../../dbController.js";
import { getMailFromToken } from "../../tokenVerifier.js";

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const email = getMailFromToken(_event.headers.Authorization)

    if (!email) return badRequest

    const links = await db.query({
      TableName: "links",
      KeyConditionExpression: "creator = :email",
      ExpressionAttributeValues: {
        ":creator": email
      }
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({
        links: links.Items
      })
    }
  }
  catch (err) {
    return internalError
  }
}