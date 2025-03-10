import styles from '@/styles/components/Select.module.css';

const Select = ({
  id,
  label,
  name,
  options,
  value,
  placeholder = 'Please select an option',
  ...props
}) => {
  id = id || name;
  return (
    <div className={styles.selectContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        name={name}
        className={styles.select}
        defaultValue={value || ''} // Use value prop or default to empty string
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            value={option.value}
            key={option.name || option.value}
            disabled={option.disabled}
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
