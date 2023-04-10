// For more explanations, see file '../configs/upload.js' . This file is to upload and delete users files, (for image uploads), is linked to '../configs/uploads.js'. The image upload by the user will be temporarily in the tmp folder, and after being filtered, it will go to the uploads folder

const fs = require("fs")
const path = require("path")
const uploadConfig = require("../configs/upload")

class DiskStorage {
   async saveFile(file) {
      await fs.promises.rename(
         path.resolve(uploadConfig.TMP_FOLDER, file),
         path.resolve(uploadConfig.UPLOADS_FOLDER, file)
      )

      return file
   }

   async deleteFile(file) {
      const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

      try {
         await fs.promises.stat(filePath)
      } catch {
         return 
      }

      await fs.promises.unlink(filePath)
   }
}

module.exports = DiskStorage