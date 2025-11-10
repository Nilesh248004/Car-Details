// routes/vehicleRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// -------------------------
// Add a new vehicle
// POST /api/vehicles
// -------------------------
router.post("/", async (req, res) => {
  try {
    const { name, brand, type, price, engine_type, transmission, fuel_type, color, description } = req.body;

    const result = await pool.query(
      `INSERT INTO vehicles (name, brand, type, price, engine_type, transmission, fuel_type, color, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, brand, type, price, engine_type, transmission, fuel_type, color, description]
    );

    res.status(201).json({
      success: true,
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error adding vehicle:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// -------------------------
// Search vehicles by brand only
// GET /api/vehicles/search?brand=Tata
// -------------------------
router.get("/search", async (req, res) => {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({ success: false, message: "Brand query parameter is required" });
    }

    const result = await pool.query("SELECT * FROM vehicles WHERE brand ILIKE $1 ORDER BY id ASC", [`%${brand}%`]);

    res.status(200).json({
      success: true,
      total: result.rows.length,
      vehicles: result.rows,
    });
  } catch (error) {
    console.error("❌ Error searching vehicles:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// -------------------------
// Get all vehicles
// GET /api/vehicles
// -------------------------
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
    res.status(200).json({
      success: true,
      vehicles: result.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching vehicles:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// -------------------------
// Get a single vehicle by ID
// GET /api/vehicles/:id
// -------------------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, vehicle: result.rows[0] });
  } catch (error) {
    console.error("❌ Error fetching vehicle by ID:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// -------------------------
// Update vehicle by ID
// PUT /api/vehicles/:id
// -------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, type, price, engine_type, transmission, fuel_type, color, description } = req.body;

    const result = await pool.query(
      `UPDATE vehicles SET name=$1, brand=$2, type=$3, price=$4, engine_type=$5, transmission=$6,
       fuel_type=$7, color=$8, description=$9 WHERE id=$10 RETURNING *`,
      [name, brand, type, price, engine_type, transmission, fuel_type, color, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, message: "Vehicle updated successfully", vehicle: result.rows[0] });
  } catch (error) {
    console.error("❌ Error updating vehicle:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// -------------------------
// Delete vehicle by ID
// DELETE /api/vehicles/:id
// -------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM vehicles WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, message: "Vehicle deleted successfully", deletedVehicle: result.rows[0] });
  } catch (error) {
    console.error("❌ Error deleting vehicle:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
