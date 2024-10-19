import { servidor } from "./config.js"

servidor.get("/", (req,res)=>{
    res.status(200).render("index.hbs")
    
})


import fs from 'fs';
const filePath = './usuarios.json';

// Leer usuarios desde el archivo
function leerUsuarios() {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return [];
}

// Guardar usuarios en el archivo
function guardarUsuarios(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

// Ruta de inicio de sesión
servidor.post("/", async (req, res) => {
    let { username, password } = req.body;
    const users = leerUsuarios();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        console.log(`Usuario: ${username}, Contraseña: ${password}`);
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Credenciales incorrectas' });
    }
});

// Ruta para registrar un nuevo usuario
servidor.post("/register", async (req, res) => {
    let { username, password, role } = req.body;
    let users = leerUsuarios();

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.json({ success: false, message: 'El usuario ya existe' });
    }

    users.push({ username, password, role });
    guardarUsuarios(users);
    console.log(`Usuario registrado: ${username}`);
    res.json({ success: true, message: 'Registro exitoso' });
});