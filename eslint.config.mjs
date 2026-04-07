import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn',
      'vue/no-unused-vars': 'error',
    },
  },
];
