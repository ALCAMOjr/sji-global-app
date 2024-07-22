import express from 'express'
import AbogadosRoutes from './routes/Abogados.routes.js'
import TareasRoutes from "./routes/Tareas.routes.js"
import ExpedienteRuter from "./routes/Expedientes.routes.js"
import cors from "cors";
const app = express()


app.use(cors());
app.use(express.json())
app.use('/api', AbogadosRoutes)
app.use('/api', TareasRoutes)
app.use('/api', ExpedienteRuter)

export { app };
