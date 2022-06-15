# Testes automatizados com Cypress - Básico

👋 Seja bem-vindo(a)!

Esse projeto foi baseado no curso [Testes Automatizados com Cypress - Básico](https://www.udemy.com/course/testes-automatizados-com-cypress-basico/) criado pelo [Walmyr](https://github.com/wlsf82).

## Objetivos do projeto

O objetivo do projeto é criar testes para um formulário simples e explorar as funcionalidades básicas do [Cypress](https://docs.cypress.io).

  Testes realizados:

- Preenchimento dos campos de Texto
- Selecionando *radio buttons*
- Marcando e desmarcando *checkbox*

- Validação da obrigatoriedade de campos

- *Upload* de arquivos

- Como lidar com links que abrem em outra aba do navegador

- Testando a aplicação simulando um dispositivo mobile

## Como executar o projeto

- É necessário ter instalado o [Node](https://nodejs.org/pt-br/) na sua máquina.
- Clonar o repositório em sua máquina
`git clone https://github.com/Tiago0Br/cypress-basico-v2.git`
- Instalar as dependências do projeto com `npm install`
- Para abrir a interface do Cypress execute o comando `npm run cy:open`

### Execução dos testes em modo *headless*

    npm run cy:run

### Execução dos testes simulando um dispositivo mobile
- Para abrir a interface do Cypress, execute `npm run cy:open:mobile`
- Para executar os testes em modo *headless*, execute `npm run cy:run:mobile`