import { useQuery } from "@apollo/client";

import Transactionform from "./Transactionform";
import { QUERY_TRANSACTIONS } from "../utils/queries";

const TransactionPage= () => {
    const {loading, data} = useQuery(QUERY_TRANSACTIONS);
    const transactions = data?.transactions || [];
    if (loading) return <p>Loading...</p>;
    return (
        <div>
            <h2>Your Transactions</h2>
            <Transactionform />
            <ul>
                {transactions.map((tx) => (
                    <li key={tx._id}>
                        {tx.date} - {tx.description}: ${tx.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionPage;
