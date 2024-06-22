const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db"); // Database connection

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use the vehicle routes
app.use("/vehicles", require("./routes/vehicleRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
