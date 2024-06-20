const express = require("express");
const ImagesRouter = express.Router();
const { upload } = require("../middlewares/multer.js");
const { uploadImages } = require("../middlewares/uploadImages.js");

ImagesRouter.post("/uploadImages", upload.array("images", 10), uploadImages);

module.exports = { ImagesRouter };
