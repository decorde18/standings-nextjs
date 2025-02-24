'use client';
//todo make these dynamic
export async function handleSave(data) {
  try {
    const response = await fetch(`/api/leagues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Fix: Stringify the body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Inserted ID:', responseData.id);
    return responseData; // Optionally return the data
  } catch (error) {
    console.error('Error posting data:', error);
  }
}
