import bcrypt from "bcrypt"
import mysql from "mysql2";
import {} from 'dotenv/config'

const conexion = await mysql.createConnection({
    host: process.env.S_IP,
    user: process.env.S_USER,
    database: process.env.S_DB,
    password: process.env.S_CEN,
});
conexion.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

const registrar = async (username, password,res) => {
    const query = 'INSERT INTO usuarios (username, password) VALUES (?, ?)';
    const hashedPassword = await bcrypt.hash(password, 10);
    conexion.query(query, [username, hashedPassword], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return console.log('El usuario ya existe');
            }
            return console.log('Error al registrar el usuario');
        }
        console.log({ message: 'Usuario registrado exitosamente' });
    });

    
};
const login = async (username, password, res, req) => {
    const query = 'SELECT * FROM usuarios WHERE username = ?';
    conexion.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.userId = user.id;
            return res.json({ message: 'Inicio de sesión exitoso' });
        }
        res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    });
   
};
const usuario = (req, res)=>{
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const query = 'SELECT username FROM usuarios WHERE id = ?';
    conexion.query(query, [req.session.userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ message: 'Error al obtener el usuario' });
        }
        res.json({ username: results[0].username });
    });
};

const save_table = (tableData, userId,req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Validación del formato del JSON
    if (!tableData || !tableData.columns || !tableData.rows) {
        return res.status(400).json({ message: 'Datos de la tabla no válidos' });
    }

    // Primero, verifica si el usuario ya tiene una tabla guardada
    const checkQuery = `SELECT id FROM Tabla WHERE user_id = ?`;

    conexion.query(checkQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error al verificar la tabla existente:', err);
            return res.status(500).json({ message: 'Error al verificar la tabla existente' });
        }

        if (results.length > 0) {
            // Si ya existe, actualiza la tabla
            const updateQuery = `UPDATE Tabla SET datos = ? WHERE user_id = ?`;

            conexion.query(updateQuery, [JSON.stringify(tableData), userId], (err) => {
                if (err) {
                    console.error('Error al actualizar la tabla:', err);
                    return res.status(500).json({ message: 'Error al actualizar la tabla' });
                }

                res.json({ message: 'Tabla actualizada exitosamente' });
            });
        } else {
            // Si no existe, inserta una nueva entrada
            const insertQuery = `INSERT INTO Tabla (user_id, datos) VALUES (?, ?)`;

            conexion.query(insertQuery, [userId, JSON.stringify(tableData)], (err, results) => {
                if (err) {
                    console.error('Error al guardar en la base de datos:', err);
                    return res.status(500).json({ message: 'Error al guardar la tabla' });
                }

                res.json({ message: 'Tabla guardada exitosamente', id: results.insertId });
            });
        }
    });
}
const load_table =(userId, req, res) =>{
    if (!userId) {
        return res.status(400).json({ message: 'ID de usuario requerido' });
    }

    const query = `SELECT datos FROM Tabla WHERE user_id = ?`;

    conexion.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ message: 'Error al cargar la tabla' });
        }

        if (results.length > 0) {
            const tableData = JSON.parse(results[0].datos); // Convertir el campo JSON a un objeto
            res.json(tableData); // Enviar la información al cliente
        } else {
            res.json(null); // No se encontraron datos
        }
    });
}
export {
    registrar,
    login,
    usuario,
    save_table,
    load_table
}