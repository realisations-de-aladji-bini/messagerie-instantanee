const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')
const groups = require('./groups.js')

const messages = db.define('messages', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  content: {
    type: Sequelize.STRING(128)
  },
  type: {
    type: Sequelize.STRING(20),
    defaultValue: 'message',
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    validate: {
      isDate: true
    }
  }
}, { timestamps: false })

messages.belongsTo(groups, { as: 'group' })
messages.belongsTo(users, { as: 'user' })

module.exports = messages
