import { Properties, Price, Category } from "../models/index.js"


const getProperties = async(req, res) => {

    const [properties] = await Promise.all([
        Properties.findAll({
            include: [
                {model: Category},
                {model: Price}
            ]
        })
    ]) 
        

    res.json(properties)
    

}



export {
    getProperties
}