import React from 'react';
import './Action.css';

type ActionButtonProps = {
  text: string;
  className: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({ text, className }) => (
  <button className={className}>
    {text}
    <span className="arrow"></span>
  </button>
);

const Action: React.FC = () => {
  return (
    <div className="hero-container">
      <ActionButton text="Get started" className="button get-started" />
      <ActionButton text="Contact sales" className="button contact-sales" />
    </div>
  );
};

export default Action;