export type UserLoginType = {
  passport: string
  password: string
}

export type AuthType = {
  accessToken: string
  refreshToken: string
}

export type UserType = {
  uid: string
  usn: string
  name: string
  passport: string
  roles: string[]
  permissions: string[]
}
