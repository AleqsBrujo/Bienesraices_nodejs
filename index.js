import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import propertiesRoutes from './routes/propertiesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'


//Crear Servidor
const app = express()

//Habilitar lecturar de datos de formulario
app.use( express.urlencoded({extended: true}))

//Habilitar CookieParser
app.use( cookieParser())

//Habilitar CSRF
app.use( csrf({ cookie : true}))

//Conexión a la base de datos
try {
    await db.authenticate()
    await db.sync()
    console.log('Se conecto correctamente a la DB')
    
} catch (error) {
    console.log(error)
}

//Habilitando Pug (Template Engine) en esto caso utilizaremos PUG
app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta Pública
app.use( express.static('public'))

//Routing
app.use('/', appRoutes)


app.use('/auth', userRoutes)

app.use('/', propertiesRoutes)


app.use('/api', apiRoutes)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor corriendo desde el puerto: ${PORT}`)
})


