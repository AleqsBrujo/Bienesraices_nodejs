import {unlink} from 'node:fs/promises'
import { Price, Category, Properties, Messages, User} from '../models/index.js'
import { validationResult } from 'express-validator'
import { dateFormat, isSeller } from '../helpers/index.js'


const admin = async(req,res) => {

    
    try {
        const {page: actualPage} = req.query
    
        //El ^ revisa que va a iniciar con numeros [0-9] y el $ indica que termina en numero en este caso [0-9]
        const regexNums = /^[1-9]$/
        const limit = 5
        const offset = ((limit * actualPage) - limit)
    

        if(!regexNums.test(actualPage)){

            return res.redirect('my-properties?page=1')
        }
    
        const {id} = req.user
        
        const [userProperties, totalProps] = await Promise.all([
            Properties.findAll({
                limit,
                offset,
                where: {
                    UserId: id
                },
                include: [
                    {model: Category},
                    {model: Price},
                    {model: Messages}
                ]
                
            }),
            Properties.count({
                where: {
                    UserId : id
                }
            }
            )
        ]) 
    
        
        
        res.render('properties/admin',{
            page: 'Administra tús Propiedades',
            userProperties,
            csrfToken: req.csrfToken(),
            pages: Math.ceil( totalProps / limit ),
            actualPage: Number(actualPage),
            totalProps,
            offset,
            limit,
            Messages        
        })
        
    } catch (error) {
        console.log(error)
    }

    
}


const newPropertieForm = async (req, res) => {

    const [categorys, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render( 'properties/new', {
        page: 'Crear Propiedad',        
        csrfToken: req.csrfToken(),
        categorys,
        prices,
        formData: {}
    })

}


const createSavePropertie = async (req, res) => {

    let errorMsgs = validationResult(req)

    if(!errorMsgs.isEmpty()){

        const [categorys, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        
        res.render( 'properties/new', {
            page: 'Crear Propiedad',            
            csrfToken: req.csrfToken(),            
            categorys,
            prices,
            errors: errorMsgs.array(),
            formData: req.body
        })

    }

    const { title, description, category: CategoryId, price: PriceId, rooms,
           parking, bathrooms, street, lat, lng} = req.body
    
    const { id: UserId } = req.user        
          

    //Crear un Registro
    try {
        const savedPropertie = await Properties.create({
            title,
            description,
            CategoryId,
            PriceId,
            rooms,
            parking,
            bathrooms,
            street,
            lat,
            lng,
            UserId,
            image: ''
        })

        const {id} = savedPropertie

        res.redirect(`/properties/add-image/${id}`)

        
    } catch (error) {
        console.log(error)
    }
    
}

const addImage = async (req, res) => {
    
    //Validar Propiedad
    const { id } = req.params
    const propertie =  await Properties.findByPk(id)
    
    if(!propertie){

       return res.redirect('/my-properties')
    }
    

    //Validar que Propiedad isPublicated
    if(!!propertie.isPublicated){        
        return res.redirect('/my-properties')
    }

    
    //Validar que Propiedad sea del Usuario loggeado
    const { id: userId } = req.user

    if(propertie.UserId.toString() !== userId.toString()){
        
        return res.redirect('/my-properties')
    }
    
   
    res.render('properties/add-image', {
        page: `Añadir Imágenes: ${propertie.title}`,
        propertie,
        csrfToken: req.csrfToken(),
    })
   
}

const saveImage = async (req,res, next) => {
    //Validar Propiedad
    const { id } = req.params
    const propertie =  await Properties.findByPk(id)
    
    if(!propertie){
        return res.redirect('/my-properties')
    }
    
     //Validar que Propiedad isPublicated
    if(!!propertie.isPublicated){        
        return res.redirect('/my-properties')
    }
     
    //Validar que Propiedad sea del Usuario loggeado
    const { id: userId } = req.user
     if(propertie.UserId.toString() !== userId.toString()){
        
        return res.redirect('/my-properties')
    }

    try {
        //Almacenar Imagen y publicar Propiedad
       const {filename} = req.file

       propertie.image = filename
       propertie.isPublicated = 1

       await propertie.save()

       next()
        
    } catch (error) {
        console.log(error)
    }

}


const editPropertie = async(req,res) =>{
    const {id} = req.params
    const propertie = await Properties.findByPk(id)
    
    
    
    if(!propertie){
        return  res.redirect('/my-properties')
    }
    
    const user = req.user
   

    if(user.id.toString() !== propertie.UserId.toString()){
        
        return res.redirect('/my-properties')
    }
    
    const [categorys, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render( 'properties/edit', {
        page: 'Edita tu Propiedad',        
        csrfToken: req.csrfToken(),        
        formData: propertie,
        categorys,
        prices,
        
    })

}

const saveEditedPropertie = async (req, res) => {

    let errorMsgs = validationResult(req)

    if(!errorMsgs.isEmpty()){

        const [categorys, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
        
        res.render( 'properties/edit', {
            page: 'Edita tu Propiedad',        
            csrfToken: req.csrfToken(),        
            formData: req.body,
            categorys,
            prices,
            errors: errorMsgs.array(),            
        })
                
    }

    const {id} = req.params
    const propertie = await Properties.findByPk(id)
    
    
    
    if(!propertie){
        return  res.redirect('/my-properties')
    }
    
    const user = req.user
   

    if(user.id.toString() !== propertie.UserId.toString()){
        
        return res.redirect('/my-properties')
    }

    try {
        const { title, description, category: CategoryId, price: PriceId, rooms,
            parking, bathrooms, street, lat, lng} = req.body
        
        propertie.set({
            title, 
            description,
            CategoryId,
            PriceId, 
            rooms,
            parking,
            bathrooms, 
            street,
            lat, 
            lng
        })    

        // propertie.title = req.body.title
        // propertie.description = req.body.description
        // propertie.rooms = req.body.rooms
        // propertie.parking = req.body.parking
        // propertie.bathrooms = req.body.bathrooms
        // propertie.street =  req.body.street
        // propertie.lat = req.body.lat
        // propertie.lng = req.body.lng
        
        // propertie.PriceId = req.body.price
        // propertie.CategoryId = req.body.category
    
        await propertie.save()

        return res.redirect('my-properties')
        
    } catch (error) {
        console.log(error)
    }

    
    
}
    

const deletePropertie = async (req, res) => {
    
     const {id} = req.params
     const propertieToDelete = await Properties.findByPk(id)

     
    if(!propertieToDelete){
        return  res.redirect('/my-properties')
    }
    
    const user = req.user
   

    if(user.id.toString() !== propertieToDelete.UserId.toString()){
        
        return res.redirect('/my-properties')
    }


    try {
        //Eliminando la Imagen
        await unlink(`public/uploads/${propertieToDelete.image}`)
        
        //Eliminando registro DB
        await propertieToDelete.destroy()

        res.redirect('/my-properties')
    } catch (error) {
        console.log(error)
    }
              
    
}

const changePropertieState = async (req, res) => {

    const {id} = req.params
    const propertie = await Properties.findByPk(id)

    
    if(!propertie){
         return  res.redirect('/my-properties')
    }
    
    if(req.user.id.toString() !== propertie.UserId.toString()){
         
         return res.redirect('/my-properties')
    }

    propertie.isPublicated = !propertie.isPublicated

    await propertie.save()

    
    res.json({
        result: true
    })
       

}



const previewPropertie = async(req, res) => {
    const {id} = req.params
    
    const propertie = await Properties.findByPk(id,{        
        include: [
            {model: Category},
            {model: Price}
        ]
    })  
      

    if(!propertie || !propertie.isPublicated){
        return res.redirect('/404')
    }

   
    res.render('properties/preview', {
        propertie,
        page: propertie.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, propertie.UserId)
    })

}
        

const sendMessage = async (req, res) => {
    const {id} = req.params
    
    const propertie = await Properties.findByPk(id,{        
        include: [
            {model: Category},
            {model: Price}
        ]
    })  
      

    if(!propertie){
        return res.redirect('/404')
    }

    let errorMsgs = validationResult(req)

    if(!errorMsgs.isEmpty()){
       
       return res.render('properties/preview', {
        propertie,
        page: propertie.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, propertie.UserId),
        errors: errorMsgs.array()
       })
    }

    const { id: UserId} = req.user
    const {id: PropertieId} = req.params
    const {message} = req.body


    try {
        await Messages.create({
            message,
            UserId,
            PropertieId
        })

        res.redirect('/home')
        
    } catch (error) {
        console.log(error)       
        
    }    
      
}

//Obtener mensajes de contacto
const getContactMessage = async (req, res) => {
    
    const {id} = req.params
    const propertie = await Properties.findByPk(id, {
        include: [
            {model: Messages,
                include: [
                    {model: User.scope('hidePassword')}
                ]},
            
        ]
    })    
    
    if(!propertie){
        return  res.redirect('/my-properties')
    }
    
    const user = req.user
   

    if(user.id.toString() !== propertie.UserId.toString()){
        
        return res.redirect('/my-properties')
    }

    
     res.render('properties/messages', {
         page: 'Mensajes',
         messages: propertie.Messages,
         dateFormat
    })

}



export {
    admin,
    newPropertieForm,
    createSavePropertie,
    addImage,
    saveImage,
    editPropertie,
    saveEditedPropertie,
    deletePropertie,
    changePropertieState,
    previewPropertie,
    sendMessage,
    getContactMessage
    
}

    

   


