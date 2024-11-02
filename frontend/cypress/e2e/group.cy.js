describe('Test Page de Gestion de groupe', () => {
    it('Login puis Group Management', () => {
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

      //Etape 2 on Créer un groupe
      cy.get('input').type('MonGroupe')
      cy.get('.groupAdder > button').click()

      //Etape 3 on Ajoute un membre (lui même)
      cy.get(':nth-child(3) > .groupList > li').last().click()

      //Select lui même
      cy.get('select').select('John')

      cy.get('.memberAdder > button').click()

      cy.get('.membersList > li')

  
    })
  })