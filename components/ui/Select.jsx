import styles from '@/styles/components/Select.module.css';

const Select = ({
  id,
  label,
  name,
  options = [],
  value,
  onChange,
  placeholder = 'Please select an option',
  disabled = false,
  ...props
}) => {
  id = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.selectContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        name={name}
        className={styles.select}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => {
          const optionValue =
            option.value?.toString() ||
            option.name?.toString() ||
            index.toString();
          const optionLabel =
            option.label?.toString() || option.name?.toString() || optionValue;

          return (
            <option
              key={optionValue}
              value={optionValue}
              disabled={option.disabled}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
