'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/components/Form.module.css';
import FormSubmitButton from './FormButtonSubmit';
import Input from './Input';
import Select from './Select';
import { useUniversalData } from '@/hooks/useUniversalData';

const Form = ({
  fields,
  table,
  initialData = {}, // Default to empty object
  redirectPath,
  handleSelectChange,
}) => {
  const { create, update } = useUniversalData({ table });
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const searchParams = useSearchParams();
  const initialValues = Object.fromEntries(searchParams.entries());
  const router = useRouter();

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
      if (Object.keys(initialData).length > 0) {
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
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {fields
        .filter((field) => field.postDisplay !== false)
        .map((field) => {
          const fieldData =
            typeof initialData[field.name] === 'object'
              ? initialData[field.name]
              : { value: initialData[field.name] } || {}; //
          return (
            <div key={field.name} className={styles.inputContainer}>
              {field.type === 'select' ? (
                <Select
                  options={field.selectOptions || fieldData.selectOptions || []} // Handle missing options
                  name={field.name}
                  label={field.label}
                  id={field.id}
                  placeholder={field.placeholder || 'Select an option'}
                  value={fieldData.value || ''} // Ensure it doesn't break when empty
                  disabled={field.disabled}
                  onChange={
                    handleSelectChange ||
                    fieldData.handleSelectChange ||
                    (() => {})
                  }
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={fieldData.value || ''} // Handle empty cases
                  disabled={field.disabled}
                  hidden={field.hidden}
                />
              )}
            </div>
          );
        })}
      {formMessage && <p>{formMessage}</p>}
      <FormSubmitButton disabled={isLoading} />
    </form>
  );
};

export default Form;
