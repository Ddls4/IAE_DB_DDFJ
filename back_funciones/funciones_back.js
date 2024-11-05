import mysql from "mysql2/promise";
import {} from 'dotenv/config'
/*
const conexion = await mysql.createConnection({
    host: process.env.S_IP,
    user: process.env.S_USER,
    database: process.env.S_DB,
    password: process.env.S_CEN,
});
*/
const guardar_db = async (username, password) => {
    try {
        const query = `INSERT INTO usuarios (nombre, contraseña_hash) VALUES (?, ?)`;
        await conexion.execute(query, [username, password]);
        
        console.log("Datos guardados en la base de datos");
    } catch (error) {
        console.error("Error al guardar en la base de datos:", error);
    }
};
const guardar_db_T = async (username, tabla) => {
    const tablaJson = JSON.stringify(tabla);
    try {
        const query = 'UPDATE usuarios SET Tabla_Asociada = ? WHERE nombre = ?';
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