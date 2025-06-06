import {gql} from '@apollo/client';

export const QUERY_USER = gql`
query user($username: String!) {
    user(username: $username) {
        _id
        username
        email
        transactions {
            _id
            date
            category
            description
            amount
            type
        }
        budget {
            _id
            month
            year
            income
            expenses
            savings
        }
    }
}`;

export const QUERY_TRANSACTIONS = gql`
query getTransactions {
    transactions {
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
            username
            email
        }
    }
}`;
export const QUERY_ME = gql`
query me {
    me {
        _id
        username
        email
        transactions {
            _id
            date
            category
            description
            amount
            type
        }
        budget {
            _id
            month
            year
            income
            expenses
            savings
        }
    }
}`;