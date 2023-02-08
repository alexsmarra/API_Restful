const { Router } = require("express")

const NotesController = require("../controllers/NotesController")

const notesRoutes = Router()

function myMiddleware(req, res, next) {
   
   if(!req.body.isAdmin) {
      return res.json({ message: "User unauthorized!" })
   }

   next()
}

const notesController = new NotesController()

notesRoutes.post("/:user_id", notesController.create)
notesRoutes.get("/:id", notesController.show)


module.exports = notesRoutes