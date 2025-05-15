module.exports = {
  extends: [
    'react-app', // Uses Create React App's base ESLint config
    'react-app/jest',
    'plugin:prettier/recommended', // Integrates Prettier with ESLint
  ],
  plugins: [
    // 'react', // react-app already includes eslint-plugin-react
    // '@typescript-eslint', // react-app already includes @typescript-eslint/eslint-plugin
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'warn', // Show Prettier issues as warnings
    '@typescript-eslint/no-unused-expressions': 'error',
    // You can add or override ESLint rules here, for example:
    // 'react/prop-types': 'off', // Not needed with TypeScript
    // '@typescript-eslint/explicit-function-return-type': 'warn',
  },
};
