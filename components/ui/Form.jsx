'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/components/Form.module.css';
import FormSubmitButton from './FormButtonSubmit';
import Input from './Input';
import Select from './Select';
import { useUniversalData } from '@/hooks/useUniversalData';

const Form = ({ fields, table, initialData, redirectPath }) => {
  const { create, update } = useUniversalData({ table });
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [formData, setFormData] = useState(initialData || {});

  const searchParams = useSearchParams();
  const initialValues = Object.fromEntries(searchParams.entries());
  const router = useRouter();
  // TODO: the params allows for values to be added that aren't needed in the fields ie league_id passed from the league to create the division. if it is not necessary, let's remove
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setFormMessage(null);

    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData);

    // Filter out null or empty values
    const filteredData = Object.fromEntries(
      Object.entries({ ...initialValues, ...formDataObject }).filter(
        ([_, value]) => value !== null && value !== '' // Remove null/empty values
      )
    );

    try {
      if (initialData) {
        // Update existing data
        await update({ table, id: initialData.id, data: filteredData });
        console.log(`${table} updated successfully!`);
        setFormMessage('Data updated successfully!');
      } else {
        // Create new data
        await create({ table, data: filteredData });
        console.log(`${table} created successfully!`);
        setFormMessage('Data created successfully!');
      }

      // Redirect logic
      // if (redirectPath === 'previous') {
      //   router.back();
      // } else

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push(`/${table}`);
      }
    } catch (error) {
      console.error('Data operation error:', error);
      setFormMessage('Error saving data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    console.log(e.target);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(formData);
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {fields
        .filter((field) => field.postDisplay !== false)
        .map((field) => (
          <div key={field.name} className={styles.inputContainer}>
            {field.type === 'select' ? (
              <Select
                options={
                  field.selectOptions || initialData[field.name].selectOptions
                }
                name={field.name}
                label={field.label}
                id={field.id}
                placeholder={field.placeholder}
                value={initialData ? initialData[field.name] : ''} // Use initialData or empty string
                disabled={field.disabled}
                onChange={(e) => handleChange(e)}
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                label={field.label}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                required={field.required}
                value={initialData ? initialData[field.name] : ''} // Use initialData or empty string
                disabled={field.disabled}
                hidden={field.hidden}
              />
            )}
          </div>
        ))}
      {formMessage && <p>{formMessage}</p>}
      <FormSubmitButton disabled={isLoading} />
    </form>
  );
};

export default Form;
