module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'react', 'prettier'],
    settings: {
        react: {
            version: 'detect'
        }
    },
    env: {
        browser: true,
        node: true,
        jquery: true,
        webextensions: true
    },
    rules: {
        'linebreak-style': [0, 'unix'],
        'no-console': [0],
        'no-loop-func': [1],
        'max-len': [0],
        'operator-linebreak': [0],
        'react/jsx-filename-extension': [0],
        'react/react-in-jsx-scope': [0],
        'react/no-multi-comp': [0],
        'react/destructuring-assignment': [0],
        'react/jsx-one-expression-per-line': [0],
        'react/jsx-wrap-multilines': [0],
        'react/jsx-props-no-spreading': [0],
        'react/state-in-constructor': [0],
        'react/static-property-placement': [0],
        '@typescript-eslint/no-explicit-any': [0],
        '@typescript-eslint/no-unused-vars': [2],
        '@typescript-eslint/explicit-function-return-type': [2],
        '@typescript-eslint/no-empty-function': [0],
        'prettier/prettier': 'off'
    },
    globals: {
        axios: true
    }
};
