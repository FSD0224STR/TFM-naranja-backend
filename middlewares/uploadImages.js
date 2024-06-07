const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const images = req.files;
    console.log(images);
    const imagesUrls = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });
      imagesUrls.push(result.secure_url);
    }
    req.images = imagesUrls;
    console.log(req.images);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error at: UploadImages.js - ${error}`);
  }
});

module.exports = { uploadImages };
