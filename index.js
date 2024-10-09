import { servidor } from "./config.js"

servidor.get("/", (req,res)=>{
    res.status(200).render("index.hbs")
})