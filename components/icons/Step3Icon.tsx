import React from 'react';

const Step3Icon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M6.176 17.032h11.648" />
      <path d="M6 21v-4a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v4" />
      <path d="M12 13v-9" />
      <path d="M4 12h16" />
      <path d="M5 3l7 4l7 -4" />
    </svg>
);
export default Step3Icon;
