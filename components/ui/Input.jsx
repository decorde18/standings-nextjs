import styles from '@/styles/components/Input.module.css';

const Input = ({ id, label, name, placeholder, type = 'text', ...props }) => {
  id = id || name;
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;
