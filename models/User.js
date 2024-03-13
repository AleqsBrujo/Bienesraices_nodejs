import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const User = db.define('Users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    //Multiples atributos
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //Solo un atributo STRING
    token:DataTypes.STRING,
    isAuthenticated: DataTypes.BOOLEAN
     
    }, {
        hooks: {
           beforeCreate : async function(user) {
            const salt =  bcrypt.genSaltSync(10)
            user.password =   bcrypt.hashSync(user.password, salt)
           },           
        },
        scopes: {
          hidePassword: {
              attributes: {
                  exclude: ['password', 'token', 'isAuthenticated', 'createdAt', 'updatedAt' ]
              }
          }
        }
      },
    )

    //Creando una funcion dentro de User para comparar las Contraseñas
    User.prototype.comparePassword = function(password) {
        
        return bcrypt.compareSync(password, this.password)
    }

export default User


