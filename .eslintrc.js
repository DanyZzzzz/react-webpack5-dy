module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-explicit-any': ['off'],
        'no-unused-vars': 'off',
        'no-cond-assign': 'error',
        'no-debugger': 'warn',
        'no-dupe-args': 'error',
        'no-caller': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-with': 'error',
        'no-catch-shadow': 'error',
    },
    settings: {
        react: {
            version: '17.0.2',
        },
    },
};
