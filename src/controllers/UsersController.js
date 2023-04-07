const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class UsersController {
   async create(req, res) {
      const { name, email, password } = req.body

      const database = await sqliteConnection()
      const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
      
      if(checkUserExists) {
         throw new AppError("This email is already in use.")
      }

      const hashedPassword = await hash(password, 8)

      await database.run(
         "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]
      )

      // returning a empty json if the user not exist 
      return res.status(201).json()
   }

   async update(req, res) {
      const { name, email, password, old_password } = req.body
      const user_id = req.user.id

      console.log(user_id)

      const database = await sqliteConnection()
      const user = await database.get("SELECT * FROM users WHERE id = (?)", [ user_id ])

      if(!user) {
         throw new AppError("User not found!")
      }

      const userWithUpdateEmail = 
         await database.get("SELECT * FROM users WHERE email = (?)", [ email ])

      
      if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
         throw new AppError("This email is already in use! Type your email correctly.")
      }

      user.name = name ?? user.name
      user.email = email ?? user.email

      if(password && !old_password) {
         throw new AppError("To change password, you need to enter old password correctly!")
      }

      if(password && old_password) {
         const checkOldPassword = await compare(old_password, user.password)

         if(!checkOldPassword) {
            throw new AppError("Old password does not match, please enter the old password correctly.")
         }

         user.password = await hash(password, 8)         
      }

      await database.run(`
         UPDATE users SET
         name = ?,
         email = ?,
         password = ?,
         updated_at = DATETIME('now')
         WHERE id = ?`,
         [user.name, user.email, user.password, user_id]
      );
      
      return res.json()
   }
}

module.exports = UsersController




