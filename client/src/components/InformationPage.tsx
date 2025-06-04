import React from 'react';

const articles = [
    {
        title: 'How to Create a Budget: Step-by-Step Guide',
        url: 'https://www.nerdwallet.com/article/finance/how-to-budget',
    },
    {
        title: '50/30/20 Rule: A Simple, Explained With Examples',
        url: 'https://www.investopedia.com/ask/answers/022916/what-502030-budget-rule.asp',
    },
    {
        title: '7 Steps to Building a Budget That Works',
        url: 'https://www.ramseysolutions.com/budgeting/how-to-make-a-budget',
    },
    {
        title: 'Budgeting 101: How to Start Budgeting for the First Time',
        url: 'https://www.nerdwallet.com/article/finance/how-to-budget',
    },
];

const InformationPage: React.FC = () => (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
        <h1>Learn How to Budget</h1>
        <p>
            Explore these helpful articles to get started with budgeting and take control of your finances:
        </p>
        <ul>
            {articles.map((article) => (
                <li key={article.url} style={{ marginBottom: '1rem' }}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export default InformationPage;