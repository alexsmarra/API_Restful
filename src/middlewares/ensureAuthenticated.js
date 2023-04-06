const { verify } = require("jsonwebtoken")
const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")

function ensureAuthenticated(req, res, next) {
   // the token will stay here
   const authHeader = req.headers.authorization

   if(!authHeader) {
      throw new AppError("Uninformed JWT Token", 401)
   }

   // the token will be like this "Bare xxxxxxxxxxx", so we will use split, which would look in an array like this (que ficaria em um array dessa forma) ["Bare", "xxxxxxxxx"], as we only need the token (the one in the second position of the array), we will destructuring it at once (de uma vez) in a variable called 'token' to let's get (para pegarmos) this data.
   const [, token] = authHeader.split(" ")

   try {
      // 'verify' returns a 'sub', and we'll nickname it 'user_id' (vamos apelidá-lo de 'user_id')
      const { sub: user_id } = verify(token, authConfig.jwt.secret)

      // let's create the 'user' variable inside request
      req.user = {
         // in SessionsController.js we pass it to string
         id: Number(user_id),
      }

      return next()
   } catch {
      throw new AppError("Invalid JWT Token", 401)
   } 
}

module.exports = ensureAuthenticated