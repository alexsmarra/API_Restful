const { Router } = require("express")

const TagsController = require("../controllers/TagsController")

const tagsRoutes = Router()

function myMiddleware(req, res, next) {
   
   if(!req.body.isAdmin) {
      return res.json({ message: "User unauthorized!" })
   }

   next()
}

const tagsController = new TagsController()

tagsRoutes.get("/:user_id", tagsController.index)

module.exports = tagsRoutes

