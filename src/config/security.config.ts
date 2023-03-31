export namespace SecurityConfiguration{
  console.log(process.env.USER_DB)
  console.log(process.env.PASSWORD_DB)
  console.log(process.env.DATABASE)
  console.log(process.env.HOST_DB)
  export const userDb=  process.env.USER_DB;
  export const passwordDb= process.env.PASSWORD_DB;
  export const dataBase= process.env.DATABASE;
  export const hostDb= process.env.HOST_DB;
}
