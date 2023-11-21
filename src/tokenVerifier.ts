import { verify } from "jsonwebtoken"
import { SECRET } from "./globals.js"

export const getMailFromToken = (token: string) => {
  const parsed = token.split(' ')[1] //remove bearer prefix

    const verified = {
      success: false,
      decoded: null as { email : string },
    }

    verify(parsed, SECRET,  (err: any, decoded: any) => {
      verified.success = !err
      verified.decoded = err ? null : decoded
    })

    if (!verified.success) return null

    return verified.decoded.email
}