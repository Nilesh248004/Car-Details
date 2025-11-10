// controllers/vehicleController.js
import pool from "../config/db.js";

// ✅ Add Vehicle
export const addVehicle = async (req, res) => {
  try {
    const { name, type, brand, price, description } = req.body;

    if (!name || !type || !brand || !price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO vehicles (name, type, brand, price, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, type, brand, price, description]
    );

    res.status(201).json({ success: true, vehicle: result.rows[0] });
  } catch (err) {
    console.error("❌ Error adding vehicle:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get All Vehicles
export const getVehicles = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
    res.status(200).json({ success: true, vehicles: result.rows });
  } catch (err) {
    console.error("❌ Error fetching vehicles:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Get Vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.status(200).json({ success: true, vehicle: result.rows[0] });
  } catch (err) {
    console.error("❌ Error fetching vehicle by ID:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Update Vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, brand, price, description } = req.body;

    const result = await pool.query(
      `UPDATE vehicles
       SET name=$1, type=$2, brand=$3, price=$4, description=$5
       WHERE id=$6 RETURNING *`,
      [name, type, brand, price, description, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.status(200).json({ success: true, vehicle: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating vehicle:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Delete Vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM vehicles WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting vehicle:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
