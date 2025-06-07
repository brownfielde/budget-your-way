import React from 'react';
import { mount } from 'cypress/react';
import TransactionPage from '../../client/src/components/TransactionPage';

describe('TransactionPage Component', () => {
    it('renders correctly', () => {
        mount(<TransactionPage />);
        cy.get('h2').contains('Your Transactions');
    });

    it('displays a loading message initially', () => {
        mount(<TransactionPage />);
        cy.get('p').contains('Loading...').should('exist');
    });

    it('displays transactions after loading', () => {
        // Mock the data to simulate the loading state
        cy.intercept('POST', '/graphql', (req) => {
            req.reply((res) => {
                res.send({
                    data: {
                        transactions: [
                            { _id: '1', date: '2023-10-01', description: 'Groceries', amount: 50 },
                            { _id: '2', date: '2023-10-02', description: 'Utilities', amount: 100 },
                        ],
                    },
                });
            });
        });

        mount(<TransactionPage />);
        cy.get('ul').should('exist');
        cy.get('li').should('have.length', 2);
        cy.get('li').first().contains('Groceries');
    });
});