
describe('API Tests', () => {

  interface Transaction {
    id: number;
    category: string;
    amount: number;
    date: string;
    type?: 'expense' | 'income'; // Optional type field   
    description?: string; // Optional description field
    // Add other fields as necessary
  }
  // Mock data for transactions
  const mockTransactions: Transaction[] = [
    {
      id: 1,
      category: "Transaction 1",
      amount: 100,
      date: "2023-10-01" 
      // type: "expense", // Optional field
      // description: "This is a description for transaction 1" // Optional field   
    },
    {
      id: 2,
      category: "Transaction 2",         
      amount: 200,
      date: "2023-10-02"
    },    
    {
      id: 3,
      category: "Transaction 3",
      amount: 300,
      date: "2023-10-03"
    }
  ];
  beforeEach(() => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/posts', mockTransactions).as('getPosts');
  });
  it('should load the API page', () => {
    cy.visit('https://jsonplaceholder.typicode.com/posts');
    cy.wait('@getPosts').its('response.statusCode').should('eq', 200);
    cy.get('body').should('contain', 'Transaction 1');
    cy.get('body').should('contain', 'Transaction 2');
    cy.get('body').should('contain', 'Transaction 3');
    cy.get('body').should('contain', '100');
    cy.get('body').should('contain', '200');
    cy.get('body').should('contain', '300');
    cy.get('body').should('contain', '2023-10-01');
    cy.get('body').should('contain', '2023-10-02');
    cy.get('body').should('contain', '2023-10-03');
    cy.get('body').should('contain', 'Transaction 1');
    cy.get('body').should('contain', 'Transaction 2');
    cy.get('body').should('contain', 'Transaction 3');
    cy.get('body').should('contain', '100');
    cy.get('body').should('contain', '200');         
    cy.get('body').should('contain', '300');
  });
  it('should fetch transactions from the API', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length(3);
        expect(response.body[0]).to.have.property('title', 'Transaction 1');
        expect(response.body[1]).to.have.property('title', 'Transaction 2');
        expect(response.body[2]).to.have.property('title', 'Transaction 3');
      });
  }
  );
  it('should display transactions on the page', () => {
    cy.visit('https://jsonplaceholder.typicode.com/posts');
    cy.get('body').should('contain', 'Transaction 1');
    cy.get('body').should('contain', 'Transaction 2');
    cy.get('body').should('contain', 'Transaction 3');
    cy.get('body').should('contain', '100');
    cy.get('body').should('contain', '200');
    cy.get('body').should('contain', '300');
    cy.get('body').should('contain', '2023-10-01');
    cy.get('body').should('contain', '2023-10-02');
    cy.get('body').should('contain', '2023-10-03');
  }
  );
  it('should filter transactions by category', () => {
    cy.visit('https://jsonplaceholder.typicode.com/posts');
    cy.get('input[name="category"]').type('Transaction 1');
    cy.get('button[type="submit"]').click();
    cy.get('body').should('contain', 'Transaction 1');
    cy.get('body').should('not.contain', 'Transaction 2');
    cy.get('body').should('not.contain', 'Transaction 3');
  }
  );
  it('should sort transactions by amount', () => {
    cy.visit('https://jsonplaceholder.typicode.com/posts');
    cy.get('select[name="sort"]').select('amount');
    cy.get('body').should('contain', 'Transaction 1');
    cy.get('body').should('contain', 'Transaction 2');
    cy.get('body').should('contain', 'Transaction 3');
    // Check if transactions are sorted by amount
    });
  });



