import React from 'react';
import { mount } from 'cypress/react';
import Navbar from '../../client/src/components/Navbar';

describe('NavBar Component', () => {
    it('renders the NavBar correctly', () => {
        mount(<Navbar />);
        cy.get('nav').should('exist');
    });

    it('contains the expected links', () => {
        mount(<Navbar />);
        cy.get('nav').within(() => {
            cy.contains('Home').should('exist');
            cy.contains('About').should('exist');
            cy.contains('Contact').should('exist');
        });
    });

    it('handles navigation clicks', () => {
        mount(<Navbar />);
        cy.get('nav').contains('Home').click();
        cy.url().should('include', '/home');
    });
});