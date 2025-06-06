import React, { useState, ChangeEvent, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TRANSACTION } from "../utils/mutations";
import { QUERY_TRANSACTIONS, QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

const initialState = {
  date: "",
  category: "",
  description: "",
  amount: "",
  type: "expense",
};


const TransactionForm: React.FC = () => {
const [formState, setFormState] = useState(initialState);
const [addTransaction, {error}] = useMutation
(ADD_TRANSACTION, {
    refetchQueries: [ QUERY_TRANSACTIONS,'getTransactions', QUERY_ME,'me' ],
  });
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        variables: {
          input: {
            ...formState,
            amount: parseFloat(formState.amount),
          },
        },
      });
      setFormState(initialState);
    } catch (err) {
      // Error handled below
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  if (!Auth.loggedIn()) {
    return (
      <div>
        <p>
          You need to be logged in to add a transaction.{" "}
          <a href="/login">Login</a> or <a href="/signup">Sign up</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="add-tx-form" onSubmit={handleFormSubmit}>
      <input
        type="date"
        name="date"
        value={formState.date}
        onChange={handleChange}
        required
      />
      <select
        name="category"
        value={formState.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="Groceries">Groceries</option>
        <option value="Rent">Rent</option>
        <option value="Utilities">Utilities</option>
        <option value="Entertainment">Entertainment</option>
      </select>
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formState.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formState.amount}
        onChange={handleChange}
        required
        min="0"
        step="0.01"
      />
      <select
        name="type"
        value={formState.type}
        onChange={handleChange}
        required
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <button type="submit">Add Transaction</button>
      {error && (
        <div style={{ color: "#d23f44", marginTop: "0.5rem" }}>
          {error.message}
        </div>
      )}
    </form>
  );
};

export default TransactionForm;