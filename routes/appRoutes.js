import express from 'express'
import checkUserAuth from '../middleware/checkUserAuth.js'
import { homePage, categoriesPage, pageNotFound, searchPage } from '../controllers/appController.js'

const router = express.Router()

//Pagina de Inicio
router.get('/home', checkUserAuth, homePage)

//Categorias
router.get('/categories/:id', checkUserAuth, categoriesPage)


//Pagina 404
router.get('/404', pageNotFound)

//Buscador
router.post('/search', searchPage)



export default router