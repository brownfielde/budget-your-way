import db from '../config/connection.js';
import { Transactions, User } from '../models/index.js';
import cleanDB from './cleanDB.js';
import userData from './userData.json' with { type: 'json' };
import transactionsData from './transactionsData.json' with { type: 'json' };
const seedDatabase = async () => {
    try {
        await db();
        await cleanDB();
        await User.create(userData);
        await Transactions.insertMany(transactionsData);
        console.log('Seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDatabase();
