import express from "express";
import {
  submitUserForm,
  getAllUserForms,
  getUserFormById,
  respondToUserForm,
  updateUserFormStatus,
  deleteUserForm,
  getUserFormStats,
  getUserOwnForms,
  validateUserForm,
} from "../controllers/userFormController.js";
import { authenticateUser, authenticateAdmin } from "../middleware/auth.js";
import { body } from "express-validator";

const router = express.Router();

// Public/User routes (no authentication required for basic submission)
router.post("/submit", validateUserForm, submitUserForm);

// User routes (authentication required)
router.get("/my-forms", authenticateUser, getUserOwnForms);


// Get all user forms
router.get("/admin", authenticateAdmin, getAllUserForms);

// Get user form by ID
router.get("/admin/:id", authenticateAdmin, getUserFormById);

// Respond to user form
router.post(
  "/admin/:id/respond",
  authenticateAdmin,
  [
    body("adminResponse")
      .trim()
      .notEmpty()
      .withMessage("Response is required")
      .isLength({ min: 5, max: 2000 })
      .withMessage("Response must be between 5 and 2000 characters"),

    body("status")
      .optional()
      .isIn(["pending", "in_progress", "resolved", "closed"])
      .withMessage("Invalid status"),
  ],
  respondToUserForm
);

// Update status
router.put(
  "/admin/:id/status",
  authenticateAdmin,
  [
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["pending", "in_progress", "resolved", "closed"])
      .withMessage("Invalid status"),
  ],
  updateUserFormStatus
);

// Delete
router.delete("/admin/:id", authenticateAdmin, deleteUserForm);

// Stats
router.get("/admin/stats/overview", authenticateAdmin, getUserFormStats);


export default router;
