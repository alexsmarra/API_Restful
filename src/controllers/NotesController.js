const knex = require("../database/knex")

class NotesController {
   async create(req, res) {
      const { title, description, tags, links } = req.body
      // pega o primeiro param após "._BASE_URL/._RESOURCE"
      const { user_id } = req.params

      // To create the notes table
      const note_id = await knex("notes").insert({
         title,
         description,
         user_id
      })

      const linksInsert = links.map(link => {
         return {
            note_id,
            url: link
         }
      })

      await knex("links").insert(linksInsert)

      const tagsInsert = tags.map(name => {
         return {
            note_id,
            name, 
            user_id
         }
      })

      await knex("tags").insert(tagsInsert)

      res.json()
   }

   async show(req, res) {
      const { id } = req.params

      // in "notes" table, the notes WHERE id = 1, and only the first ("first()") one to find (apenas o primeiro que encontrar, mas no caso só temos um, com o id = 1 aí é que só temos um mesmo)
      const note = await knex("notes").where({ id }).first()
      // in "tags" table, the tags where the note_id = id (req.params id) in order by name (ordem alfabética)
      const tags = await knex("tags").where({ note_id: id }).orderBy("name")
      // in "links" table, the links where the note_id = id (req.params id) in order by "created_at"
      const links = await knex("links").where({ note_id: id }).orderBy("created_at")

      return res.json({
         ...note,
         tags,
         links
      })
   }

   async delete(req, res) {
      const { id } = req.params 

      await knex("notes").where({ id }).delete()

      res.json()
   }

   async index(req, res) {
      // req.query in Insomnia is in "Query"
      const { user_id } = req.query

      const notes = await knex("notes")
         .where({ user_id })
         .orderBy("title")

      res.json(notes)
   }
}

module.exports = NotesController