module.exports = {
    root: true,
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    // Add additional configuration here if needed
};
