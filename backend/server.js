require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});