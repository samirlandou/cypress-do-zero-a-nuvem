describe('Central de Atendimento ao Cliente TAT', () => {

  //Tratamento antes do teste iniciar
  beforeEach(() => {
    cy.visit('./src/index.html')
  })
  

  //Exemplo de testes e seleção de componentes.
  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    
    const longText = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 10)
    
    cy.get('#firstName').type('Samir')
    cy.get('#lastName').type('Landou')
    cy.get('#email').type('Samir@teste.com')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.get('button[type="submit"]').click()
    //cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
  })


  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    
    const longText = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 10)
    
    cy.get('#firstName').type('Samir')
    cy.get('#lastName').type('Landou')
    cy.get('#email').type('Samir@teste,com')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()

    cy.get('.error > strong').should('be.visible')
  })

  it('Campo Telefone continua vazio quando preenchido com o valor não-numérico.', () => {
    cy.get('#phone')
    .type('abcde')
    .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    
    const longText = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 10)
    
    cy.get('#firstName').type('Samir')
    cy.get('#lastName').type('Landou')
    cy.get('#email').type(' ')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.get('#phone-checkbox').check()
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')

    
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
    .type('Samir')
    .should('have.value', 'Samir')
    .clear()
    .should('have.value', '')

    cy.get('#lastName')
    .type('Landou')
    .should('have.value', 'Landou')
    .clear()
    .should('have.value', '')

    cy.get('#email')
    .type('Samir@teste.com')
    .should('have.value', 'Samir@teste.com')
    .clear()
    .should('have.value', '')
    
    cy.get('#phone')
    .type('123456789')
    .should('have.value', '123456789')
    .clear()
    .should('have.value', '')
  })
  
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })


  //Usando comando customizado
  it('envia o formulário com sucesso usando um comando customizado', () => {
    
    const data = {
      firstName: 'Samir',
      lastName: 'Landou',
      email: 'samir@teste.com',
      text: 'teste'
    }
    
    cy.fillMandatoryFieldsAndSubmit(data)
    cy.get('.success').should('be.visible')
  })


  //Secionando opção no combobox
  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })


  //selecionando opção no tipo radio
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
    .check()
    .should('be.checked')
  })
  
  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]').each(typeOfService => {

      //WRAP empacota cada elemento do array (typOfService)
      cy.wrap(typeOfService).check().should('be.checked')
    })
  })


  //Marcar ou desmarcando um checkbox com 'check' ou 'unchecked'
  it('marca ambos checkboxes, depois desmarca o último', () => {
    
    //marcar todos os elementos
    cy.get('input[type="checkbox"]').check().should('be.checked')

    //desmarcar o ultimo checkbox
    cy.get('input[type="checkbox"]').last().uncheck().should('not.be.checked')
  
    //desmarcar o primeiro elemento
    cy.get('input[type="checkbox"]').first().uncheck().should('not.be.checked')

    //checar o primeiro cada elemento selecionando pelo id
    cy.get('#email-checkbox').check()
    //cy.get('#phone-checkbox').check()

  })

  //teste de upload de arquivo
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json')
    .should((input) => {
      //console.log('input ==> ', input);
      //console.log(input[0].files[0].name);

      expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  //teste de upload de arquivo com a propriedade drag-drop
  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
    .should((input) => {
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })

  //teste de upload de arquivo usando o alias
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    
    cy.fixture('example.json').as('sampleFile')

    cy.get('#file-upload')
    .selectFile('@sampleFile')
    .should((input) => {
      expect(input[0].files[0].name).to.equal('example.json')
    })

  })

  //teste de link que abre em outro navegador usando teste de atributos
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
    .should('have.attr', 'href', 'privacy.html')
    .and('have.attr', 'target', '_blank')
  })

  //teste acessar páginas com remoção de atributos através do 'invoke'
  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a', 'Política de Privacidade')
    .invoke('removeAttr', 'target')
    .click()
    
    cy.contains('h1', 'CAC TAT - Política de Privacidade')
    .should('be.visible')

  })

/*   it('', () => {

  }) */



})
