import express from 'express'
import { body } from "express-validator"
import {  admin, newPropertieForm, createSavePropertie,
             addImage, saveImage, editPropertie,
             saveEditedPropertie, deletePropertie, previewPropertie,
             sendMessage, 
             getContactMessage,
             changePropertieState} from '../controllers/propertiesController.js'
import protectRoutes from '../middleware/protectRoutes.js'
import uploadImage from '../middleware/uploadImage.js'
import checkUserAuth from '../middleware/checkUserAuth.js'

const router = express.Router()



router.get('/my-properties', protectRoutes, admin )
router.get('/properties/new', protectRoutes, newPropertieForm)
router.post('/properties/new', protectRoutes,
        body('title').notEmpty().withMessage('El Titulo es Obligatorio'),
        body('description')
                .notEmpty().withMessage('Agrega una descripción de la propiedad')
                .isLength({ max: 200 }).withMessage('La descripción es muy larga'),
        body('category').isNumeric().withMessage('Selecciona una Categoria'),
        body('price').isNumeric().withMessage('Selecciona un Rango de Precios'),
        body('rooms').isNumeric().withMessage('Selecciona Numero de Habitaciones'),
        body('parking').isNumeric().withMessage('Selecciona Numero de Estacionamientos'),
        body('bathrooms').isNumeric().withMessage('Selecciona Numero de Baños'),
        body('lat').notEmpty().withMessage('Ubica la Propiedad en el Mapa'),                    
                                                     createSavePropertie)
 
router.get('/properties/add-image/:id', protectRoutes, addImage) 
router.post('/properties/add-image/:id', protectRoutes,
                                         uploadImage.single('propImage'),
                                         saveImage) 
                                         
router.get('/properties/edit/:id', protectRoutes, editPropertie)
router.post('/properties/edit/:id', protectRoutes,
        body('title').notEmpty().withMessage('El Titulo es Obligatorio'),
        body('description')
                .notEmpty().withMessage('Agrega una descripción de la propiedad')
                .isLength({ max: 200 }).withMessage('La descripción es muy larga'),
        body('category').isNumeric().withMessage('Selecciona una Categoria'),
        body('price').isNumeric().withMessage('Selecciona un Rango de Precios'),
        body('rooms').isNumeric().withMessage('Selecciona Numero de Habitaciones'),
        body('parking').isNumeric().withMessage('Selecciona Numero de Estacionamientos'),
        body('bathrooms').isNumeric().withMessage('Selecciona Numero de Baños'),
        body('lat').notEmpty().withMessage('Ubica la Propiedad en el Mapa'),                    
                                                     saveEditedPropertie)

router.post('/properties/delete/:id', protectRoutes, deletePropertie)

router.put('/properties/:id', protectRoutes, changePropertieState)

//Rutas para los mensajes
router.post('/properties/:id', protectRoutes, checkUserAuth,
        body('message').isLength({min: 15}).withMessage('Debes ingresar un mensaje para el vendedor'),
         sendMessage)

router.get('/message/:id', protectRoutes, getContactMessage )         

//Area Publica
router.get('/properties/:id', checkUserAuth, previewPropertie)
                                       



export default router

