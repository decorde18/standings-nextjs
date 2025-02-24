import styles from '@/styles/Input.module.css';

const Input = ({ label, placeholder, type = 'text', ...props }) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.input}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;
