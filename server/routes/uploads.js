import { Router } from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// multer holds the uploaded file in memory; the SDK streams it to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
});

// POST /api/uploads — upload one image (field name "image") to the CDN.
// Returns the secure_url, which you then store on the record it belongs to.
router.post("/", auth, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const result = await new Promise((resolve, reject) =>
      cloudinary.uploader
        .upload_stream({ folder: "tenanttrails" }, (err, r) =>
          err ? reject(err) : resolve(r)
        )
        .end(req.file.buffer)
    );

    res.json({ url: result.secure_url }); // store this URL
  } catch (err) {
    next(err);
  }
});

export default router;
