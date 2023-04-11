const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const UsersController = require("../controllers/UsersController")
const UserAvatarController = require("../controllers/UserAvatarController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const usersRoutes = Router()
// we did it like this in case we want to use another strategy different from const MULTER, we would create another variable.
const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController()
const usersAvatarController = new UserAvatarController()

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
// the 'put' method is when we want to update several fields, while the 'patch' method is when we want to update only one field, which in this case is the user's avatar. "upload.single()" is because we want upload only one file. 
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarController.update)

module.exports = usersRoutes