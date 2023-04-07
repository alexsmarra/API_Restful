const { Router } = require("express")

const NotesController = require("../controllers/NotesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const notesRoutes = Router()

const notesController = new NotesController()

// to place the middleware on all routes, do it this way:
notesRoutes.use(ensureAuthenticated)

notesRoutes.post("/", notesController.create)
notesRoutes.get("/:id", notesController.show)
notesRoutes.delete("/:id", notesController.delete)
// as it is a query, we don't need to put "/:user_id", but only "/"
notesRoutes.get("/", notesController.index)

module.exports = notesRoutes