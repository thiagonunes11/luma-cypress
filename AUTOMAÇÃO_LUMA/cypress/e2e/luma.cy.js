const faker = require('faker');

let nome, sobrenome, email, numeroTelefone, enderecoFicticio;

beforeEach(() => {

  //Gera uma massa de dados para ser utilizada durante os testes

  nome = faker.name.findName();
  sobrenome = faker.name.findName();
  email = faker.internet.email();
  numeroTelefone = faker.phone.phoneNumber();
  
  enderecoFicticio = {
    rua: faker.address.streetAddress(),
    cidade: faker.address.city(),
    estado: faker.address.state(),
    cep: faker.address.zipCode(),
    pais: faker.address.country(),
  };

  // Ajusta a resolução da janela
  cy.viewport(1280, 720);

  // Visita a página
  cy.visit('https://magento2-demo.magebit.com/');
});


describe('LUMA', () => {

  
  it('Login com sucesso', () => {

    // Clica no botão "Sign In"
    cy.contains('Sign In').click();

    // Insere o e-mail e senha
    cy.get('#email').type('roni_cost@example.com');
    cy.get('input[type="password"]').type('roni_cost3@example.com');

    //não gosto de utilizar, porém foi necessário
    cy.wait(2000);

    // Submete o formulário de login
    cy.get('#send2').click();

    // Verifica se o usuário está logado com sucesso
    cy.get('span.logged-in', { timeout: 15000 })
      .should('be.visible')
      .and('include.text', 'Welcome, Veronica Costello!');

  });



  it('Cadastro de usuário', () => {

    // Clica no botão "Create an Account"
    cy.contains('Create an Account').click();

    //não gosto de usar mas foi necessário
    cy.wait(2000);

    //Preenche os dados da conta
    cy.get('#firstname').type(nome);
    cy.get('#lastname').type(sobrenome);
    cy.get('#email_address').type(email);
    cy.get('#password').type('Senh@forte123');
    cy.get('#password-confirmation').type('Senh@forte123');

    //Envia os dados
    cy.get('button.action.submit.primary[title="Create an Account"]').click();

    //Verifica se o usuário foi criado corretamente
    cy.get('.box-information > .box-content > p',{ timeout: 15000 })
      .should('be.visible')
      .and('include.text', nome)
      .and('include.text', sobrenome)
      .and('include.text', email);
  });
  
  

  it('Adicionar produto ao carrinho', () => {

    //Faz a procura pelo produto
    cy.get('#search').type('short{enter}');

    //Clica no produto desejado
    cy.contains('Erika Running Short').click();

    //Seleciona tamanho e cor
    cy.contains('30').click();
    cy.get('#option-label-color-93-item-53').click();

    //Adiciona ao carrinho
    cy.contains('Add to Cart').click();

    //Valida que o produto foi adicionado ao carrinho
    cy.get('.showcart').click();
    cy.get('.minicart-items-wrapper')
      .contains('Erika Running Short');
    cy.get('.messages').should('be.visible')
      .and('include.text','You added Erika Running Short to your shopping cart.');

  });



  it('Finalizar compra', () => {

    //Reproduz os mesmos passos de adicionar ao carrinho
    cy.get('#search').type('short{enter}');
    cy.contains('Erika Running Short').click();
    cy.contains('30').click();
    cy.get('#option-label-color-93-item-53').click();
    cy.contains('Add to Cart').click();
    cy.get('.minicart-items-wrapper', {timeout: 15000})
      .contains('Erika Running Short'); 
    cy.get('.showcart').click();
    cy.get('#top-cart-btn-checkout').click();


    //Preenche os dados do endereço

    //não gosto de utilizar hard wait, porém foi necessário
    cy.wait(2000);

    cy.get('#customer-email').type(email);
    cy.get('input[name="firstname"]').type(nome);
    cy.get('input[name="lastname"]').type(sobrenome);
    cy.get('input[name="company"]').type('WEBJUMP')
    cy.get('input[name="street[0]"]').type(enderecoFicticio.rua);
    cy.get('select[name="country_id"]').select('United States');
    cy.get('select[name="region_id"]').select(enderecoFicticio.estado);
    cy.get('input[name="city"]').type(enderecoFicticio.cidade);
    cy.get('input[name="postcode"]').type(enderecoFicticio.cep);
    cy.get('input[name="telephone"]').type(numeroTelefone);

    //Seleciona o tipo do envio
    cy.get('input[type="radio"].radio[name="ko_unique_1"]').click();

    //Envia os dados
    cy.get('[data-role="opc-continue"]',{timeout:10000}).click();

    //Clica em "Place Order" para finalizar a compra
    cy.get('button.action.checkout').click();

    //Valida que a compra foi realizada
    cy.get('span.base[data-ui-id="page-title-wrapper"]')
      .should('contain.text', 'Thank you for your purchase!');


  });
});
