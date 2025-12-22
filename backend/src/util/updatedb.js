const userModel = require('../models/users.js')
const bcrypt = require('bcrypt')
// Ajouter ici les nouveaux require des nouveaux modèles
const groupModel = require('../models/groups.js')
const messageModel = require('../models/messages.js')
require('express')
require('./logger');

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  // Initialise la base avec quelques données
  const passhash = await bcrypt.hash('j£$µis1p@s$F0rt', 2)
  const user = await userModel.create({
    name: 'Admin Super', email: 'superadmin@exemple.com', passhash, isAdmin: true
  })

  // Création d'utilisateurs
  const elkaabi = await userModel.create({
    name: 'El Kaabi', email: 'elkaabi@exemple.com', passhash, isAdmin: true
  })

  const alfa = await userModel.create({
    name: 'Alfa Dialo', email: 'alfadialo@exemple.com', passhash, isAdmin: true
  })
  const dagoblo = await userModel.create({
    name: 'Dagoblo Lêh', email: 'dagobloleh@exemple.com', passhash, isAdmin: true
  })
  const lucien = await userModel.create({
    name: 'Lucien', email: 'lucien@exemple.com', passhash, isAdmin: true
  })

  const john = await userModel.create({
    name: 'John Doe', email: 'john.doe@exemple.com', passhash
  })

  const janne = await userModel.create({
    name: 'Janne Doe', email: 'janne.doe@exemple.com', passhash
  })

  const germain = await userModel.create({
    name: 'Germain', email: 'germain@gmail.com', passhash
  })

  // Création de groupes
  const friendsGroup = await groupModel.create({
    name: 'Friends'
  })
  const familyGroup = await groupModel.create({
    name: 'Family'
  })

  const colleguesGroup = await groupModel.create({
    name: 'Collegues'
  })

  await friendsGroup.addUser(user)
  await friendsGroup.addUser(john)
  await friendsGroup.addUser(germain)
  await friendsGroup.addUser(dagoblo)
  await friendsGroup.addUser(alfa)
  await friendsGroup.addUser(lucien)
  await friendsGroup.addUser(elkaabi)
  await friendsGroup.addUser(janne)
  await friendsGroup.setAdmin(user)
  await colleguesGroup.setAdmin(elkaabi)

  await colleguesGroup.setAdmin(elkaabi)
  await colleguesGroup.addUser(elkaabi)
  await colleguesGroup.addUser(lucien)
  await colleguesGroup.addUser(user)
  await colleguesGroup.addUser(alfa)

  await familyGroup.setAdmin(john)
  await familyGroup.setAdmin(janne)
  await familyGroup.addUser(john)
  await familyGroup.addUser(janne)

  // Création (envoi) de messages dans certains groupes

  // Messages dans le groupe "Family"
  await messageModel.create({ content: 'The first message of our group ', groupId: familyGroup.get('id'), userId: john.get('id') })
  await messageModel.create({ content: 'Hi !! Are you ok ?', groupId: familyGroup.get('id'), userId: janne.get('id') })
  await messageModel.create({ content: 'Yes ' + janne.get('name') + ', I am doing very. How about you ?', groupId: familyGroup.get('id'), userId: john.get('id') })
  await messageModel.create({ content: 'Cool ! What are you gonna do next week-end ?', groupId: familyGroup.get('id'), userId: janne.get('id') })
  await messageModel.create({ content: 'Morning everyone here ! Do you have Mike\'s news please !', groupId: familyGroup.get('id'), userId: germain.get('id') })
  await messageModel.create({ content: 'No ! We chatted two weeks ago', groupId: familyGroup.get('id'), userId: john.get('id') })
  await messageModel.create({ content: 'What ? Two weeks...', groupId: familyGroup.get('id'), userId: germain.get('id') })

  // Messages dans le groupe "Friends"
  await messageModel.create({ content: 'Salut, les gars ! ', groupId: friendsGroup.get('id'), userId: elkaabi.get('id') })
  await messageModel.create({ content: 'Yo ! Vous chillez bien ?', groupId: friendsGroup.get('id'), userId: dagoblo.get('id') })
  await messageModel.create({ content: 'Wep, perso je me plais bien dans mon nouvel environnement.', groupId: friendsGroup.get('id'), userId: germain.get('id') })
  await messageModel.create({ content: 'Ça vous dit une sortie à la plage le week-end à venir ?', groupId: friendsGroup.get('id'), userId: elkaabi.get('id') })
  await messageModel.create({ content: 'Superbe idée. Je suis bien partant', groupId: friendsGroup.get('id'), userId: alfa.get('id') })
  await messageModel.create({ content: 'Trop cool. J\'avais besoin de ça pour me ressourcer un peu !', groupId: friendsGroup.get('id'), userId: dagoblo.get('id') })
  await messageModel.create({ content: 'Projet intéressant ! Je m\'inscris direct', groupId: friendsGroup.get('id'), userId: lucien.get('id') })
  await messageModel.create({ content: 'Je serai également de la partie', groupId: friendsGroup.get('id'), userId: janne.get('id') })

  // Messages dans le groupe "Collegues"
  await messageModel.create({ content: 'Bonjour à tous, avez-vous terminé le rapport ?', groupId: colleguesGroup.get('id'), userId: elkaabi.get('id') })
  await messageModel.create({ content: 'Pas encore, je suis toujours dessus.', groupId: colleguesGroup.get('id'), userId: lucien.get('id') })
  await messageModel.create({ content: 'Pareil pour moi, j\'ai eu quelques imprévus cette semaine.', groupId: colleguesGroup.get('id'), userId: alfa.get('id') })
  await messageModel.create({ content: 'D\'accord, essayons de le finaliser d\'ici la fin de la semaine.', groupId: colleguesGroup.get('id'), userId: elkaabi.get('id') })
  await messageModel.create({ content: 'Bonne idée, cela nous donnera le temps de le relire avant de le soumettre.', groupId: colleguesGroup.get('id'), userId: lucien.get('id') })
})()
