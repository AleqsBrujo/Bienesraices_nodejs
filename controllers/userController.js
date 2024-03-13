import { check, validationResult} from 'express-validator'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateId, generateJWT } from '../helpers/token.js'
import { registerEmail, changePassEmail } from '../helpers/email.js'

const loginForm = (req, res) => {
    res.render('auth/login',{
        isAuthenticated: false,
        page: 'Iniciar Sesión',
        csrfToken : req.csrfToken()
    })
}

const authUser = async (req, res) => {
    const {email, password} = req.body
    await check('email', 'Formato de Email Invalido').isEmail().run(req)
    await check('email', 'El Email es Obligatorio').notEmpty().run(req)    
    await check('password', 'El password es Obligatorio').notEmpty().run(req)

    const validationErrors = validationResult(req)

    if(!validationErrors.isEmpty()){      
        
        return res.render('auth/login', {
          page: 'Iniciar Sesión',
          csrfToken : req.csrfToken(),        
          errors: validationErrors.array(),          
        })
      }

    const user = await User.findOne({where: {email}})
    if(!user){
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),        
            errors: [{msg: 'El Email ingresado noExiste, revisa los datos o Registrate'}],          
          })
    }

    //Revisar que el Usuario este Autenticado
    if(!user.isAuthenticated){
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),        
            errors: [{msg: 'Tu cuenta no está confirmada, revisa tu email y confirmala'}],          
          })
    }

    //Revisar que el Password sea correcto
    if(!user.comparePassword(password)){
        return res.render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),        
            errors: [{msg: 'La Contraseña ingresada es Incorrecta, si la haz olvidado puedes cambiarla'}],          
          })

    }

    const token = generateJWT(user.id, user.name)
    
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true,
        // sameSite: true
    }).redirect('/my-properties')
             
}

    
const userLogout = async (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')

}
   

const registerForm = (req, res) => {

    
    res.render('auth/newUser', {
        page: 'Crea Tú Cuenta',
        csrfToken : req.csrfToken()
    })
}



const registerUser = async(req, res) => {
    
    const {name, email, password} = req.body
    
    await check('name', 'El Nombre es Obligatorio').notEmpty().run(req)
    await check('email', 'El Email es Obilgatorio').notEmpty().run(req)
    await check('email', 'Formato de Email Invalido').isEmail().run(req)
    await check('password', 'El password debe tener al menos 6 Caracterés').isLength({min: 6}).run(req)
    await check('confirm_password', 'Las Contraseñas no Coinciden').equals(password).run(req)

    const validationErrors = validationResult(req)


    if(!validationErrors.isEmpty()){      
        
      return res.render('auth/newUser', {
        page: 'Crea Tú Cuenta',
        csrfToken : req.csrfToken(),        
        errors: validationErrors.array(),
        user: {
            name,
            email,            
        }
      })
    }


    //Verificar Registro para Evitar Email Duplicados

    const emailExist = await User.findOne({ where : {email}})

    if(emailExist){
        return res.render('auth/newUser', {
            page: 'Crea Tú Cuenta',
            csrfToken : req.csrfToken(),
            errors: [{msg: 'EL Email ingresado ya ha sido Registrado'}],
            user: {
                name: req.body.name,
                email: req.body.email,            
            }
          })
        }



    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    })

    registerEmail({
        name: user.name,
        email: user.email,
        token: user.token
    })
   
    return res.render('templates/message', {
        page: 'Cuenta Creada Correctamente',
        confirmMsg: 'Revisa tu Email y confirma Tu Cuenta'
        
    })
   
}

    

const authenticateEmail = async(req, res) => {

    const {token} = req.params

    //Verificar si el token es válido
    const user = await User.findOne({where: {token}})
    if(!user){
        return res.render('auth/confirm-account', {
            page: 'Error al confirmar tu Cuenta',
            confirmMsg: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })

    } else {
        user.token = null
        user.isAuthenticated = true
        await user.save()

        return res.render('auth/confirm-account', {
            page: 'Cuenta autenticada con Exito',
            confirmMsg: 'Tu Cuenta ha sido confirmada con exito, Ya puedes disfrutar de nuestro contenido',
            error: false
    })

    }
}



const resetPassForm = async (req, res) => {

    return res.render('auth/forget-pass', {
        page: 'Recupera el Acceso a Tú Cuenta',
        csrfToken : req.csrfToken(),
    })
}

    

const resetPassword =  async (req, res) => {

    const {email} = req.body

    await check('email', 'Formato de Email Invalido').isEmail().run(req)
    await check('email', 'El Campo no puede ir Vacío').notEmpty().run(req)

    const validationErrors = validationResult(req)

    if(!validationErrors.isEmpty()){
        
        return res.render('auth/forget-pass', {
                 page: 'Recupera el Acceso a Tu Cuenta',
                 csrfToken : req.csrfToken(),
                 errors: validationErrors.array()
    
        })
    }


    //Buscar Usuario
    const user = await User.findOne({where: {email}})

    if(!user){
        return res.render('auth/confirm-account', {
            page: 'Recupera el Acceso a Tu Cuenta',
            confirmMsg: 'El Email ingresado no está Registrado',
            error: true
        })
    }

    //Generar token 
    user.token = generateId()
    await user.save()

    //Enviar Email
    changePassEmail({
        email,
        name: user.name,
        token: user.token
    })

    return res.render('templates/message', {
        page: 'Recupera el Acceso a Tu Cuenta',
        confirmMsg: 'Revisa tu Email y sigue las Instrucciones',        
    })
}
    


const checkToken = async (req, res) => {
    const {token} = req.params

    const user = await User.findOne({where: {token} } )

    if(!user){
        return res.render('templates/message', {
            page: 'Recupera el Acceso a Tu Cuenta',
            confirmMsg: 'Error',
            errors: [{msg: 'El token no es Valido'}]
        })
    }


    //Mostrar formulario de cambiar password
   res.render('auth/change-pass', {
        page: 'Recupera el Acceso a Tu Cuenta',
        csrfToken: req.csrfToken()
   })
}
   


const newPassword = async ( req, res, next) => {
    const {token} = req.params
    const { password } = req.body
    //Validar el password
    await check('password', 'El Campo no puede ir Vacío').notEmpty().run(req)
    await check('password', 'La Contraseña debe contener al menos 6 caracterés').isLength({min: 6}).run(req)
    await check('confirm_password', 'Las contraseñás no Coinciden').equals(password).run(req)

    const validationErrors = validationResult(req)

    if(!validationErrors.isEmpty()){
        
      return  res.render('auth/change-pass', {
            page: 'Recupera el Acceso a Tu Cuenta',
            csrfToken: req.csrfToken(),
            errors: validationErrors.array()
       })
    }
    
    //Identificar quien hace el cambio
    const user = await User.findOne({where : {token}})

    const salt = bcrypt.genSaltSync(10)

    
    //Hashear el nuevo password
    user.password = bcrypt.hashSync(password, salt )
    user.token = null
    await user.save()
    
    return res.render('auth/confirm-account', {
        page: 'Recupera el Acceso a Tu Cuenta',
        confirmMsg: 'Tu Contraseñá ha sido actualizada con Exito ya Puedes Iniciar Sesión',
        error: false
        })
    }

    
 
   
export { loginForm,
         userLogout,
         authUser,
         registerForm,
         registerUser,
         authenticateEmail,
         resetPassForm,
         resetPassword,
         checkToken,
         newPassword }

           


                
    
   



    


