const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// Check vehicle availability
router.get("/:vehicleId/availability", vehicleController.checkAvailability);

// Count available vehicles
router.get("/available", vehicleController.countAvailableVehicles);

// Schedule vehicle activity
router.post("/:vehicleId/schedule", vehicleController.scheduleActivity);

// Get vehicle schedules
router.get("/:vehicleId/schedule", vehicleController.getSchedules);

// Update vehicle schedule
router.put(
  "/:vehicleId/schedule/:scheduleId",
  vehicleController.updateSchedule
);

// Delete vehicle schedule
router.delete(
  "/:vehicleId/schedule/:scheduleId",
  vehicleController.deleteSchedule
);

// Delete vehicle
router.delete("/:vehicleId", vehicleController.deleteVehicle);

module.exports = router;
