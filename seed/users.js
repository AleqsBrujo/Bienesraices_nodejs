import bcrypt from 'bcrypt'

const users = [
    {
        name: "AleqsBrujo",
        email: "correo@correo.com",
        password: bcrypt.hashSync('123456', 10),
        isAuthenticated: 1
    }, 
    {
        name: "EliasBrujo",
        email: "elias@correo.com",
        password: bcrypt.hashSync('123456', 10),
        isAuthenticated: 1
    },
    {
        name: "MatiBrujo",
        email: "mati@correo.com",
        password: bcrypt.hashSync('123456', 10),
        isAuthenticated: 1
    }
]

export default users