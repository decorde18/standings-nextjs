'use client';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { handleSave } from './formFunctions';

export async function saveData(prevState, formData) {
  const data = Object.fromEntries(formData.entries());

  //   //todo make these dynamic
  try {
    const response = await handleSave(data);
    return { ...prevState, message: 'Data saved successfully!' };
  } catch (error) {
    console.error('Error saving data:', error);
    return { ...prevState, message: 'Failed to save data.' };
  }
}
