import { Router } from 'express'
import { getGames, saveGame, updateGame, deleteGame } from '../controllers/GamesController.js'
import { uploadImg } from '../middlewares/Storage.js'

const routes = Router()

routes.get('/api/games', getGames)
routes.get('/api/games/:id', getGames)
routes.post('/api/games', uploadImg.single('img'), saveGame)
routes.put('/api/games/:id', uploadImg.single('img'), updateGame)
routes.delete('/api/games/:id', deleteGame)

export default routes
