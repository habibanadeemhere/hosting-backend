const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../routes/auth");   
const userRoutes = require("../routes/user");    

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL_LOCAL,
  process.env.CLIENT_URL_PROD,
  "*"
].filter(Boolean);

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "5mb" }));

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected");
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection error", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "MERN auth API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

module.exports = app;  