'use client';
import styles from '@/styles/components/Button.module.css';

// TODO:  work on this to make a component. should mix with FormButtonSubmit
const Button = ({ id, name, children, type, ...props }) => {
  id = id || name;
  return (
    <div className={styles.buttonContainer}>
      <button id={id} type={type} className={styles.button} {...props}>
        {children}
      </button>
    </div>
  );
};

export default Button;
