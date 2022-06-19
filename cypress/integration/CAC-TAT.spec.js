/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
    const THREE_SECONDS_IN_MS = 3000
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatórios e envia o formulário', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit({
            nome: 'Tiago',
            sobrenome: 'Lopes',
            email: 'teste@email.com',
            descricaoAtendimento: 'Faz isso aqui e isso ali.'
        })
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success')
            .should('not.be.visible')
    })

    it('Tenta salvar com um e-mail inválido', () => {
        cy.clock()
        cy.get('#firstName').type('Tiagão')
        cy.get('#lastName').type('Lopes')
        cy.get('#email').type('teste@gmail,com')
        cy.get('#open-text-area')
            .type('Fazendo isso daqui e isso e aquilo, por favor.', { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.error')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios')
        
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success')
            .should('not.be.visible')
    })

    it('Campo de telefone não deve aceitar caracteres não numéricos', () => {
        cy.get('#phone')
            .type('Teste!@#$%¨&*()/<>;')
            .should('have.value', '')
    })

    it('Tenta salvar sem preencher o telefone quando ele é obrigatório', () => {
        cy.clock()
        cy.get('#firstName').type('Tiagão')
        cy.get('#lastName').type('Lopes')
        cy.get('#email').type('teste@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area')
            .type('Fazendo isso daqui e isso e aquilo, por favor.', { delay: 0 })
        cy.get('.field label[for=phone]').should('contain', 'obrigatório')

        cy.contains('button', 'Enviar').click()
        cy.get('.error')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success')
            .should('not.be.visible')
    })

    Cypress._.times(5, () => {
        it('Preenche e limpa os campos Nome, Sobrenome, e-mail e telefone', () => {
            cy.get('#firstName')
                .type('Tiagão')
                .should('have.value', 'Tiagão')
                .clear()
                .should('have.value', '')
            
            cy.get('#lastName')
                .type('Lopes')
                .should('have.value', 'Lopes')
                .clear()
                .should('have.value', '')
            
            cy.get('#email')
                .type('teste@gmail.com')
                .should('have.value', 'teste@gmail.com')
                .clear()
                .should('have.value', '')
            
            cy.get('#phone')
                .type('123456')
                .should('have.value', '123456')
                .clear()
                .should('have.value', '')
        })
    })

    it('Tenta submeter o formulário sem preencher nada', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios')
        
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error')
            .should('not.be.visible')
    })

    it('Preenche e submete o formulário usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit({
            nome: 'Tiago',
            sobrenome: 'Lopes',
            email: 'teste@email.com',
            descricaoAtendimento: 'Faz isso aqui e isso ali.'
        })
    })

    context('Seleciona produtos', () => { 
        it('Seleciona um produto (Youtube) pelo seu texto', () => {
            cy.get('#product')
                .select('YouTube')
                .should('have.value', 'youtube')
        })
    
        it('Seleciona um produto (Mentoria) pelo seu valor (value)', () => {
            cy.get('#product')
                .select('mentoria')
                .should('have.value', 'mentoria')
        })
    
        it('Seleciona um produto (Blog) pelo seu índice', () => {
            cy.get('#product')
                .select(1)
                .should('have.value', 'blog')
        })
    })

    context('Marcando radio buttons', () => {
        it('Marca o tipo de Atendimento "Feedback"', () => {
            cy.get('input[value=feedback]')
                .check()
                .should('be.checked')
        })

        it('Marca cada tipo de atendimento', () => {
            cy.get('input[name="atendimento-tat"]').each($radio => {
                cy.wrap($radio)
                    .check()
                    .should('be.checked')
            })
        })
    })

    it('Marca ambos os checkboxes e depois desmarca o último', () => {
        cy.get('input[type=checkbox]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    context('Anexando arquivos', () => {
        it('Anexa um arquivo da pasta fixtures', () => {
            cy.get('#file-upload')
                .selectFile('cypress/fixtures/example.json')
                .then($el => {
                    expect($el[0].files[0].name).to.be.equal('example.json')
                })
        })

        it('Seleciona um arquivo simulando drag-and-drop', () => {
            cy.get('#file-upload')
                .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
                .then($el => {
                    expect($el[0].files[0].name).to.be.equal('example.json')
                })
        })

        it('Seleciona um arquivo utilizando um alias', () => {
            cy.fixture('example.json').as('anexo')
            cy.get('#file-upload')
                .selectFile('@anexo')
                .then($el => {
                    expect($el[0].files[0].name).to.be.equal('example.json')
                })
        })
    })

    it('Exibe e esconde as mensagens de sucesso e erro usando o ".invoke"', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('Preenche a área de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('Teste123 ', 10)
        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    })

    it('Faz uma requisição HTTP', () => {
        cy.request({
            method: 'GET',
            url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
        }).then(({ status, statusText, body }) => {
            expect(status).to.be.equal(200)
            expect(statusText).to.be.equal('OK')
            expect(body).to.include('CAC TAT')
        })
    })

    it('Encontra um gato', () => {
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
    })
})