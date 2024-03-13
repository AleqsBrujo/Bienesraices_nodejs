import  jwt  from "jsonwebtoken"
import {User} from '../models/index.js'

const checkUserAuth = async(req, res, next) => {
    const token = req.cookies._token

    if(!token){
       console.log('Usuario no loggeado')
       req.user = null

       return next()
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT)
        const user = await User.scope('hidePassword').findByPk(decoded.id, {raw: true})
        
        if(user){
            req.user = user
        }
        return next()
        
    } catch (error) {
        console.log(error)
        return res.clearCookie('_token').redirect('/auth/login')
    }
        
}
    


export default checkUserAuth
