import pool from "../config/db.js";

// Create table if not exists
export const createVehicleTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      type VARCHAR(50),
      price NUMERIC(12,2),
      engine_type VARCHAR(100),
      transmission VARCHAR(100),
      fuel_type VARCHAR(50),
      color VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("🚗 Vehicle table ready!");
};

// Model Functions
export const addVehicle = async (vehicleData) => {
  const { name, type, price, engine_type, transmission, fuel_type, color } = vehicleData;
  const query = `
    INSERT INTO vehicles (name, type, price, engine_type, transmission, fuel_type, color)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, type, price, engine_type, transmission, fuel_type, color]);
  return result.rows[0];
};

export const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM vehicles ORDER BY id DESC;");
  return result.rows;
};

export const getVehicleById = async (id) => {
  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1;", [id]);
  return result.rows[0];
};

export const updateVehicle = async (id, vehicleData) => {
  const { name, type, price, engine_type, transmission, fuel_type, color } = vehicleData;
  const query = `
    UPDATE vehicles
    SET name=$1, type=$2, price=$3, engine_type=$4, transmission=$5, fuel_type=$6, color=$7
    WHERE id=$8
    RETURNING *;
  `;
  const result = await pool.query(query, [name, type, price, engine_type, transmission, fuel_type, color, id]);
  return result.rows[0];
};

export const deleteVehicle = async (id) => {
  await pool.query("DELETE FROM vehicles WHERE id = $1;", [id]);
};
