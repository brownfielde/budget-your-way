const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    transactions: [Transaction]
  }

  type Transaction {
    id: ID!
    amount: Float!
    description: String!
    category: String!
    date: String!
    type: String!
  }



  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    transactions: [Transaction]
    transaction(id: ID!): Transaction
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addTransaction(amount: Float!, description: String!, category: String!, date: String!, type: String!): Transaction
    updateTransaction(id: ID!, amount: Float, description: String, category: String, date: String, type: String): Transaction
    removeTransaction(id: ID!): Transaction
  }
`;
export default typeDefs;
