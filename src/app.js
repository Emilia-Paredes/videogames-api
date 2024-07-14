import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import { DB_HOST, DB_DATABASE, DB_PORT } from './config.js'
import routesGames from './routes/Games.routes.js'

const conexion = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
mongoose.connect(conexion, { useNewUrlParser: true, useUnifiedTopology: true,
})
  .then(() => console.log('DB is connected'))
  .catch(err => console.error('DB connection error:', err));

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))
app.use(routesGames)
app.use((req, res) => {
  res.status(404).json({ status: false, error: 'Not Found' })
})

export default app;