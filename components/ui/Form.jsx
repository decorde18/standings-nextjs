'use client';

import { useActionState } from 'react';
import styles from '@/styles/components/Form.module.css';

import { saveData } from '@/lib/formActions';
import FormSubmitButton from './FormButtonSubmit';
import Input from './Input';
import Select from './Select';

const Form = ({ fields }) => {
  const [state, formAction] = useActionState(saveData, { message: null });

  return (
    <form className={styles.form} action={formAction}>
      <Select options={[{ label: 1, value: 1 }]} name="name" label="label" />
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
          />
        </div>
      ))}
      {state.message && <p>{state.message}</p>}
      <FormSubmitButton />
    </form>
  );
};

export default Form;
