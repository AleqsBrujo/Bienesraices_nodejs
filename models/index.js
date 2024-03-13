import Properties from './Properties.js'
import Price from './Price.js'
import Category from './Category.js'
import User from './User.js'
import Messages from './Messages.js'


Properties.belongsTo(Price, {foreignKey: 'PriceId'})
Properties.belongsTo(Category, {foreignKey: 'CategoryId'})
Properties.belongsTo(User, {foreignKey: 'UserId'})
Properties.hasMany(Messages, {foreignKey: 'PropertieId'})

Messages.belongsTo(Properties, {foreignKey: 'PropertieId'})
Messages.belongsTo(User, {foreignKey: 'UserId'})

export {
    Properties,
    Price,
    Category,
    User,
    Messages
}