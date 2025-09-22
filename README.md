## Brève présentation du projet

XChangeo est le joli nom donné à notre application de messagerie instantanée développée en React.js, NodeJS. Quelques features sont entre autres : la création de compte, la connexion à l'application, l'envoi et la réception de messages, la création d'un nouveau groupe et l'ajout de ses éventuels membres, le créateur devient donc admin de ce groupe.
L'utilisateur connecté a aussi la possibilité de voir les groupes qu'il a créés, ceux auxquels il appartient et donc d'y envoyer des messages.

## Installation et configuration

Le guide suivant est destiné aux utilisateurs Linux pour installer l'application sur une machine nue à partir de votre dépôt

#### Installation de NodeJS sur votre système

  + WIndows ou MacOS : Télécharger et installer node via https://nodejs.org/en/download
  + Linux : tapez les commandes suivantes les unes après les autres
    
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    nvm install 20
  
#### Installation de sqlite3 sous linux 

  Dans un terminal et à partir de votre repertoire racine, tapez
  
  sudo apt install sqlite3

### Installation des dépendances nécessaires
Dans chacun des répertoire backend et frontend, tapez la commande
  npm install

#### Dans le repertoire backend
  
  npm install express mandatoryenv sequelize

#### Mise en place de la base de données localement

  Depuis le répertoire du projet, tapez les commandes suivantes les unes après les autres : 
    cd ./backend
    npm run updatedb
#### Lancement de l'application serveuse
  + Une fois dans le répertoire backend, lancez l'application serveuse via la commande
    npm run start

#### Lancement de l'application cliente
  + Depuis le répertoire du projet, tapez les commandes suivantes les unes après les autres : 
    cd ./frontend
    npm run dev

  + Cliquez sur le lien  http://localhost:5173/ affiché dans le terminal pour accéder à l'application

#### Et voilà ! Vous y êtes ! Nous vous souhaitons de passer d'agréables moments avec vos proches et de rester au parfum des dernières nouvelles de ceux que vous aimez ! 

### XChangeo, votre application de messagerie inégalée !
