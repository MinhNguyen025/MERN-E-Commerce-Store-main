import path from "path";
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

// Cấu hình CloudinaryStorage cho Multer
const storage = multer.memoryStorage();
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: "ecommerce", // Thư mục trên Cloudinary
//     allowed_formats: ["jpeg", "png", "webp"],
//   },
// });



const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

// const upload = multer({ storage, fileFilter });
const upload = multer({ storage });
const uploadSingleImage = upload.single("image");

// router.post("/", (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err) {
//       res.status(400).send({ message: err.message });
//     } else if (req.file) {
//       res.status(200).send({
//         message: "Image uploaded successfully",
//         image: `/${req.file.path}`,
//       });
//     } else {
//       res.status(400).send({ message: "No image file provided" });
//     }
//   });
// });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No image file provided" });
    }

    const publicId = req.body.public_id || `ecommerce/${Date.now()}-${req.file.originalname.split('.')[0]}`;
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { public_id: publicId, folder: "ecommerce", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).send({
      message: "Image uploaded successfully",
      image: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).send({ message: "Upload failed", error: error.message });
  }
});

// router.post("/", upload.single("image"), (req, res) => {
//   if (req.file && req.file.path) {
//     res.status(200).send({
//       message: "Image uploaded successfully",
//       image: req.file.path, // URL của ảnh trên Cloudinary
//     });
//   } else {
//     res.status(400).send({ message: "No image file provided" });
//   }
// });

export default router;
