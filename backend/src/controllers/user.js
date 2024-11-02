const status = require('http-status')
const userModel = require('../models/users.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
const { where } = require('sequelize')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

function validPassword (password) {
  return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

module.exports = {

  // Connexion à l'application
  async login (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Verify credentials of user using email and password and return token'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $email: 'John.Doe@acme.com', $password: '12345'}}
    if (!has(req.body, ['email', 'password'])) throw new CodeError('You must specify the email and password', status.BAD_REQUEST)
    const { email, password } = req.body
    const user = await userModel.findOne({ where: { email } })
    if (user) {
      if (await bcrypt.compare(password, user.passhash)) {
        const token = jws.sign({ header: { alg: 'HS256' }, payload: email, secret: TOKENSECRET })
        const name = user.name
        res.json({ status: true, message: 'Login/Password ok', token, user})
        return
      }
    }
    res.status(status.FORBIDDEN).json({ status: false, message: 'Wrong email/password' })
  },

  // Création d'un nouvel utilisateur
  async newUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'New User'
    // #swagger.parameters['obj'] = { in: 'body', description:'Name and email', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!'}}
    if (!has(req.body, ['name', 'email', 'password'])) throw new CodeError('You must specify the name, email and password', status.BAD_REQUEST)
    const { name, email, password } = req.body
    if (!validPassword(password)) throw new CodeError('Weak password!', status.BAD_REQUEST)
    await userModel.create({ name, email, passhash: await bcrypt.hash(password, 2), isAdmin: false })
    res.json({ status: true, message: 'User Added' })
  },

  // La liste de tous les utilisateurs de la base
  async getUsers (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get Users'
    const data = await userModel.findAll({ attributes: ['id', 'name', 'email', 'isAdmin', 'passhash'] })
    res.json({ status: true, message: 'Returning users', data })
  },

  // Fonction de mise à jour des infos d'un utilisateur
  async updateUser (req, res) {
    // #swagger.tags = ['Users',''Admin']
    // #swagger.summary = 'Update user info (admin only)'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!' }}
    const userModified = {}
    for (const field of ['name', 'email', 'password']) {
      if (has(req.body, field)) {
        if (field === 'password') {
          userModified.passhash = await bcrypt.hash(req.body.password, 2)
        } else {
          userModified[field] = req.body[field]
        }
      }
    }
    if (Object.keys(userModified).length === 0) throw new CodeError('You must specify the name, email or password', status.BAD_REQUEST)
    await userModel.update(userModified, { where: { id: req.params.id } })
    res.json({ status: true, message: 'User updated' })
  },

  // Fonction de suppression d'un utilisateur : seul un admmin peut faire cette action
  async deleteUser (req, res) {
    // #swagger.tags = ['Users','Admin']
    // #swagger.summary = 'Delete User'
    if (!has(req.params, 'id')) throw new CodeError('You must specify the id', status.BAD_REQUEST)
    const { id } = req.params
    await userModel.destroy({ where: { id } })
    res.json({ status: true, message: 'User deleted' })
  },

  // Fonction de verification que l'utilisateur courant possède un token. Sans quoi, il ne peut acceder à notre application
  async checkForUserToken (req, res, next) {
    // #swagger.security = [{"apiKeyAuth": []}]
    if (!req.headers || !req.headers.hasOwnProperty('x-access-token')) throw new CodeError('You must specify a token', status.BAD_REQUEST)
    const token = req.get('x-access-token')
    if (!jws.verify(req.headers['x-access-token'], 'HS256', TOKENSECRET)) throw new CodeError('Invalid Token', status.BAD_REQUEST)
    req.login = jws.decode(req.headers['x-access-token']).payload
    const user = await userModel.findOne({ where: { email: req.login } })
    if (!user) throw new CodeError("Token's user does not exist", status.BAD_REQUEST)
    next()
  },

  // Fonction de vérification d'un administrateur afin de lui donner les accès nécessaire
  async verifieAdmin (req, res, next) {
    // #swagger.tags = ['Admin']
    const user = await userModel.findOne({ where: { email: req.login } })
    if (!user.isAdmin) throw new CodeError('You must be Admin to do that', status.UNAUTHORIZED)
    next()
  },

  // Fonction permettant à un utilisateur de modifier son propre mot de passe
  async updatePassword (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update user password'
    // #swagger.parameters['obj'] = { in: 'body', description:'Password', schema: { $password: '1m02P@SsF0rt!'}}
    if (!has(req.body, ['password'])) throw new CodeError('You must specify your new password', status.BAD_REQUEST)
    const { password } = req.body
    if (!validPassword(password)) throw new CodeError('Weak password!', status.BAD_REQUEST)
    const user = await userModel.findOne({where: {email: req.login}})
    user.update({passhash: await bcrypt.hash(password, 2)})
    await user.save()
    res.json({ status: true, message: 'Password updated' })
  }
}
