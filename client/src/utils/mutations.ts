import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id 
            email
        }
    }
}
`;

export const ADD_TRANSACTION = gql`
mutation addTransaction($input: TransactionInput!) {
    addTransaction(input: $input) {
        _id
        date
        category {
            Groceries
            Rent
            Utilities
            Entertainment
        }
        description
        amount
        type
        user {
            _id
            email
        }
    }
}
`;