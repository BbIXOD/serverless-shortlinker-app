export const success = {
  statusCode: 200,
  body: JSON.stringify({
    message: 'Success',
  })
}

export const badRequest = {
  statusCode: 400,
  body: JSON.stringify({
    message: 'Bad request',
  })
}

export const unauthorized = {
  statusCode: 401,
  body: JSON.stringify({
    message: 'Unauthorized',
  })
}

export const notFound = {
  statusCode: 404,
  body: JSON.stringify({
    message: 'Not found',
  })
}

export const internalError = {
  statusCode: 500,
  body: JSON.stringify({
    message: 'Internal server error',
  })
}

export const makeError = (message: string) => ({
  statusCode: 500,
  body: JSON.stringify({
    message,
  })
})