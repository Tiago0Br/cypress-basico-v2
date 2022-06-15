/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatórios e envia o formulário', () => {
        cy.get('#firstName').type('Tiagão')
        cy.get('#lastName').type('Lopes')
        cy.get('#email').type('teste@gmail.com')
        cy.get('#open-text-area')
            .type('Fazendo isso daqui e isso e aquilo, por favor.', { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible').and('contain', 'Mensagem enviada com sucesso')
    })

    it('Tenta salvar com um e-mail inválido', () => {
        cy.get('#firstName').type('Tiagão')
        cy.get('#lastName').type('Lopes')
        cy.get('#email').type('teste@gmail,com')
        cy.get('#open-text-area')
            .type('Fazendo isso daqui e isso e aquilo, por favor.', { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible').and('contain', 'Valide os campos obrigatórios')
    })

    it('Campo de telefone não deve aceitar caracteres não numéricos', () => {
        cy.get('#phone')
            .type('Teste!@#$%¨&*()/<>;')
            .should('have.value', '')
    })

    it('Tenta salvar sem preencher o telefone quando ele é obrigatório', () => {
        cy.get('#firstName').type('Tiagão')
        cy.get('#lastName').type('Lopes')
        cy.get('#email').type('teste@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area')
            .type('Fazendo isso daqui e isso e aquilo, por favor.', { delay: 0 })
        cy.get('.field label[for=phone]').should('contain', 'obrigatório')

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible').and('contain', 'Valide os campos obrigatórios')
    })

    it('Preenche e limpa os campos Nome, Sobrenome, e-mail e telefone', () => {
        cy.get('#firstName')
            .type('Tiagão')
            .should('have.value', 'Tiagão')
            .clear()
            .should('have.value', 'fssfs')
        
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

    it('Tenta submeter o formulário sem preencher nada', () => {
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible').and('contain', 'Validess os campos obrigatórios')
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
                .should('have.value', 'you//tube')
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
        });

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
                    expect($el[0].files[0].name).to.be.equal('examfffple.json')
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

    context('Lidando com links que abrem em nova aba', () => {
        it('Verifica que a política de privacidade abre em outra aba', () => {
            cy.get('#privacy a').should('have.attr', 'target', '_blank')
        });

        it('Acessa a página de política de privacidade removendo o target', () => {
            cy.get('#privacy a').invoke('removeAttr', 'target').click()
            cy.get('#title').should('include.text', 'Política de privacidade')
        });

        it('Testa a página de política de privacidade de forma independente', () => {
            cy.get('#privacy a')
                .should('have.attr', 'target', '_blank')
                .then($a => cy.visit(`./src/${$a.attr('href')}`))
            cy.get('#title').should('include.text', 'Política de privacidade')
        });
    });
})