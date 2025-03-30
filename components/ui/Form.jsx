'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/components/Form.module.css';
import FormSubmitButton from './FormButtonSubmit';
import Input from './Input';
import Select from './Select';
import { useUniversalData } from '@/hooks/useUniversalData';

const formatDateForInput = (dateTimeString) => {
  if (!dateTimeString) return '';
  try {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const formatTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return '';
  try {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

const Form = ({
  fields,
  table,
  initialData = {}, // Default to empty object
  handleSelectChange,
  onSubmit,
  redirectPath,
}) => {
  const { create, update } = useUniversalData({ table });
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  // const searchParams = useSearchParams();
  // const initialValues = Object.fromEntries(searchParams.entries());
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setFormMessage(null);

    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData);

    // Include all editable fields from initialData if not present in formDataObject
    fields.forEach((field) => {
      if (field.editable === true && !(field.name in formDataObject)) {
        formDataObject[field.name] = initialData[field.name] || '';
      }
    });
    // Filter out null or empty values
    const filteredData = Object.fromEntries(
      Object.entries(formDataObject).filter(
        ([_, value]) => value !== null && value !== '', // Remove null/empty values
      ),
    );

    try {
      if (initialData.id) {
        // if (Object.keys(initialData).length > 0) {
        // Update existing data
        await update({ table, id: initialData.id, data: filteredData });
        // console.log(`${table} updated successfully!`);
        setFormMessage('Data updated successfully!');
      } else {
        // Create new data
        await create({ table, data: filteredData });
        // console.log(`${table} created successfully!`);
        setFormMessage('Data created successfully!');
      }

      if (onSubmit) return onSubmit();
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
          let fieldValue = initialData[field.name];
          let fieldOptions =
            field?.selectOptions ||
            initialData[field.name]?.selectOptions ||
            []; // Get options from field or initialData
          if (field.type === 'date' && fieldValue) {
            fieldValue = formatDateForInput(fieldValue);
          } else if (field.type === 'time' && fieldValue) {
            fieldValue = formatTimeForInput(fieldValue);
          }
          const fieldData =
            typeof initialData[field.name] === 'object'
              ? initialData[field.name]
              : { value: fieldValue } || {}; //

          return (
            <div key={field.name} className={styles.inputContainer}>
              {field.type === 'select' ? (
                <Select
                  options={
                    field?.selectOptions || fieldData?.selectOptions || []
                  } // Handle missing options
                  name={field.name}
                  label={field.label}
                  id={field.id}
                  placeholder={field.placeholder || 'Select an option'}
                  value={fieldData?.value || ''} // Ensure it doesn't break when empty
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
                  type={field?.type || 'text'}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={fieldData?.value || ''} // Handle empty cases
                  disabled={field.disabled}
                  hidden={field.hidden}
                />
              )}
            </div>
          );
        })}
      {formMessage && <p>{formMessage}</p>}
      {isLoading ? (
        <p>Data is being created</p>
      ) : (
        <FormSubmitButton disabled={isLoading} />
      )}
    </form>
  );
};

export default Form;
