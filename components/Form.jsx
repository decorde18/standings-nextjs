'use client';

import { useActionState } from 'react';
import styles from '@/styles/Form.module.css';
import Input from './Input';
import { saveData } from '@/lib/formActions';
import FormSubmitButton from './FormButtonSubmit';

const Form = ({ fields }) => {
  const [state, formAction] = useActionState(saveData, { message: null });

  return (
    <form className={styles.form} action={formAction}>
      {fields.map(({ label, name, type, placeholder }) => (
        <div key={name} className={styles.inputContainer}>
          <label className={styles.label} htmlFor={name}>
            {label}
          </label>
          <Input
            id={name}
            name={name}
            type={type || 'text'}
            placeholder={placeholder}
            // value={formData[name]}
            // onChange={handleChange}
            // className={styles.input}
          />
        </div>
      ))}
      {state.message && <p>{state.message}</p>}
      <FormSubmitButton />
    </form>
  );
};

export default Form;
