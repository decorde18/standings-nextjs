'use client';

import { useActionState } from 'react';
import styles from '@/styles/components/Form.module.css';

import FormSubmitButton from './FormButtonSubmit';
import Input from './Input';
import Select from './Select';
// import { postData } from '@/lib/data-services';
// import { handleSave } from '@/lib/formFunctions';
import { saveData } from '@/lib/formActions';

const Form = ({ fields }) => {
  const [state, formAction] = useActionState(saveData, { message: null });

  return (
    <form className={styles.form} action={formAction}>
      <Select options={[{ label: 1, value: 1 }]} name="name" label="label" />
      {fields.map(({ label, name, type, placeholder }) => (
        <div key={name} className={styles.inputContainer}>
          <Input
            id={name}
            name={name}
            label={label}
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
