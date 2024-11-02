const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')


router.use('/api', user.checkForUserToken)// Pour toutes les requêtes commençant par /api,  vérifier le token
router.get('/api/users', user.getUsers)
router.post('/register', user.newUser)
router.put('/api/password', user.updatePassword)
router.put('/api/users/:id', user.verifieAdmin, user.updateUser)
router.delete('/api/users/:id', user.verifieAdmin, user.deleteUser)
router.post('/login', user.login)

module.exports = router
