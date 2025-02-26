'use client';

import { useFormStatus } from 'react-dom';
import Button from './Button';

function FormSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>{pending ? 'Submitting...' : 'Save'}</Button>
  );
}

export default FormSubmitButton;
