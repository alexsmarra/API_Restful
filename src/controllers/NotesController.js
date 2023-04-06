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

      // in "notes" table, the notes WHERE id = 1, and only the first ("first()") one to find (apenas o primeiro que encontrar, mas no caso só temos um, com o id = 1 aí é que só temos um mesmo
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

      return res.json()
   }

   async index(req, res) {
      // req.query in Insomnia is in "Query"
      const { user_id, title, tags } = req.query

      let notes;

      if(tags) {
         const filterTags = tags.split(",").map(tag => tag.trim())

         // we want to select (para mostrar no resultado) only the id, title and user_id of notes table...
         notes = await knex("tags")
            .select([
               "notes.id",
               "notes.title",
               "notes.user_id"
            ])
            // where "notes.user_id" = user_id of the query..
            .where("notes.user_id", user_id)
            // whereLike "notes.title" words of the "title" in the query (para buscar o título sem precisar digitá-lo todo na query, mas apenas por uma palavra chave)..
            .whereLike("notes.title", `%${title}%`)
            // fetch the name of the tags that have in filterTags (as we are not specifying ("notes.something"), the "name" is to "tags", because we have "notes = await knex("tags")) above..
            .whereIn("name", filterTags)
            // we mean is, in the first param we want to connect the "notes" table, in the second and third params is which fields we want to connect to (é para quais campos queremos conectar)..
            .innerJoin("notes", "notes.id", "tags.note_id")
            .orderBy("notes.title")

            console.log(notes)
      
      } else {
         notes = await knex("notes")
            .where({ user_id })
            // through this way, we can fetch the name of notes without having to type the full name of the notes correctly
            .whereLike("title", `%${title}%`)
            .orderBy("title")
      }

      const userTags = await knex("tags").where({ user_id })
      const notesWithTags = notes.map(note => {
         const noteTags = userTags.filter(tag => tag.note_id === note.id)

         return {
            ...note,
            tags: noteTags
         }
      })

      console.log(notes)

      return res.json(notesWithTags)
   }
}

module.exports = NotesController