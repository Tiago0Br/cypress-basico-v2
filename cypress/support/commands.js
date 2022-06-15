/// <reference types="cypress" />

Cypress.Commands.add('fillMandatoryFieldsAndSubmit', cliente => {
    cy.get('#firstName').type(cliente.nome)
    cy.get('#lastName').type(cliente.sobrenome)
    cy.get('#email').type(cliente.email)
    cy.get('#open-text-area').type(cliente.descricaoAtendimento)
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible').and('contain', 'Mensagem enviada com sucesso')
})