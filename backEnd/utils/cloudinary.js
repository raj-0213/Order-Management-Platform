const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dy8w5m785",
  api_key: "357348423923287" ,
  api_secret: "iTQoYNBmoHDfGjYqKYDd2UqXFp8",
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products", 
    allowed_formats: ["webp", "jpeg", "png"], // Allowed file formats
  },
});

module.exports = { cloudinary, storage };
