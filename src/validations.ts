const emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordTest = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/

export const validateEmail = (email: string) => {
  return emailTest.test(email)
}

export const validatePassword = (password: string) => {
  return passwordTest.test(password)
}

export const validateAlias = (link: string) => {
  return link.length > 5
}

export const validateLink = (link: string) => {
  return /^(ftp|http|https):\/\/[^ "]+$/
}