export type UserLoginType = {
  passport: string
  password: string
}

export type UserType = {
  passport: string
  password: string
  roles: string[]
  permissions: string[]
}
