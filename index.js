import { servidor } from "./config.js"
import { login } from "./back_funciones/funciones_back.js"
import { registrar } from "./back_funciones/funciones_back.js"
import { usuario } from "./back_funciones/funciones_back.js"
import { save_table } from "./back_funciones/funciones_back.js"
import { load_table } from "./back_funciones/funciones_back.js"
servidor.get("/", (req,res)=>{
    res.status(200).render("index.hbs")
})
servidor.get("/login", (req, res) => {
    res.render("login.hbs");
});
servidor.get("/register", (req, res) => {
    res.render("Signup.hbs");
});


servidor.get('/user', (req, res) => {
    usuario(req, res);
});
// Rutas POST
servidor.post("/register", async (req, res) => {
    const { username, password } = req.body;
    registrar(username, password, res);
});
servidor.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log("logenando....")
    login(username, password, res, req);
});

// RUTAS PARA TABLAS
servidor.post('/save-table', (req, res) => {
    const tableData = req.body;
    const userId = req.session.userId; 
    save_table(tableData, userId, req, res)
});
servidor.get('/load-table', (req, res) => {
    const userId = req.session.userId;
    load_table(userId, req, res)
});
