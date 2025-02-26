import styles from '@/styles/components/Select.module.css';

const Select = ({
  id,
  label,
  name,
  options,
  placeholder = 'Please select an option',
  ...props
}) => {
  id = id || name;
  return (
    <div className={styles.selectContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id} className={styles.select} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            value={option.value}
            key={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
