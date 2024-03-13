import { Sequelize } from 'sequelize'
import {Properties, Category, Price} from '../models/index.js'


const homePage = async(req,res) => {
    const user = req.user
    const [categories, prices, houses, departments] = await Promise.all([
        Category.findAll({raw: true}),
        Price.findAll({raw: true}),
        Properties.findAll({
            limit: 3,
            where: {
                CategoryId : 1
            },
            include: [                
                {model: Price}
            ],
            order: [['createdAt', 'DESC']]
        }),
        Properties.findAll({
            limit: 3,
            where: {
                CategoryId: 2
            },
            include: [                
                {model: Price}
            ],
            order: [['createdAt', 'DESC']]
        })

    ])

            
    res.render('home', {
        page: 'Home',
        categories,
        prices,
        houses,
        departments,
        csrfToken: req.csrfToken(),
        user
    })
}

const categoriesPage = async (req,res) => {
    const {id} = req.params
    const user = req. user
    
    const category = await Category.findByPk(id)

    if(!category){
        return res.redirect('/404')
    }

    const propsByCategory = await Properties.findAll({        
        where: {
            CategoryId: id,
        },
        include: [
            {model: Price}
        ]      
          
    })    


        res.render('categories', {
            page: `${category.name}s en Venta`,
            category,
            propsByCategory,
            csrfToken: req.csrfToken(),
            user
    
        })
        
}
   

   
const searchPage = async (req,res) => {
    const { term } = req.body

    if(!term.trim()){
        return res.redirect('back')
    }

    const properties = await Properties.findAll({        
        where: {
            title: {
                [Sequelize.Op.like] : '%' + term + '%'
            }
        },
        include: [{
            model: Price
        }]
    })

    res.render('search', {
        page: 'Resultado de Busqueda',
        properties,
        csrfToken: req.csrfToken()
    })

}

    


const pageNotFound = async (req,res) => {
    res.render('404', {
        page: 'Pagina No Encontrada',
        csrfToken : req.csrfToken()
    })
}
 


export {
    homePage,
    categoriesPage,
    pageNotFound,
    searchPage

}