import React from 'react';

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const Input: React.FC<InputProps> = ({ label, type, placeholder, inputRef }) => {
  return (
    <div className="mb-5"> 
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
        {label}
      </label>
      <input
        ref={inputRef}
        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;