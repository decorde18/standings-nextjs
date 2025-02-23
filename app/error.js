'use client'; // needed in all error.js

function Error({ error }) {
  return (
    <main className="error">
      {/* error is from the global css file */}
      <h1>An error occurred!</h1>
      <p>There is an unkown error</p>
    </main>
  );
}

export default Error;
