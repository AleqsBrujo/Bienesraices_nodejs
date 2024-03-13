import jwt from 'jsonwebtoken'

const generateId = () => Math.random().toString(32).substring(2) + Date.now().toString(32) 

const generateJWT = (id, name) => {

   return jwt.sign({id, name}, process.env.SECRET_JWT, {expiresIn: '1d'})

}

export {generateId, generateJWT}