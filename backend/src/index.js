import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";
import cron from "node-cron";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  })
);

const tempDir = path.join(process.cwd(), "tmp");

cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error("Error:", err); // <- dodaj tę linię na początek
  res.status(500).json({
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
