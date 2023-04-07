const knex = require("../database/knex")

class TagsController {
   async index(req, res) {
      const user_id = req.user.id
      
      const tags = await knex("tags")
         // user_id: user_id  is equal to  user_id, the database understand 
         .where({ user_id })

      return res.json(tags)
   }
}

module.exports = TagsController