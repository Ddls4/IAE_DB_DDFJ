import express from "express"
import morgan from "morgan"
import hbs from "hbs"
import { fileURLToPath } from "url"
import { dirname} from  "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const servidor =  express()

servidor.set('puerto', process.env.PORT || 90 || 8080)
servidor.use(express.json())
servidor.use(morgan('dev'))
servidor.use(express.static(`${__dirname}/publicos`))
servidor.set('view engine', 'hbs')
hbs.registerPartials(`${__dirname}/views/partials`)
servidor.listen(servidor.get("puerto"))

export {
    servidor
}

