import React from 'react';
import { mount } from '@cypress/react';

import HomePage from '../../client/src/components/HomePage';

describe('HomePage', () => {
    mount(<HomePage />);
    cy.mount(<HomePage />);
  });

  it('displays the header', () => {
    cy.mount(<HomePage />);
    cy.get('.dashboard-header').should('contain.text', 'Your Budget Dashboard');
  });

  it('shows the summary cards', () => {
    cy.mount(<HomePage />);
    cy.get('.summary-cards').should('exist');
  });

  it('renders the expense chart', () => {
    cy.mount(<HomePage />);
    cy.get('.expense-chart').should('exist');
  });

  it('allows adding a new transaction', () => {
    cy.mount(<HomePage />);
    cy.get('input[name="date"]').type('2025-06-01');
    cy.get('input[name="category"]').type('Groceries');
    cy.get('input[name="description"]').type('Trader Joe\'s');
    cy.get('input[name="amount"]').type('50');
    cy.get('select[name="type"]').select('expense');
    cy.get('.add-transaction-form button[type="submit"]').click();
    
    // Check if the new transaction appears in the chart
    cy.get('.expense-chart').should('contain.text', 'Groceries');
    cy.get('.transactions-table tbody tr').should('have.length.greaterThan', 0);

    
  });
