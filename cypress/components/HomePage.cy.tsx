import React from 'react';
import { mount } from 'cypress/react';
import HomePage from '../../client/src/components/HomePage';

describe('HomePage Component', () => {
  it('renders correctly', () => {
    mount(<HomePage />);
    cy.get('h1').contains('Welcome to Budget Your Way');
  });

  it('has a navigation bar', () => {
    mount(<HomePage />);
    cy.get('nav').should('exist');
  });

  it('displays the budget summary', () => {
    mount(<HomePage />);
    cy.get('.budget-summary').should('be.visible');
  });
});