import styles from '@/styles/components/Input.module.css';

import { useState, useEffect } from 'react';

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
  const [inputValue, setInputValue] = useState(value ?? ''); // Use `??` to handle null/undefined

  useEffect(() => {
    setInputValue(value ?? ''); // Ensure value is never null
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id || name}>{label}</label>
      <input
        className={styles.input}
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder || ''}
        value={inputValue} // Ensures no null values
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default Input;
