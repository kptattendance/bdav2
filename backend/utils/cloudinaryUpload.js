import cloudinary from "../config/cloudinary.js";

// 🔥 GLOBAL UPLOAD FUNCTION
export const uploadToCloudinary = (buffer, folder = "general") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .end(buffer);
  });
};
