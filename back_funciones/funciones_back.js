import mysql from "mysql2/promise";
import {} from 'dotenv/config'

const ip = process.env.S_IP;
const usuario = process.env.S_USER;
const db = process.env.S_DB;
const cen = process.env.S_CEN;

const conexion = await mysql.createConnection({
    host: ip,
    user: usuario,
    database: db,
    password: cen,
});

const guardar_db = async (username, password) => {
    try {
        const query = `INSERT INTO usuarios (username, password) VALUES (?, ?)`;
        await conexion.execute(query, [username, password]);
        console.log("Datos guardados en la base de datos");
    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
    }
};
const guardar_db_T = async (username, tabla) => {
    const tablaJson = JSON.stringify(tabla);
    try {
        const query = 'UPDATE usuarios SET tabla_asociada = ? WHERE username = ?';
        await conexion.execute(query, [tablaJson, username]);
        console.log("Datos guardados en la base de datos");
    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
    }
};


export {
    guardar_db,
    guardar_db_T
}









