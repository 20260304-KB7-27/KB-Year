import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // 1. Prettier 설정: 여기서 모든 레이아웃(줄바꿈, 세미콜론 등)을 결정합니다.
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleAttributePerLine: true,
          printWidth: 100,
        },
      ],

      // 2. ESLint 논리 규칙
      'vue/multi-word-component-names': 'off',
      'no-undef': 'off', // TypeScript가 대신 검사하므로 'boolean' 에러 해결을 위해 끔
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'vue/no-unused-vars': 'error',

      // 3. 충돌 방지: Prettier와 부딪히는 ESLint의 레이아웃 규칙들을 끕니다.
      // Prettier가 대신 관리하므로 'off'로 설정하는 것이 가장 깔끔합니다.
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/singleline-html-element-content-newline': 'off', // 텍스트 한 줄 정렬 방해 금지
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
    },
  },
];
