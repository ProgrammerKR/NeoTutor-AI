import React from 'react';

const BotIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-2.25 3h4.5m-6.75 3h9M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9-9-4.03-9-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9a.375.375 0 100-.75.375.375 0 000 .75zM8.25 9a.375.375 0 100-.75.375.375 0 000 .75z" />
    </svg>
);

export default BotIcon;
