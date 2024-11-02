const status = require('http-status')
const groupModel = require('../models/groups.js')
const userModel = require('../models/users.js')

const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
const { where, include } = require('sequelize')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

module.exports = {
  async getGroupsAdmin (req, res) {
    // #swagger.tags = ['Groups']
    const user = await userModel.findOne({ where: { email: req.login } })
    const data = await groupModel.findAll({ where: { adminId: user.id } })
    res.json({ status: true, message: 'Returning groups admin', data })
  },
  async newGroup (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Create a new Group withe loged user as admin'
    // #swagger.parameters['obj'] = { in: 'body', description:'Group name', schema: { $name: 'Class of 2024'}}
    if (!has(req.body, ['name'])) throw new CodeError('You must specify a group name', status.BAD_REQUEST)
    const { name } = req.body
    const group = await groupModel.create({ name })
    group.setAdmin(await userModel.findOne({ where: { email: req.login } }))
    res.json({ status: true, message: 'Group Created' })
  },
  async getGroupMembers (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Get all  member(user) of a group'
    const { gid } = req.params
    const data = await userModel.findAll({
      include: [{
        model: groupModel,
        where: { id: gid },
        attributes: []
      }],
      attributes: ['id', 'name', 'email', 'isAdmin']
    })
    res.json({ status: true, message: 'Returning groups members', data })
  },
  async addMember (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Add a  member(user) to a group'
    const { gid, uid } = req.params
    const user = await userModel.findOne({ where: { id: uid } })
    if (!user) throw new CodeError('User does not exist', status.BAD_REQUEST)
    const group = await groupModel.findOne({ where: { id: gid } })
    if (!group) throw new CodeError('Group does not exist', status.BAD_REQUEST)
    await group.addUser(user)
    res.json({ status: true, message: 'User Added' })
  },
  async removeMember (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Remove a  member(user) to a group'
    const { gid, uid } = req.params
    const user = await userModel.findOne({ where: { id: uid } })
    if (!user) throw new CodeError('User does not exist', status.BAD_REQUEST)
    const group = await groupModel.findOne({ where: { id: gid } })
    if (!group) throw new CodeError('Group does not exist', status.BAD_REQUEST)
    await group.removeUser(user)
    res.json({ status: true, message: 'User removed' })
  },
  async getGroupsMembership (req, res) {
    // #swagger.tags = ['Groups']
    const data = await groupModel.findAll({
      include: [{
        model: userModel,
        attributes: [],
        where: { email: req.login }
      }],
      attributes: ['name', 'id']
    })
    res.json({ status: true, message: 'Returning groups membership', data })
  }
}
