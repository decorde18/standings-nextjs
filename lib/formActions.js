'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { handleSave } from './formFunctions';
import { postData } from './data-services';

export async function saveData(prevState, formData) {
  // const data = Object.fromEntries(formData.entries());
  const data = { name: formData.get('name') };
  // //todo make these dynamic
  // try {
  //   const response = await postData('leagues', data);
  //   return { ...prevState, message: 'Data saved successfully!' };
  // } catch (error) {
  //   console.error('Error saving data:', error);
  //   return { ...prevState, message: 'Failed to save data.' };
  // }
  await postData('leagues', data);
  revalidatePath('/leagues1', 'layout'); // would need to revalidate any nested content, so we add the layout
  redirect('/leagues1');
}
