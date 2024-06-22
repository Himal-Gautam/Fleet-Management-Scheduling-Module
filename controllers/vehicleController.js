const Vehicle = require("../models/vehicle");

const vehicleController = {
  // Check vehicle availability
  async checkAvailability(req, res) {
    const { vehicleId } = req.params;
    const { startDate, endDate } = req.query;

    try {
      const vehicle = await Vehicle.findOne({ vehicleId });
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const isAvailable = vehicle.schedules.every(
        (schedule) =>
          new Date(endDate) < new Date(schedule.startDate) ||
          new Date(startDate) > new Date(schedule.endDate)
      );

      res.json({ available: isAvailable });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error checking availability", error: error.message });
    }
  },

  // Count available vehicles
  async countAvailableVehicles(req, res) {
    const { date } = req.query;

    try {
      const vehicles = await Vehicle.find({
        schedules: {
          $not: {
            $elemMatch: {
              startDate: { $lte: new Date(date) },
              endDate: { $gte: new Date(date) },
            },
          },
        },
      });

      res.json({ count: vehicles.length });
    } catch (error) {
      res.status(500).json({
        message: "Error counting available vehicles",
        error: error.message,
      });
    }
  },

  // Schedule vehicle activity
  async scheduleActivity(req, res) {
    const { vehicleId } = req.params;
    const { activityType, startDate, endDate } = req.body;

    try {
      const vehicle = await Vehicle.findOne({ vehicleId });
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      // (Optional) Check for schedule conflicts here if needed

      vehicle.schedules.push({ activityType, startDate, endDate });
      await vehicle.save();
      res.status(201).json({ message: "Schedule created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error scheduling activity", error: error.message });
    }
  },

  // View vehicle schedules
  async getSchedules(req, res) {
    const { vehicleId } = req.params;

    try {
      const vehicle = await Vehicle.findOne({ vehicleId });
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle.schedules);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching schedules", error: error.message });
    }
  },

  // Modify/Cancel schedule
  async updateSchedule(req, res) {
    const { vehicleId, scheduleId } = req.params;
    const { activityType, startDate, endDate } = req.body;

    try {
      const vehicle = await Vehicle.findOneAndUpdate(
        { vehicleId, "schedules._id": scheduleId },
        {
          $set: {
            "schedules.$.activityType": activityType,
            "schedules.$.startDate": startDate,
            "schedules.$.endDate": endDate,
          },
        },
        { new: true } // Return the updated document
      );

      if (!vehicle) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json({ message: "Schedule updated successfully", vehicle });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating schedule", error: error.message });
    }
  },

  // Delete schedule
  async deleteSchedule(req, res) {
    const { vehicleId, scheduleId } = req.params;

    try {
      const vehicle = await Vehicle.findOneAndUpdate(
        { vehicleId },
        { $pull: { schedules: { _id: scheduleId } } },
        { new: true } // Return the updated document
      );

      if (!vehicle) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json({ message: "Schedule deleted successfully", vehicle });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting schedule", error: error.message });
    }
  },

  // Delete vehicle
  async deleteVehicle(req, res) {
    const { vehicleId } = req.params;
    try {
      const deletedVehicle = await Vehicle.findOneAndRemove({ vehicleId });
      if (!deletedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting vehicle", error: error.message });
    }
  },
};

module.exports = vehicleController;
