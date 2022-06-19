/// <reference types="cypress" />

describe('Lidando com links que abrem em nova aba', () => {
    beforeEach(() => {
        cy.visit('./src/index.html')
    })
    
    it('Verifica que a política de privacidade abre em outra aba', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('Acessa a página de política de privacidade removendo o target', () => {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        cy.get('#title').should('include.text', 'Política de privacidade')
    })

    it('Testa a página de política de privacidade de forma independente', () => {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
            .then($a => cy.visit(`./src/${$a.attr('href')}`))
        cy.get('#title').should('include.text', 'Política de privacidade')
    })
})