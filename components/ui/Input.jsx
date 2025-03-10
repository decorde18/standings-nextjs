import styles from '@/styles/components/Input.module.css';

import { useState } from 'react';

const Input = ({
  id,
  label,
  name,
  value,
  placeholder,
  type = 'text',
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || ''); // Set initial state to value or empty string
  // Handle the input change event
  const handleChange = (e) => {
    setInputValue(e.target.value); // Update local state with new value
    if (onChange) {
      onChange(e); // Call the passed onChange function from parent if it exists
    }
  };

  id = id || name;
  placeholder = value || placeholder || '';

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={inputValue} // Control value via local state
        onChange={handleChange} // Handle changes to input value
        {...props}
      />
    </div>
  );
};

export default Input;
