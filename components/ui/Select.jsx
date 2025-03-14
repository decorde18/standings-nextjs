import styles from '@/styles/components/Select.module.css';

const Select = ({
  id,
  label,
  name,
  options = [],
  value,
  onChange,
  placeholder = 'Please select an option',
  ...props
}) => {
  id = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;
  onChange = onChange || (() => {});

  return (
    <div className={styles.selectContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        name={name}
        className={styles.select}
        value={value || ''} // Controlled component
        onChange={onChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option
            key={option.value?.toString() || index}
            value={option.value?.toString() || ''}
            label={option.label?.toString() || ''}
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
