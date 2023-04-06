const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const { compare } = require("bcryptjs")

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

      return res.json(user)
   }
}

module.exports = SessionsController