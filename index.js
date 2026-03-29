import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { sequelize } from "./config/sequelize.js";

// Load environment variables immediately
dotenv.config();

// Import models (Order matters for associations)
import "./models/User.js";
import "./models/Product.js";
import "./models/Cart.js";
import "./models/Order.js";
import "./models/OrderItem.js";
import "./models/Contact.js";
import "./models/Media.js";
import "./models/UserForm.js";
import "./models/CheckoutSession.js";
import "./models/Coupon.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import adminCustomerRoutes from "./routes/adminCustomerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import userFormRoutes from "./routes/userFormRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

const app = express();
// Render assigns a dynamic port; 3000 is just a local fallback
const PORT = process.env.PORT || 3000;

// --- 1. SETUP UPLOADS DIRECTORY (Run once at startup) ---
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("✅ Created uploads directory");
}

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the uploads folder statically so you can view images
app.use("/uploads", express.static("uploads"));

// --- 3. ROUTES ---
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to E-commerce Backend API",
        version: "1.0.0",
    });
});

app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is healthy" });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/admin", adminCustomerRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/user-forms", userFormRoutes);
app.use("/api", couponRoutes);

// --- 4. ERROR HANDLING ---
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global Error handler
app.use((err, req, res, next) => {
    console.error("Internal Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// --- 5. SERVER STARTUP ---
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to PostgreSQL");

        // Sync models only in development or if explicitly needed
        if (process.env.NODE_ENV === "development") {
            await sequelize.sync({ alter: true });
            console.log("🔄 Database synchronized (Alter Mode)");
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

// --- 6. GRACEFUL SHUTDOWN ---
const shutdown = async () => {
    console.log("Shutting down gracefully...");
    await sequelize.close();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
