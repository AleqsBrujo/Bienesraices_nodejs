import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Category = db.define('Categories', {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }

})




export default Category