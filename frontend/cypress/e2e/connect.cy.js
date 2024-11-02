describe('Test Page de Connexion', () => {
  it('Register puis Login', () => {
    //On visite le site
    cy.visit('http://localhost:5173/')

    //Etape 1 on créer un compte (register)

    //On entre le champs necessaire à la création du compte
    cy.get(".register .name").type('John')
    cy.get(".register .email").type('JohnDoe@test.com')
    cy.get(".register .password").type('P@ssw0rd!')
    cy.get(".register .confirmPassword").type('P@ssw0rd!')

    //On click pour valider
    cy.get(".register > button").click()

    //Etape 2 on se connect

    //On entre le mot de pass (nom déjà remplit)
    cy.get(".login .password").type('P@ssw0rd!')

    //On click pour valider
    cy.get(".login > button").click()

    //On vérifie qu'on est bien connecter
    cy.get(".identityBox")

  })
})