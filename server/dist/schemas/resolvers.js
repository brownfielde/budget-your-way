import { Transactions, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (_parent, { username }) => {
            return User.findOne({ username });
        },
        transactions: async () => {
            return await Transactions.find();
        },
        transaction: async (_parent, args) => {
            return await Transactions.findOne({ id: Number(args.id) });
        },
        // Query to get the authenticated user's information
        // The 'me' query relies on the context to check if the user is authenticated
        me: async (_parent, _args, context) => {
            // If the user is authenticated, find and return the user's information along with their thoughts
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent, { input }) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
            // If no user is found, throw an AuthenticationError
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
        addTransaction: async (_parent, args) => {
            const last = await Transactions.findOne().sort({ id: -1 });
            const newId = last ? last.id + 1 : 1;
            const transaction = await Transactions.create({
                id: newId,
                ...args,
            });
            return transaction;
        },
        updateTransaction: async (_parent, args) => {
            return await Transactions.findOneAndUpdate({ id: Number(args.id) }, { $set: { ...args } }, { new: true });
        },
        removeTransaction: async (_parent, args) => {
            return await Transactions.findOneAndDelete({ id: Number(args.id) });
        },
    },
};
export default resolvers;
