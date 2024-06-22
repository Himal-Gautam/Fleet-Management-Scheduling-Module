const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  activityType: {
    type: String,
    enum: ["trip", "maintenance", "available"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  schedules: [scheduleSchema],
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
