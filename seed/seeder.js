import db from '../config/db.js'
import {Category, Price, User, Properties} from '../models/index.js'
import categories from './categories.js'
import prices from './prices.js'
import users from './users.js'



//Este seeder lo vamos a ejecutar desde el Package.json
 const importData = async () => {
    
     
     try {
          //Autenticamos DB
     await db.authenticate()   
 
     //Generar columnas en DB
     await db.sync()
 
     //Insertar datos en columnas de DB
    
     await Promise.all([
          
          Category.bulkCreate(categories),
          Price.bulkCreate(prices),
          User.bulkCreate( users)
     ])
     
     //Terminamos proceso sin error "0"
     console.log('Datos Importados Correctamente!!..')
     process.exit(0)
     
    } catch (error) {
         //Terminamos Proceso con error "1"
         console.log(error)
         process.exit(1)
     }


  }

  const deleteData = async () => {

     try {
          //Autenticamos DB
     await db.authenticate()   
 
     //Generar columnas en DB
     await db.sync({force: true})
 
     //Insertar datos en columnas de DB
    
     // await Promise.all([
     //      Categories.destroy({where : {}, truncate: true}),
     //      Price.destroy({where: {}, truncate: true})
     // ])
     
     //Terminamos proceso sin error "0"
     console.log('Datos Eliminados Correctamente!!..')
     process.exit(0)
     
    } catch (error) {
         //Terminamos Proceso con error "1"
         console.log(error)
         process.exit(1)
     }


  }
       

  if(process.argv[2] === "-i" ){
    importData()
  }

  if(process.argv[2] === '-d'){
     deleteData()
  }




       
  

 