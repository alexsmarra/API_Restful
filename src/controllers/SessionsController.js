const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const { compare } = require("bcryptjs")
// import token
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")

class SessionsController {
   async create(req, res) {
      const { email, password } = req.body

      const user = await knex("users").where({ email }).first()

      if(!user) {
         throw new AppError("Wrong email or password", 401)
      }

      const passwordMatched = await compare(password, user.password)

      // we will not specify if the password or email is incorrect, so as not to make it easier for someone who wants to find out the data of a user, some thief
      if(!passwordMatched) {
         throw new AppError("Wrong email or password", 401)
      }

      // for token
      const { secret, expiresIn } = authConfig.jwt
      const token = sign({}, secret, {
         subject: String(user.id),
         expiresIn
      })

      return res.json({ user, token })
   }
}

module.exports = SessionsController