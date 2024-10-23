import { servidor } from "./config.js"
import { guardar_db_T } from "./back_funciones/funciones_back.js"
import { guardar_db } from "./back_funciones/funciones_back.js"

servidor.get("/", (req,res)=>{
    res.status(200).render("index.hbs")
    
})

// Ruta para registrar un nuevo usuario
servidor.post("/register", async (req, res) => {
    let { username, password, role } = req.body;
    console.log(`Usuario: ${username}, Contraseña: ${password}, role:${role}`);
    guardar_db(username, password, role);
    res.status(200).send("Datos recibidos y guardados");
});


// Ruta para agregar o actualizar una tabla asociada a un usuario
servidor.post('/usuario/:username/tabla', (req, res) => {
    const username = req.params.username;
    const tabla = req.body.tabla;  // La tabla en formato JSON
    console.log(`Usuario: ${username}, tabla: ${tabla}`);
    guardar_db_T(username, tabla);
});


// Esto esta para que cuando no usemos localstorage
servidor.get('/usuario/:username/tabla', (req, res) => {
    const username = req.params.username;

    connection.query('SELECT tabla_asociada FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error al obtener tabla asociada:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener la tabla asociada' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({
            success: true,
            data: JSON.parse(results[0].tabla_asociada) // Convertir el string JSON a objeto
        });
    });
});