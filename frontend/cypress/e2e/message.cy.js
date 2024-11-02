describe('Test Page de Message', () => {
    it('Login puis Envoie Message', () => {
      //On visite le site
      cy.visit('http://localhost:5173/')
  
      //Etape 1 on se connect (le compte est creer dans le test cypress précédent)
      cy.get(".login .email").type('JohnDoe@test.com')
  
      //On entre le mot de pass 
      cy.get(".login .password").type('P@ssw0rd!')
  
      //On click pour valider
      cy.get(".login > button").click()
  
      //On vérifie qu'on est bien connecter
      cy.get(".identityBox")

      //Etape 2 on affiche la list des messages
      cy.get(':nth-child(2) > .groupList > li').last().click()

      cy.get('.messageAdder > input').type('Test message')

      cy.get('.messageAdder > button').click()

      cy.get('.message')

  
    })
  })