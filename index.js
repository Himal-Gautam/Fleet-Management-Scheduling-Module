const express = require("express");
const app = express();
const cors = require("cors"); // Enable Cross-Origin Resource Sharing
require("dotenv").config();

const dbConfig = require("./config/db"); // Database connection

app.use(cors());
app.use(express.json());

// Use the vehicle routes
app.use("/vehicles", require("./routes/vehicleRoutes"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
