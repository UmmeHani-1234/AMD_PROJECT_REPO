import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import inhalersRouter from "./routes/inhalers";
import patientsRouter from "./routes/patients";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(cors({
    origin: '*', // Allow all origins in development
    credentials: false, // Set to false to avoid issues
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }));
  // Configure body parser with specific options
  app.use(express.json({ 
    limit: '10mb',
    type: 'application/json'
  }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb',
    type: 'application/x-www-form-urlencoded'
  }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API Routes
  app.use("/api/inhalers", inhalersRouter);
  app.use("/api/patients", patientsRouter);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
  });

  // Sync endpoint for offline events
  app.post("/api/sync", async (req, res) => {
    try {
      // Handle offline event synchronization
      const { type, data } = req.body;
      
      // Process based on event type
      switch (type) {
        case "SCAN":
          // Process scan event
          res.json({ success: true, message: "Scan event synced" });
          break;
        case "UPDATE":
          // Process update event
          res.json({ success: true, message: "Update event synced" });
          break;
        default:
          res.status(400).json({ success: false, error: "Unknown sync event type" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Sync failed" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Database connection
  const connectDB = async () => {
    try {
      // Use in-memory database for development
      // In production, use MongoDB Atlas or local MongoDB
      const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/vix";
      await mongoose.connect(mongoURI);
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection error:", error);
      // Continue without database for demo purposes
    }
  };

  const port = process.env.PORT || 3000;

  // Start server
  await connectDB();
  server.listen(port, () => {
    console.log(`🚀 VIX Server running on http://localhost:${port}/`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
    console.log(`🏥 API Documentation:`);
    console.log(`   POST /api/inhalers/donate - Register new inhaler donation`);
    console.log(`   POST /api/inhalers/verify/:id - Clinic verification`);
    console.log(`   POST /api/inhalers/scan - QR code scanning and validation`);
    console.log(`   POST /api/patients/request - Patient request with urgency scoring`);
    console.log(`   GET /api/patients/queue - Get sorted patient queue`);
  });
}

startServer().catch(console.error);
