import { Schema, model, Document } from 'mongoose';

// Define an interface for the Thought document
interface ITransaction extends Document {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
}


// Define the schema for the Comment subdocument
const transactionSchema = new Schema<ITransaction>(
  {
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
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);



const Transactions = model<ITransaction>('Transactions', transactionSchema);

export default Transactions;
