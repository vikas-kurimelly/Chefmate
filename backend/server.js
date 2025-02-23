require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");


const app = express();

// Middleware
app.use(express.json());
const connectDB = require("./config/db");
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/recipes", recipeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
