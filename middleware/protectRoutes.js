import jwt from 'jsonwebtoken'
import {User} from '../models/index.js' 

const protectRoutes = async (req, res, next) => {

    //Verificar Token
   const { _token } = (req.cookies)

    //Comprobar Token
    if(!_token){
        return res.redirect('/auth/login')
    }

    try {
        const decodeJwt = jwt.verify(_token, process.env.SECRET_JWT)
        const user = await User.scope('hidePassword').findByPk(decodeJwt.id)
        
        if(user){
            req.user = user            
        } else {
            return res.redirect('/auth/login')
        }
        
        return next()
        
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
    
}


    

export default protectRoutes