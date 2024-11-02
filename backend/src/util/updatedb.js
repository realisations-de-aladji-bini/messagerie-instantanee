const userModel = require('../models/users.js')
const bcrypt = require('bcrypt')
// Ajouter ici les nouveaux require des nouveaux modèles
const groupModel = require('../models/groups.js')
const messageModel = require('../models/messages.js')
const { dev } = require('./logger');

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  // Initialise la base avec quelques données
  const passhash = await bcrypt.hash('j£$µis1p@s$F0rt', 2)
  const user = await userModel.create({
    name: 'Admin', email: 'superadmin@gmail.com', passhash, isAdmin: true
  })

  // Ajouter ici le code permettant d'initialiser par défaut la base de donnée

  // Création d'utilisateurs
  const elkaabi = await userModel.create({
    name: 'El Kaabi', email: 'elkaabi@gmail.com', passhash, isAdmin: true
  })

  const lucien = await userModel.create({
    name: "Lucien", email: 'lucien@gmail.com', passhash, isAdmin: true
  })

  const john = await userModel.create({
    name: "John Doe", email: 'john.doe@exemple.com', passhash
  })

  const janne = await userModel.create({
    name: "Janne Doe", email: 'janne.doe@exemple.com', passhash
  })

  const germain = await userModel.create({
    name: 'Germain', email: 'germain@gmail.com', passhash
  })

  // Création de groupes
  const profGroupe = await groupModel.create({
    name: 'Friends'
  })
  const familyGroup = await groupModel.create({
    name: 'Family'
  })
  const webGroup = await groupModel.create({
    name: 'AppliWeb'
  })

  await profGroupe.setAdmin(user)
  await profGroupe.addUser(user)
  await profGroupe.addUser(john)
  await profGroupe.addUser(germain)

  await familyGroup.setAdmin(john)
  await familyGroup.setAdmin(janne)
  await familyGroup.addUser(john)
  await familyGroup.addUser(janne)

  // Création (envoi) de messages dans certains groupes
  await messageModel.create({ content: 'The first message of our group ', groupId: familyGroup.get('id'), userId: john.get('id') })
  await messageModel.create({ content: 'Hi !! Are you ok ?', groupId: familyGroup.get('id'), userId: janne.get('id') })
  await messageModel.create({ content: 'Yes ' + janne.get('name') + ', I am doing very. How about you ?', groupId: familyGroup.get('id'), userId: john.get('id') })
  await messageModel.create({ content: 'Cool ! What are you gonna do next week-end ?', groupId: familyGroup.get('id'), userId: janne.get('id') })
  await messageModel.create({ content: 'Morning everyone here ! Do you have Mike\'s news please !', groupId: familyGroup.get('id'), userId: germain.get('id') })
  await messageModel.create({ content: 'No ! We chatted two weeks ago', groupId: familyGroup.get('id'), userId: john.get('id') })
  await messageModel.create({ content: 'What ? Two weeks...', groupId: familyGroup.get('id'), userId: germain.get('id') })

  await messageModel.create({ content: 'Salut ', groupId: profGroupe.get('id'), userId: john.get('id') })
  await messageModel.create({ content: 'Bonjour', groupId: profGroupe.get('id'), userId: user.get('id') })
  await messageModel.create({ content: 'Yes ', groupId: profGroupe.get('id'), userId: germain.get('id') })

})()
