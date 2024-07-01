import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <span>{message}</span>
      <button
        className="ml-4 text-white"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;
