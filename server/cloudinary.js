import { v2 as cloudinary } from "cloudinary";

// The SDK authenticates every upload with your account credentials.
// The API secret stays on the server, never in the frontend or git.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
