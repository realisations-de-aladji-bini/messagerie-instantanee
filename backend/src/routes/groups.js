const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')
const groups = require('../controllers/groups.js')


router.use('/api', user.checkForUserToken)// Pour toutes les requêtes commençant par /api,  vérifier le token
router.get('/api/mygroups', groups.getGroupsAdmin)
router.post('/api/mygroups', groups.newGroup)
router.get('/api/mygroups/:gid', groups.getGroupMembers)
router.put('/api/mygroups/:gid/:uid', groups.addMember)
router.delete('/api/mygroups/:gid/:uid', groups.removeMember)
router.get('/api/groupsmember', groups.getGroupsMembership)

module.exports = router
