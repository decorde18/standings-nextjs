module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    'react/prop-types': 'off', // If you don't use PropTypes
    '@typescript-eslint/no-unused-vars': 'warn', // You can change 'warn' to 'error' if needed
    'no-console': 'warn', // Optional: Disables the console.log rule
    'react/jsx-uses-react': 'off', // In case you're using React 17 JSX Transform
    'react/react-in-jsx-scope': 'off', // In case you're using React 17 JSX Transform
  },
};
