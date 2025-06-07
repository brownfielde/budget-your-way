import React from 'react';
import { mount } from 'cypress/react';
import InformationPage from '../../client/src/components/InformationPage';

describe('InformationPage Component', () => {
    it('renders correctly', () => {
        mount(<InformationPage />);
        cy.get('h1').contains('Learn How to Budget');
    });

    it('displays a list of articles', () => {
        mount(<InformationPage />);
        cy.get('ul').should('exist');
        cy.get('li').should('have.length', 4); // Assuming there are 4 articles
    });

    it('contains links to external articles', () => {
        mount(<InformationPage />);
        cy.get('a').each(link => {
            cy.wrap(link).should('have.attr', 'target', '_blank');
            cy.wrap(link).should('have.attr', 'rel', 'noopener noreferrer');
        });
    });
});