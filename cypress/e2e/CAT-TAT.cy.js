/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {

  const THREE_SECONDS_IN_ML = 3000

  beforeEach(function() {
    cy.visit('src/index.html')
  })

  it('1 - verifica o título da aplicação', function() {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('2 - preenche os campos obrigatórios e envia o formulário', function() {
    cy.get('#firstName').type('Marcelo')
    cy.get('#lastName').type('Nagase')
    cy.get('#email').type('marcelo@teste.com')
    cy.get('#phone').type('11987654231')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
    cy.get('.success').should('be.visible')
  })

  it('3 - preenche o campo com um texto longo', function() {
    const longText = 'Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste '
    cy.get('#firstName').type('Marcelo')
    cy.get('#lastName').type('Nagase')
    cy.get('#email').type('marcelo@teste.com')
    cy.get('#phone').type('11987654231')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.success').should('be.visible')
  })

  it('4 - exibe mensagem de erro ao submeter o formulário com um e-mail inválido', function() {
    cy.get('#firstName').type('Marcelo')
    cy.get('#lastName').type('Nagase')
    cy.get('#email').type('marcelo@teste,com')
    cy.get('#phone').type('11987654231')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })

  it('5 - campo de telefone contnua vazio quando preenchido com um valor não numérico', function() {
    cy.get('#phone')
      .type('abcabcabc')
      .should('have.value', '')
  })

  it('6 - campo de telefone contnua vazio quando preenchido com um valor não numérico', function() {
    cy.get('#firstName').type('Marcelo')
    cy.get('#lastName').type('Nagase')
    cy.get('#email').type('marcelo@teste.com')
    //cy.get('#phone').type('11987654231')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })

  it('7 - preenche e limpa os campos', function() {
    cy.get('#firstName')
      .type('Marcelo')
      .should('have.value', 'Marcelo')
      .clear()
      .should('have.value', '')
  })

  it('8 - Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
    cy.get('button[type=submit]').click()
    cy.get('.error').should('be.visible')
  })
  
  it('9 - Envia formulário com sucesso usando comando customizado', function() {
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
  })

  it('10 - Identificar um elemento com cy.contains', function() {
    cy.get('#firstName').type('Marcelo')
    cy.get('#lastName').type('Nagase')
    cy.get('#email').type('marcelo@teste.com')
    cy.get('#phone').type('11987654231')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
  })

  it('11 - Selecionar um produto de uma lista a partir do texto, valor', function() {
    cy.get('#product')
      .select('youtube') // Selecionar produto pelo texto
      .should('have.value', 'youtube')
    
    cy.get('#product')
      .select('mentoria') // Selecionar produto pelo valor
      .should('have.value', 'mentoria')

    cy.get('#product')
      .select(1) // Selecionar produto pelo valor
      .should('have.value', 'blog')
  })

  it('12 - Selecionar um radio com o valor feedback', function() {
    cy.get('input[type="radio"][value="feedback"]')
      .check() // Selecionar produto pelo valor
      .should('have.value', 'feedback')
  })

  it('13 - Marcar cada tipo de Atendimento', function() {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function ($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('14 - Marcar todos os checkbox e desmarcar cada tipo de Atendimento', function() {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('15 - Selecionar um arquivo da pasta fixtures', function() {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function ($input){
      console.log($input)
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('16 - Selecionar um arquivo simulando drag and drop', function() {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(function ($input){
        console.log($input)
        expect($input[0].files[0].name).to.equal('example.json')
     })
  })

  it('17 - Selecionar um arquivo utilizando uma fixture com alias - Section 7 - 31', function() {
    cy.fixture('example.json').as('SampleFile')
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('@SampleFile', { action: 'drag-drop' })
      .should(function ($input){
      console.log($input)
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('18 - Verificar que a Política de Privacidade abre em outra aba sem necessidade de outro clique - Section 8 - 33', function() {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('19 - Acessar a página Política de Privacidade removendo o target - Section 8 - 34', function() {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()
      cy.contains('Talking About Testing').should('be.visible')
  })

  it('20 - Testar a página Política de Privacidade de forma independente - Section 8 - 35', function() {
    cy.visit('./src/privacy.html')
    cy.contains('Talking About Testing').should('be.visible')
  })

  it('21 - Exibir mensagem por 3 segundos - Section 12 - 45', function() {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
    cy.tick(THREE_SECONDS_IN_ML)
    cy.get('.success').should('not.be.visible')
  })

  it('22 - Exibir e esconder as mensagens pde sucesso e erro com o .invoke - Section 12 - 50', function() {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
    .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('23 - Preencher área de texto com o .invoke - Section 12 - 52', function() {
    const longText = Cypress._.repeat('01234567890',20)
    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('value.value', longText)
  })

  it('24 - Enviar uma requisição HTTP - Section 12 - 54', function() {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function (response) {
        const { status, statusText, body } = response
        console.log(response)
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  })

  it.only('25 - Exibir e esconder as mensagens pde sucesso e erro com o .invoke - Section 13 - 56', function() {
    cy.get('#cat')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('#title')
    .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
    .invoke('text', 'Teste Subtitle')
  })
})
