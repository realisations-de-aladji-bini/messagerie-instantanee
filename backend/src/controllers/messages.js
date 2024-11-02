const status = require('http-status')
const groupModel = require('../models/groups.js')
const userModel = require('../models/users.js')
const messageModel = require('../models/messages')

const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
require('mandatoryenv').load(['TOKENSECRET'])

// Fonction qui renvoie la date et l'heure à auxquelles un message a été posté dans un groupe
function messageDate () {
  const currentTimeMillis = Date.now()
  const currentDate = new Date(currentTimeMillis)
  const year = currentDate.getFullYear() // Année (aaaa)
  const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Mois (de 01 à 12)
  const day = String(currentDate.getDate()).padStart(2, '0') // Jour (de 01 à 31)
  const hours = String(currentDate.getHours()).padStart(2, '0') // Heures (de 00 à 23)
  const minutes = String(currentDate.getMinutes()).padStart(2, '0') // Minutes (de 00 à 59)
  const seconds = String(currentDate.getSeconds()).padStart(2, '0') // Secondes (de 00 à 59)
  const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return datetimeString // retourne la date et l'heure actuelles au format datetime
}
module.exports = {
  // L'utilisateur doit être membre du groupe avant de faire toute action quelconque
  async checkGroupMember  (req, res, next) {
    if (!has(req.params, ['gid'])) throw new CodeError('You must specify a group id', status.BAD_REQUEST)
    const { gid } = req.params
    const groupMember = await groupModel.findAll({ // On cherche la ligne qui contient uniquement le groupe et l'utilisateur coutant
      include: [{
        model: userModel,
        attributes: [],
        where: { email: req.login }
      }],
      where: { id: gid }
    })
    if (groupMember.length == 0) throw new CodeError('You must be a group member to do that', status.UNAUTHORIZED)
    next()
  },
  // On liste tous les messages envoyés dans un groupe d'identifiant gid
  async getGroupMessages (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Get all  messages of a group'
    if (!has(req.params, 'gid')) throw new CodeError('You must specify the group id', status.BAD_REQUEST)
    const { gid } = req.params
    const groupMessages = await messageModel.findAll({
      include: [{
        model: groupModel,
        as: 'group',
        where: { id: gid },
        attributes: []
      }],
      attributes: ['id', 'content', 'userId', 'createdAt']
    })
    res.json({ status: true, message: 'Returning group\'s messages', groupMessages })
  },
  // L'uitilisateur courant poste un message dans un groupe
  async postMessageInGroup (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Post a message in a group'
    if (!has(req.params, ['gid'])) throw new CodeError('You must specify the group id in which you wanna post the message', status.BAD_REQUEST)
    const { gid } = req.params
    if (!has(req.body, ['content'])) throw new CodeError('You cannot post an empty message. Please specify the message content')
    const messageContent = req.body.content // Le contenu du message à poster
    const sender = await userModel.findOne({ where: { email: req.login } }) // L'auteur du message
    const receiverGroup = await groupModel.findOne({ where: { id: gid } }) // Le groupe dans lequel le message est envoyé
    const sendingDate = messageDate()
    if (!receiverGroup) throw new CodeError('Group does not exist', status.BAD_REQUEST) // On s'assure que le groupe cible existe effectivement
    const newMessage = { content: messageContent, createdAt: await sendingDate, groupId: gid, userId: sender.id }
    if (await messageModel.create(newMessage)) {
      res.json({ status: true, message: 'Message has been sent in group ' + receiverGroup.name })
    }
  }
}
