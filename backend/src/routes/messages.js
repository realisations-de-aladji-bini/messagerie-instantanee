const express = require('express')
const router = express.Router()
const message = require('../controllers/messages.js')
const user = require('../controllers/user.js')
// L'utilisateur doit disposer d'un token (checkForUserToken) et aussi être membre du groupe (checkGroupMember) pour lequel il sollicite un service afficher la liste des messages ou poster un message )
router.use('/api/', user.checkForUserToken)
router.get('/api/messages/:gid', message.checkGroupMember, message.getGroupMessages)
router.post('/api/messages/:gid', message.checkGroupMember, message.postMessageInGroup)

module.exports = router
