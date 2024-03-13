import express from 'express'
import { authUser, authenticateEmail, checkToken, loginForm,
         newPassword, userLogout,
         registerForm, registerUser, resetPassForm,
         resetPassword } from '../controllers/userController.js'

         

const router = express.Router()

//Routing
router.get('/login', loginForm )
router.post('/login', authUser)

router.post('/logout', userLogout)


router.get('/newUser', registerForm )
router.post('/newUser', registerUser)

router.get('/confirm/:token', authenticateEmail)

router.get('/pass-recover', resetPassForm )
router.post('/pass-recover', resetPassword )

//Rutas cambio de password
router.get('/pass-recover/:token', checkToken )
router.post('/pass-recover/:token', newPassword)






export default router

