import { Schema, model } from 'mongoose';
// Define the schema for the Comment subdocument
const transactionSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const Transaction = model('Transaction', transactionSchema);
export default Transaction;
