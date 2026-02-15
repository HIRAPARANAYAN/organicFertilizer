import express from "express";
import {
  uploadMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  getMediaByCategory,
  getPublicMediaById,
  validateMediaUpload,
  upload,
} from "../controllers/mediaController.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { body } from "express-validator";

const router = express.Router();

// Public routes
router.get("/category/:category", getMediaByCategory);
router.get("/public/:id", getPublicMediaById);

// =============================
// ADMIN ROUTES (Direct Prefix)
// =============================

// Upload
router.post(
  "/admin/upload",
  authenticateAdmin,
  upload.array("files", 5),
  validateMediaUpload,
  uploadMedia
);

// Get all media
router.get("/admin", authenticateAdmin, getAllMedia);

// Get single media
router.get("/admin/:id", authenticateAdmin, getMediaById);

// Update media
router.put(
  "/admin/:id",
  authenticateAdmin,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage("Title must be between 2 and 255 characters"),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage("Description must not exceed 2000 characters"),

    body("category")
      .optional()
      .isIn(["about_us", "products", "services", "blog", "gallery", "documents", "other"])
      .withMessage("Invalid category"),

    body("alt")
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage("Alt text must not exceed 255 characters"),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array"),

    body("sortOrder")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Sort order must be a non-negative integer"),

    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ],
  updateMedia
);

// Delete media
router.delete("/admin/:id", authenticateAdmin, deleteMedia);

export default router;
