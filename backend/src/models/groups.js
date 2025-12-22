const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')
const groups = db.define('groups', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(128),
    validate: {
      len: [1, 128],
      notEmpty: true
    }
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }

}, { timestamps: false })

groups.belongsToMany(users, { through: 'UserGroup' })
users.belongsToMany(groups, { through: 'UserGroup' })
groups.belongsTo(users, { as: 'admin' })
module.exports = groups
